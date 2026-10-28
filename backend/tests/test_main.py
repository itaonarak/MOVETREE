
from fastapi.testclient import TestClient
from app.main import app
from app.services.user_service import password_hash


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


def test_register_user():
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200
    assert response.json() == {
        "message": "Registration data received successfully",
        "username": "testuser",
        "email": "test@example.com"
    }


def test_login_user():
    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200
    assert response.json() == {
        "message": "Login data received successfully",
        "email": "test@example.com"
    }


def test_register_user_invalid_data():
    response = client.post(
        "/auth/register",
        json={
            "username": "ab",
            "email": "not-an-email",
            "password": "123"
        }
    )

    assert response.status_code == 422


def test_login_user_invalid_email():
    response = client.post(
        "/auth/login",
        json={
            "email": "not-an-email",
            "password": "password123"
        }
    )

    assert response.status_code == 422

def test_password_hashing():
    password = "password123"

    hashed_password = password_hash.hash(password)

    assert hashed_password != password
    assert password_hash.verify(password, hashed_password)
    assert not password_hash.verify("wrongpassword", hashed_password)

    
def test_get_places():
    response = client.get("/places/")

    assert response.status_code == 200
    data = response.json()["places"]
    assert len(data) == 3
    assert data[0]["name"] == "Lumphini Park"


def test_get_place_by_id():
    response = client.get("/places/1")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Lumphini Park"


def test_get_place_not_found():
    response = client.get("/places/999")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Place not found"
    }


def test_get_missions():
    response = client.get("/missions/")

    assert response.status_code == 200
    data = response.json()["missions"]
    assert len(data) == 5

    daily_missions = [
        mission for mission in data
        if mission["type"] == "daily"
    ]
    permanent_missions = [
        mission for mission in data
        if mission["type"] == "permanent"
    ]

    assert len(daily_missions) == 3
    assert len(permanent_missions) == 2


def test_get_mission_by_id():
    response = client.get("/missions/4")

    assert response.status_code == 200
    data = response.json()

    assert data["name"] == "Benjakitti Explorer"
    assert data["type"] == "permanent"
    assert data["condition"]["place_id"] == 2
    assert data["points"] == 30


def test_get_mission_not_found():
    response = client.get("/missions/999")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Mission not found"
    }
