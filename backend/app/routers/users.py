
import json
import urllib.error
import urllib.request

from fastapi import APIRouter, Depends, HTTPException
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    model_validator,
)

from app.database import SUPABASE_URL, SUPABASE_KEY, supabase_admin
from app.dependencies import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


# =========================
# Request Schemas
# =========================

class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)
    confirm_password: str = Field(min_length=8)

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class UserLogin(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str


class ChangeUsernameRequest(BaseModel):
    new_username: str = Field(min_length=3, max_length=50)


class ChangeEmailRequest(BaseModel):
    email: EmailStr


class ChangePasswordRequest(BaseModel):
    password: str = Field(min_length=8)


class VerifyPasswordRequest(BaseModel):
    password: str = Field(min_length=1)


# =========================
# Supabase Auth Helpers
# =========================

def update_auth_user(current_user: dict, payload: dict):
    url = f"{SUPABASE_URL}/auth/v1/user"

    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {current_user['access_token']}",
        },
        method="PUT",
    )

    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode("utf-8"))

    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8")

        try:
            error_data = json.loads(detail)
            detail = (
                error_data.get("msg")
                or error_data.get("message")
                or detail
            )
        except Exception:
            pass

        raise HTTPException(status_code=400, detail=detail)


def verify_supabase_password(email: str, password: str):
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"

    payload = {
        "email": email,
        "password": password,
    }

    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode("utf-8"))

    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8")

        if error.code in (400, 401):
            raise HTTPException(
                status_code=401,
                detail="Incorrect password"
            )

        if error.code == 429:
            raise HTTPException(
                status_code=429,
                detail="Too many verification attempts. Please try again later."
            )

        print("Verify password error:", detail)

        raise HTTPException(
            status_code=502,
            detail="Unable to verify password"
        )

    except urllib.error.URLError as error:
        print("Verify password connection error:", error)

        raise HTTPException(
            status_code=502,
            detail="Unable to connect to authentication service"
        )


# =========================
# Get Current User
# =========================

@router.get("/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):
    try:
        response = (
            current_user["client"]
            .table("users")
            .select("user_id, username, avatar_url")
            .eq("user_id", current_user["user_id"])
            .maybe_single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )

        return {
            **response.data,
            "email": current_user["email"]
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Get profile error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to get user profile"
        )


# =========================
# Change Username
# =========================

@router.patch("/me/username")
def change_username(
    request: ChangeUsernameRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    client = current_user["client"]

    new_username = request.new_username.strip()
    current_profile = (
    client.table("users")
    .select("username")
    .eq("user_id", user_id)
    .maybe_single()
    .execute()
)

    if not current_profile.data:
        raise HTTPException(
            status_code=404,
            detail="User profile not found"
        )

    if current_profile.data["username"] == new_username:
        raise HTTPException(
            status_code=400,
            detail="New username is the same as current username"
        )

    if len(new_username) < 3 or len(new_username) > 50:
        raise HTTPException(
            status_code=400,
            detail="Username must be between 3 and 50 characters"
        )

    try:
        # Check whether the username is already used by another account.
        existing = (
            client.table("users")
            .select("user_id, username")
            .eq("username", new_username)
            .neq("user_id", str(user_id))
            .execute()
        )

        if existing.data:
            raise HTTPException(
                status_code=409,
                detail="Username already exists"
            )
        # Update username in the application users table.
        updated = (
            client.table("users")
            .update({"username": new_username})
            .eq("user_id", user_id)
            .execute()
        )

        if not updated.data:
            raise HTTPException(
                status_code=404,
                detail="User profile not found"
            )

        # Update Supabase Auth user metadata.
        # This does not change the user's email or password.
        try:
            update_auth_user(
                current_user,
                {
                    "data": {
                        "username": new_username
                    }
                }
            )

        except HTTPException as error:
            # Roll back the application profile if Auth metadata fails.
            try:
                (
                    client.table("users")
                    .update({
                        "username": current_user.get("username")
                    })
                    .eq("user_id", user_id)
                    .execute()
                )
            except Exception as rollback_error:
                print("Username rollback error:", rollback_error)

            raise error

        return {
            "message": "Username updated successfully",
            "username": new_username
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Change username error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to update username"
        )


# =========================
# Verify Current Password
# =========================

@router.post("/verify-password")
def verify_current_password(
    request: VerifyPasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    email = current_user.get("email")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="User email is not available"
        )

    verify_supabase_password(
        email=email,
        password=request.password
    )

    return {
        "verified": True,
        "message": "Password verified successfully"
    }


# =========================
# Change Email
# =========================

@router.put("/me/email")
def change_email(
    request: ChangeEmailRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        update_auth_user(
            current_user,
            {"email": str(request.email)}
        )

        return {
            "message": (
                "Email update requested. "
                "Please check your new email for confirmation."
            )
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Change email error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to update email"
        )


# =========================
# Change Password
# =========================

@router.put("/me/password")
def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        update_auth_user(
            current_user,
            {"password": request.password}
        )

        return {
            "message": "Password updated successfully"
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Change password error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to update password"
        )


# =========================
# Delete Current User
# =========================

@router.delete("/me")
def delete_my_account(
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]

    try:
        # Delete application data first to satisfy foreign keys.
        supabase_admin.rpc(
            "delete_user_data",
            {"p_user_id": user_id}
        ).execute()

        # Delete Supabase Auth user.
        supabase_admin.auth.admin.delete_user(user_id)

        return {
            "message": "Account deleted successfully"
        }

    except Exception as e:
        print("Delete account error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to delete account"
        )
