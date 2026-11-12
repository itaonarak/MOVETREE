
from uuid import UUID
from datetime import datetime, time, timedelta, timezone

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


@router.get("/progress")
def get_mission_progress(
    current_user: dict = Depends(get_current_user)
):
    try:
        client = current_user["client"]
        user_id = current_user["user_id"]

        # Get active missions
        missions_response = (
            client.table("missions")
            .select("*")
            .eq("is_active", True)
            .execute()
        )

        missions = missions_response.data or []

        # Get user's completed missions
        user_missions_response = (
            client.table("user_missions")
            .select("mission_id, completed_at")
            .eq("user_id", str(user_id))
            .execute()
        )

        user_missions = user_missions_response.data or []

        # Calculate today's date in Bangkok timezone
        bangkok = timezone(timedelta(hours=7))
        now = datetime.now(bangkok)

        start_of_day = datetime.combine(
            now.date(),
            time.min,
            tzinfo=bangkok
        )

        end_of_day = start_of_day + timedelta(days=1)

        # Get successful check-ins today
        checkins_response = (
            client.table("check_ins")
            .select("check_in_id, checked_in_at")
            .eq("user_id", str(user_id))
            .eq("status", "success")
            .gte("checked_in_at", start_of_day.isoformat())
            .lt("checked_in_at", end_of_day.isoformat())
            .execute()
        )

        today_checkins = checkins_response.data or []

        # Build mission progress
        result = []

        for mission in missions:
            mission_id = mission["mission_id"]
            mission_type = mission["mission_type"]
            condition_type = mission.get("condition_type")

            required = mission.get("required_count") or 1

            completed_records = [
                item for item in user_missions
                if item["mission_id"] == mission_id
            ]

            if mission_type == "daily":
                completed_attempts = min(
                    len(today_checkins),
                    required
                )

            else:
                completed_attempts = (
                    1 if completed_records else 0
                )

            result.append({
                **mission,
                "completed_attempts": completed_attempts,
                "completed": completed_attempts >= required
            })

        return {
            "missions": result
        }

    except Exception as e:
        print("GET MISSION PROGRESS ERROR:", repr(e))
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve mission progress"
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
