from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


def test_read_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to MOVETREE API",
        "status": "running"
    }


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy"
    }


def test_api_routes_registered():
    paths = app.openapi()["paths"]

    expected_paths = [
        "/auth/register",
        "/auth/login",
        "/places/",
        "/places/{place_id}",
        "/missions/",
        "/missions/{mission_id}",
        "/checkins/",
        "/checkins/{checkin_id}"
    ]

    for path in expected_paths:
        assert path in paths