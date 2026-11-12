
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.dependencies import get_current_user
from app.database import supabase_admin


router = APIRouter(prefix="/friends", tags=["Friends"])


class FriendRequestCreate(BaseModel):
    receiver_id: str


# =========================
# Notification Helpers
# =========================

def get_username(user_id):
    try:
        result = (
            supabase_admin.table("users")
            .select("username")
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )

        if result.data:
            return result.data.get("username") or "ผู้ใช้"

    except Exception as e:
        print("Get username error:", repr(e))

    return "ผู้ใช้"


def create_notification(user_id, notification_type, title, message):
    try:
        supabase_admin.table("notifications").insert({
            "user_id": user_id,
            "type": notification_type,
            "title": title,
            "message": message,
        }).execute()

    except Exception as e:
        print("Create notification error:", repr(e))


def get_profile(row, profile_key):
    profile = row.get(profile_key) or {}

    return {
        "id": row["friendship_id"],
        "friendship_id": row["friendship_id"],
        "user_id": profile.get("user_id"),
        "username": profile.get("username"),
        "avatar_url": profile.get("avatar_url"),
        "created_at": row.get("created_at"),
    }


# =========================
# Search Users
# =========================

@router.get("/search")
def search_users(
    username: str = Query(..., min_length=1, max_length=50),
    current_user: dict = Depends(get_current_user),
):
    client = current_user["client"]
    user_id = current_user["user_id"]

    try:
        result = (
            client.table("users")
            .select("user_id, username, avatar_url")
            .ilike("username", f"%{username.strip()}%")
            .neq("user_id", user_id)
            .limit(20)
            .execute()
        )

        return {"users": result.data or []}

    except Exception as e:
        print("Search users error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to search users",
        )


# =========================
# Send Friend Request
# =========================

@router.post("/requests")
def send_friend_request(
    request: FriendRequestCreate,
    current_user: dict = Depends(get_current_user),
):
    client = current_user["client"]
    user_id = current_user["user_id"]
    receiver_id = request.receiver_id

    if receiver_id == user_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot send a friend request to yourself",
        )

    try:
        # Check whether target user exists.
        target = (
            client.table("users")
            .select("user_id")
            .eq("user_id", receiver_id)
            .maybe_single()
            .execute()
        )

        if not target.data:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        # Check existing relationship in either direction.
        existing = (
            client.table("friendships")
            .select(
                "friendship_id, requester_id, receiver_id, status"
            )
            .or_(
                f"and(requester_id.eq.{user_id},receiver_id.eq.{receiver_id}),"
                f"and(requester_id.eq.{receiver_id},receiver_id.eq.{user_id})"
            )
            .limit(1)
            .execute()
        )

        rows = existing.data or []

        if rows:
            friendship = rows[0]
            status = friendship["status"]

            if status == "accepted":
                raise HTTPException(
                    status_code=409,
                    detail="You are already friends",
                )

            if status == "pending":
                if friendship["requester_id"] == user_id:
                    detail = "Friend request already sent"
                else:
                    detail = "This user has already sent you a friend request"

                raise HTTPException(
                    status_code=409,
                    detail=detail,
                )

            # Resend a previously rejected request.
            if status == "rejected":
                updated = (
                    client.table("friendships")
                    .update({
                        "requester_id": user_id,
                        "receiver_id": receiver_id,
                        "status": "pending",
                    })
                    .eq("friendship_id", friendship["friendship_id"])
                    .select("friendship_id")
                    .execute()
                )

                if not updated.data:
                    raise HTTPException(
                        status_code=403,
                        detail="Failed to resend friend request. Check friendships UPDATE RLS policy.",
                    )

                create_notification(
                    user_id=receiver_id,
                    notification_type="friend_request",
                    title="คำขอเป็นเพื่อนใหม่",
                    message=f"{get_username(user_id)} ส่งคำขอเป็นเพื่อนถึงคุณ",
                )

                return {
                    "message": "Friend request sent successfully",
                    "friendship_id": updated.data[0]["friendship_id"],
                }

        # Create a new relationship.
        result = (
            client.table("friendships")
            .insert({
                "requester_id": user_id,
                "receiver_id": receiver_id,
                "status": "pending",
            })
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to send friend request",
            )

        create_notification(
            user_id=receiver_id,
            notification_type="friend_request",
            title="คำขอเป็นเพื่อนใหม่",
            message=f"{get_username(user_id)} ส่งคำขอเป็นเพื่อนถึงคุณ",
        )

        return {
            "message": "Friend request sent successfully",
            "friendship_id": result.data[0]["friendship_id"],
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Send friend request error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to send friend request",
        )


# =========================
# Get Friends
# =========================

@router.get("/")
def get_friends(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    client = current_user["client"]

    try:
        sent = (
            client.table("friendships")
            .select(
                "friendship_id, requester_id, receiver_id, created_at, "
                "receiver:users!friendships_receiver_id_fkey(user_id, username, avatar_url)"
            )
            .eq("requester_id", user_id)
            .eq("status", "accepted")
            .execute()
        )

        received = (
            client.table("friendships")
            .select(
                "friendship_id, requester_id, receiver_id, created_at, "
                "requester:users!friendships_requester_id_fkey(user_id, username, avatar_url)"
            )
            .eq("receiver_id", user_id)
            .eq("status", "accepted")
            .execute()
        )

        friends = []

        for row in sent.data or []:
            friends.append(get_profile(row, "receiver"))

        for row in received.data or []:
            friends.append(get_profile(row, "requester"))

        return {"friends": friends}

    except Exception as e:
        print("Get friends error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to get friends",
        )


# =========================
# Get Incoming Friend Requests
# =========================

@router.get("/requests")
def get_friend_requests(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    client = current_user["client"]

    try:
        result = (
            client.table("friendships")
            .select(
                "friendship_id, requester_id, receiver_id, created_at, "
                "requester:users!friendships_requester_id_fkey(user_id, username, avatar_url)"
            )
            .eq("receiver_id", user_id)
            .eq("status", "pending")
            .order("created_at", desc=True)
            .execute()
        )

        requests = [
            get_profile(row, "requester")
            for row in (result.data or [])
        ]

        return {"requests": requests}

    except Exception as e:
        print("Get friend requests error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to get friend requests",
        )


# =========================
# Accept Friend Request
# =========================

@router.patch("/requests/{friendship_id}/accept")
def accept_friend_request(
    friendship_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]
    client = current_user["client"]

    try:
        existing = (
            client.table("friendships")
            .select("friendship_id, requester_id, receiver_id, status")
            .eq("friendship_id", friendship_id)
            .maybe_single()
            .execute()
        )

        if not existing.data:
            raise HTTPException(
                status_code=404,
                detail="Friend request not found",
            )

        request = existing.data

        if request["receiver_id"] != user_id:
            raise HTTPException(
                status_code=403,
                detail="You are not the receiver of this friend request",
            )

        if request["status"] != "pending":
            raise HTTPException(
                status_code=409,
                detail="Friend request already processed",
            )

        requester_id = request["requester_id"]

        result = (
            client.table("friendships")
            .update({"status": "accepted"})
            .eq("friendship_id", friendship_id)
            .eq("receiver_id", user_id)
            .eq("status", "pending")
            .select("friendship_id")
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="Friend request not found or already processed",
            )

        create_notification(
            user_id=requester_id,
            notification_type="friend_accepted",
            title="คำขอเป็นเพื่อนได้รับการตอบรับ",
            message=f"{get_username(user_id)} ยอมรับคำขอเป็นเพื่อนของคุณแล้ว",
        )

        return {"message": "Friend request accepted"}

    except HTTPException:
        raise

    except Exception as e:
        print("Accept friend request error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to accept friend request",
        )


# =========================
# Reject Friend Request
# =========================

@router.patch("/requests/{friendship_id}/reject")
def reject_friend_request(
    friendship_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]
    client = current_user["client"]

    try:
        existing = (
            client.table("friendships")
            .select("friendship_id, requester_id, receiver_id, status")
            .eq("friendship_id", friendship_id)
            .maybe_single()
            .execute()
        )

        if not existing.data:
            raise HTTPException(
                status_code=404,
                detail="Friend request not found",
            )

        request = existing.data

        if request["receiver_id"] != user_id:
            raise HTTPException(
                status_code=403,
                detail="You are not the receiver of this friend request",
            )

        if request["status"] != "pending":
            raise HTTPException(
                status_code=409,
                detail=f"Friend request already processed: {request['status']}",
            )

        result = (
            client.table("friendships")
            .update({"status": "rejected"})
            .eq("friendship_id", friendship_id)
            .eq("receiver_id", user_id)
            .eq("status", "pending")
            .select("friendship_id")
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=403,
                detail="Update failed. Check friendships UPDATE permission (RLS)",
            )

        return {"message": "Friend request rejected"}

    except HTTPException:
        raise

    except Exception as e:
        print("Reject friend request error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to reject friend request",
        )


# =========================
# Remove Friend
# =========================

@router.delete("/{friendship_id}")
def remove_friend(
    friendship_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["user_id"]
    client = current_user["client"]

    try:
        result = (
            client.table("friendships")
            .delete()
            .eq("friendship_id", friendship_id)
            .eq("status", "accepted")
            .or_(
                f"requester_id.eq.{user_id},receiver_id.eq.{user_id}"
            )
            .select("friendship_id")
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="Friendship not found or already removed",
            )

        return {"message": "Friend removed successfully"}

    except HTTPException:
        raise

    except Exception as e:
        print("Remove friend error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to remove friend",
        )
