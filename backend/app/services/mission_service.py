def is_daily_mission_completed(
    required_checkins: int,
    successful_area_ids: list[str]
) -> bool:
    """
    Check whether a daily mission is completed.

    Only successful check-ins should be provided.
    Each area is counted only once.
    """
    unique_areas = set(successful_area_ids)

    return len(unique_areas) >= required_checkins


def is_permanent_mission_completed(
    mission_area_id: str | None,
    successful_area_ids: list[str]
) -> bool:
    """
    Check whether a permanent mission is completed.

    The user must check in at the mission's target area.
    """
    if mission_area_id is None:
        return False

    return mission_area_id in set(successful_area_ids)