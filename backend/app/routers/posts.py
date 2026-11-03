
from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_current_user

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("/feed")
def get_social_feed(current_user: dict = Depends(get_current_user)):
    client = current_user["client"]

    try:
        response = (
            client.table("posts")
            .select(
                """
                post_id,
                user_id,
                collection_id,
                caption,
                visibility,
                post_type,
                check_in_id,
                created_at,
                users (
                    username,
                    avatar_url
                ),
                collections (
                    image_url,
                    area_id,
                    green_areas (
                        name
                    )
                )
                """
            )
            .order("created_at", desc=True)
            .execute()
        )

        return {"posts": response.data}

    except Exception as e:
        print("GET SOCIAL FEED ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve social feed"
        )
