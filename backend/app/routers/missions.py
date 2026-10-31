
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends

from app.dependencies import get_current_user


router = APIRouter(
    prefix="/missions",
    tags=["Missions"]
)


@router.get("/")
def get_missions(
    current_user: dict = Depends(get_current_user)
):
    try:
        client = current_user["client"]

        response = (
            client.table("missions")
            .select("*")
            .eq("is_active", True)
            .execute()
        )

        return {
            "missions": response.data
        }

    except Exception as e:
        print("GET MISSIONS ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve missions"
        )


@router.get("/{mission_id}")
def get_mission_by_id(
    mission_id: UUID,
    current_user: dict = Depends(get_current_user)
):
    try:
        client = current_user["client"]

        response = (
            client.table("missions")
            .select("*")
            .eq("mission_id", str(mission_id))
            .eq("is_active", True)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Mission not found"
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        print("GET MISSION ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve mission"
        )
