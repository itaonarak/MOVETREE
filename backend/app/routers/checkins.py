
import base64
import binascii
import os
import re
import uuid

from uuid import UUID
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Depends

from app.database import supabase_admin
from app.dependencies import get_current_user


router = APIRouter(
    prefix="/checkins",
    tags=["Check-ins"]
)

POST_IMAGE_BUCKET = os.getenv("POST_IMAGE_BUCKET", "post-images")
MAX_IMAGE_BYTES = 5 * 1024 * 1024

DATA_URI_RE = re.compile(
    r"^data:image/(jpeg|jpg|png);base64,(.+)$",
    re.DOTALL
)


class CheckinCreate(BaseModel):
    area_id: UUID
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    image: str


def upload_checkin_image(image: str, user_id: str):
    match = DATA_URI_RE.match(image)

    if not match:
        raise HTTPException(
            status_code=400,
            detail="Invalid image"
        )

    try:
        image_bytes = base64.b64decode(
            match.group(2),
            validate=True
        )
    except (binascii.Error, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Invalid image"
        )

    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Image is too large"
        )

    ext = "png" if match.group(1) == "png" else "jpg"
    content_type = "image/png" if ext == "png" else "image/jpeg"

    try:
        path = f"{user_id}/{uuid.uuid4()}.{ext}"

        storage = supabase_admin.storage.from_(POST_IMAGE_BUCKET)

        storage.upload(
            path,
            image_bytes,
            {"content-type": content_type}
        )

        return storage.get_public_url(path)

    except Exception as e:
        print("IMAGE UPLOAD ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Could not upload image"
        )


@router.post("/")
def create_checkin(
    checkin: CheckinCreate,
    current_user: dict = Depends(get_current_user)
):
    client = current_user["client"]
    user_id = current_user["user_id"]

    try:
        photo_url = upload_checkin_image(
            checkin.image,
            str(user_id)
        )

        response = client.rpc(
            "create_checkin_with_missions",
            {
                "p_area_id": str(checkin.area_id),
                "p_latitude": checkin.latitude,
                "p_longitude": checkin.longitude,
                "p_photo_url": photo_url
            }
        ).execute()

        return response.data

    except HTTPException:
        raise
    except Exception as e:
        print("CHECK-IN ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not create check-in"
        )


@router.get("/")
def get_checkins(
    current_user: dict = Depends(get_current_user)
):
    try:
        client = current_user["client"]
        user_id = current_user["user_id"]

        response = (
            client.table("check_ins")
            .select("*")
            .eq("user_id", user_id)
            .order("checked_in_at", desc=True)
            .execute()
        )

        return {"checkins": response.data}

    except Exception as e:
        print("GET CHECK-INS ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve check-ins"
        )


@router.get("/{checkin_id}")
def get_checkin_by_id(
    checkin_id: UUID,
    current_user: dict = Depends(get_current_user)
):
    try:
        client = current_user["client"]
        user_id = current_user["user_id"]

        response = (
            client.table("check_ins")
            .select("*")
            .eq("check_in_id", str(checkin_id))
            .eq("user_id", user_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Check-in not found"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        print("GET CHECK-IN ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve check-in"
        )
