from fastapi import APIRouter, HTTPException
from app.database import supabase

router = APIRouter(
    prefix="/places",
    tags=["Places"]
)


@router.get("/")
def get_places():
    response = (
        supabase
        .table("green_areas")
        .select("*")
        .execute()
    )

    return {
        "places": response.data
    }


@router.get("/{place_id}")
def get_place_by_id(place_id: str):
    response = (
        supabase
        .table("green_areas")
        .select("*")
        .eq("area_id", place_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Place not found"
        )

    return response.data[0]