
from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/places",
    tags=["Places"]
)


# Temporary sample data
places = [
    {
        "id": 1,
        "name": "Lumphini Park",
        "description": "A large public park with green spaces and walking paths.",
        "location": "Bangkok, Thailand",
        "activities": ["Walking", "Photography", "Bird Watching"]
    },
    {
        "id": 2,
        "name": "Benjakitti Park",
        "description": "A public park with a lake, wetlands, and nature trails.",
        "location": "Bangkok, Thailand",
        "activities": ["Walking", "Cycling", "Photography"]
    },
    {
        "id": 3,
        "name": "Chatuchak Park",
        "description": "A green public park suitable for relaxing and outdoor activities.",
        "location": "Bangkok, Thailand",
        "activities": ["Walking", "Jogging", "Photography"]
    }
]


@router.get("/")
def get_places():
    return {
        "places": places
    }



@router.get("/{place_id}")
def get_place_by_id(place_id: int):
    for place in places:
        if place["id"] == place_id:
            return place

    raise HTTPException(
        status_code=404,
        detail="Place not found"
    )
