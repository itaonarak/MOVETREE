
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
