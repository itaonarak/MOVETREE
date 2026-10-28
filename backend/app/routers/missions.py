
from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/missions",
    tags=["Missions"]
)


# Temporary sample data
missions = [
    {
        "id": 1,
        "name": "First Step",
        "description": "Check in at one nature location.",
        "type": "daily",
        "condition": {
            "action": "checkin",
            "target_count": 1
        },
        "points": 10
    },
    {
        "id": 2,
        "name": "Nature Explorer",
        "description": "Check in at two nature locations.",
        "type": "daily",
        "condition": {
            "action": "checkin",
            "target_count": 2
        },
        "points": 20
    },
    {
        "id": 3,
        "name": "Green Moment",
        "description": "Take one photo of nature.",
        "type": "daily",
        "condition": {
            "action": "take_photo",
            "target_count": 1
        },
        "points": 15
    },
    {
        "id": 4,
        "name": "Benjakitti Explorer",
        "description": "Check in at Benjakitti Park.",
        "type": "permanent",
        "condition": {
            "action": "checkin",
            "place_id": 2
        },
        "points": 30
    },
    {
        "id": 5,
        "name": "Park Hopper",
        "description": "Check in at five different nature locations.",
        "type": "permanent",
        "condition": {
            "action": "checkin",
            "target_count": 5,
            "unique_places": True
        },
        "points": 50
    }
]


@router.get("/")
def get_missions():
    return {
        "missions": missions
    }


@router.get("/{mission_id}")
def get_mission_by_id(mission_id: int):
    for mission in missions:
        if mission["id"] == mission_id:
            return mission

    raise HTTPException(
        status_code=404,
        detail="Mission not found"
    )
