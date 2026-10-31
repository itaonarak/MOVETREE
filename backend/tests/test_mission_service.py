from app.services.mission_service import (
    is_daily_mission_completed,
    is_permanent_mission_completed
)


def test_daily_mission_completed():
    assert is_daily_mission_completed(1, ["A"]) is True


def test_daily_mission_multiple_areas():
    assert is_daily_mission_completed(2, ["A", "B"]) is True


def test_daily_mission_duplicate_area():
    assert is_daily_mission_completed(2, ["A", "A"]) is False


def test_daily_mission_not_completed():
    assert is_daily_mission_completed(3, ["A", "B"]) is False


def test_permanent_mission_completed():
    assert is_permanent_mission_completed("A", ["A", "B"]) is True


def test_permanent_mission_not_completed():
    assert is_permanent_mission_completed("C", ["A", "B"]) is False


def test_permanent_mission_without_area():
    assert is_permanent_mission_completed(None, ["A", "B"]) is False