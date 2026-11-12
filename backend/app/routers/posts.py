
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

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
                users!posts_user_id_fkey (
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


@router.get("/my-posts")
def get_my_posts(current_user: dict = Depends(get_current_user)):
    client = current_user["client"]
    user_id = current_user["user_id"]

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
                users!posts_user_id_fkey(username, avatar_url),
                collections (
                    image_url,
                    area_id,
                    green_areas (
                        name
                    )
                )
                """
            )
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return {"posts": response.data}

    except Exception as e:
        print("GET MY POSTS ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve your posts"
        )


class PostCreate(BaseModel):
    check_in_id: UUID
    caption: str = Field(default="", max_length=500)
    visibility: Literal["public", "friends"] = "public"


@router.post("/")
def create_post(
    post: PostCreate,
    current_user: dict = Depends(get_current_user)
):
    client = current_user["client"]
    user_id = current_user["user_id"]

    try:
        # Find a successful check-in owned by the current user
        checkin_response = (
            client.table("check_ins")
            .select("check_in_id, user_id, area_id, photo_url, status")
            .eq("check_in_id", str(post.check_in_id))
            .eq("user_id", user_id)
            .eq("status", "success")
            .maybe_single()
            .execute()
        )

        checkin = checkin_response.data

        if not checkin:
            raise HTTPException(
                status_code=400,
                detail="A successful check-in is required before posting"
            )

        # Create collection using the check-in photo and selected area
        collection_response = (
            client.table("collections")
            .insert({
                "user_id": user_id,
                "area_id": checkin["area_id"],
                "image_url": checkin["photo_url"],
                "caption": post.caption.strip(),
            })
            .execute()
        )

        if not collection_response.data:
            raise HTTPException(
                status_code=400,
                detail="Could not create collection"
            )

        collection_id = collection_response.data[0]["collection_id"]

        # Create post linked to the successful check-in
        post_response = (
            client.table("posts")
            .insert({
                "user_id": user_id,
                "collection_id": collection_id,
                "caption": post.caption.strip(),
                "visibility": post.visibility,
                "post_type": "checkin",
                "check_in_id": str(post.check_in_id),
            })
            .execute()
        )

        return post_response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        print("CREATE POST ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not create post"
        )
