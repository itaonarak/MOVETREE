
import base64
import binascii
import os
import re
import uuid
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database import supabase_admin
from app.dependencies import get_current_user

# Public Supabase Storage bucket that holds post photos
POST_IMAGE_BUCKET = os.getenv("POST_IMAGE_BUCKET", "post-images")
MAX_IMAGE_BYTES = 5 * 1024 * 1024
DATA_URI_RE = re.compile(r"^data:image/(jpeg|jpg|png);base64,(.+)$", re.DOTALL)

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


_bucket_ready = False


def ensure_image_bucket():
    """Create the public post-image bucket the first time it's needed."""
    global _bucket_ready
    if _bucket_ready:
        return
    existing = {b.name for b in supabase_admin.storage.list_buckets()}
    if POST_IMAGE_BUCKET not in existing:
        supabase_admin.storage.create_bucket(
            POST_IMAGE_BUCKET, options={"public": True}
        )
    _bucket_ready = True


class PostCreate(BaseModel):
    image: str  # data URI (data:image/jpeg;base64,...) of the photo
    caption: str = Field(default="", max_length=500)
    location: str = Field(default="", max_length=200)  # typed place name
    visibility: Literal["public", "friends", "private"] = "public"


@router.post("/")
def create_post(
    post: PostCreate,
    current_user: dict = Depends(get_current_user)
):
    client = current_user["client"]
    user_id = current_user["user_id"]

    match = DATA_URI_RE.match(post.image)
    if not match:
        raise HTTPException(status_code=400, detail="Invalid image")
    try:
        image_bytes = base64.b64decode(match.group(2), validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=400, detail="Invalid image")
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image is too large")

    ext = "png" if match.group(1) == "png" else "jpg"
    content_type = "image/png" if ext == "png" else "image/jpeg"

    try:
        # Upload the photo; stored under the user's folder
        ensure_image_bucket()
        path = f"{user_id}/{uuid.uuid4()}.{ext}"
        storage = supabase_admin.storage.from_(POST_IMAGE_BUCKET)
        storage.upload(path, image_bytes, {"content-type": content_type})
        image_url = storage.get_public_url(path)

        # Location is free text for now: link it to a green area when the name matches
        area_id = None
        location = post.location.strip()
        if location:
            area_response = (
                client.table("green_areas")
                .select("area_id")
                .ilike("name", location)
                .limit(1)
                .execute()
            )
            if area_response.data:
                area_id = area_response.data[0]["area_id"]

        collection_response = (
            client.table("collections")
            .insert({
                "user_id": user_id,
                "image_url": image_url,
                "area_id": area_id,
            })
            .execute()
        )
        collection_id = collection_response.data[0]["collection_id"]

        post_response = (
            client.table("posts")
            .insert({
                "user_id": user_id,
                "collection_id": collection_id,
                "caption": post.caption.strip(),
                "visibility": post.visibility,
                "post_type": "photo",
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
