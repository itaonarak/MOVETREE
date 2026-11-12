
from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_current_user


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


# =========================
# Get Notifications
# =========================

@router.get("/")
def get_notifications(
    current_user: dict = Depends(get_current_user),
):
    client = current_user["client"]
    user_id = current_user["user_id"]

    try:
        result = (
            client.table("notifications")
            .select(
                "notification_id, user_id, type, title, message, is_read, created_at"
            )
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(100)
            .execute()
        )

        return {
            "notifications": result.data or [],
        }

    except Exception as e:
        print("Get notifications error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to get notifications",
        )


# =========================
# Get Unread Count
# =========================

@router.get("/unread-count")
def get_unread_count(
    current_user: dict = Depends(get_current_user),
):
    client = current_user["client"]
    user_id = current_user["user_id"]

    try:
        result = (
            client.table("notifications")
            .select("notification_id")
            .eq("user_id", user_id)
            .eq("is_read", False)
            .execute()
        )

        return {
            "unread_count": len(result.data or []),
        }

    except Exception as e:
        print("Get unread count error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to get unread count",
        )


# =========================
# Mark One Notification as Read
# =========================

@router.patch("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    client = current_user["client"]
    user_id = current_user["user_id"]

    try:
        result = (
            client.table("notifications")
            .update({"is_read": True})
            .eq("notification_id", notification_id)
            .eq("user_id", user_id)
            .select("notification_id")
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="Notification not found",
            )

        return {
            "message": "Notification marked as read",
        }

    except HTTPException:
        raise
    except Exception as e:
        print("Mark notification as read error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to mark notification as read",
        )


# =========================
# Mark All Notifications as Read
# =========================

@router.patch("/read-all")
def mark_all_notifications_as_read(
    current_user: dict = Depends(get_current_user),
):
    client = current_user["client"]
    user_id = current_user["user_id"]

    try:
        result = (
            client.table("notifications")
            .update({"is_read": True})
            .eq("user_id", user_id)
            .eq("is_read", False)
            .select("notification_id")
            .execute()
        )

        return {
            "message": "All notifications marked as read",
            "updated_count": len(result.data or []),
        }

    except Exception as e:
        print("Mark all notifications as read error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to mark all notifications as read",
        )
