
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl
from fastapi import APIRouter, HTTPException, Depends

from app.dependencies import get_current_user


router = APIRouter(
    prefix="/checkins",
    tags=["Check-ins"]
)


class CheckinCreate(BaseModel):
    area_id: UUID
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    photo_url: HttpUrl


@router.post("/")
def create_checkin(
    checkin: CheckinCreate,
    current_user: dict = Depends(get_current_user)
):
    client = current_user["client"]

    try:
        response = client.rpc(
            "create_checkin_with_missions",
            {
                "p_area_id": str(checkin.area_id),
                "p_latitude": checkin.latitude,
                "p_longitude": checkin.longitude,
                "p_photo_url": str(checkin.photo_url)
            }
        ).execute()

        return response.data

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
