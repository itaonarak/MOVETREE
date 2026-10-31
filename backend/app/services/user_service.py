
from fastapi import HTTPException
from app.database import supabase, supabase_admin



def register_user_service(username: str, email: str, password: str):
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "username": username
                }
            }
        })

        auth_user = response.user

        if auth_user is None:
            raise HTTPException(
                status_code=400,
                detail="Registration failed"
            )

        return {
            "message": "Registration successful",
            "user_id": str(auth_user.id),
            "username": username,
            "email": email
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )



def login_user_service(username: str, password: str):
    try:
        # Find email from username
        email_response = supabase_admin.rpc(
            "get_email_by_username",
            {"input_username": username}
        ).execute()

        email = email_response.data

        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        # Login with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if response.user is None or response.session is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        return {
            "message": "Login successful",
            "user_id": str(response.user.id),
            "username": username,
            "access_token": response.session.access_token,
            "token_type": "bearer"
        }

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )


