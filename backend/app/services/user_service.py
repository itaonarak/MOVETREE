
def register_user_service(username: str, email: str):
    return {
        "message": "Registration data received successfully",
        "username": username,
        "email": email
    }


def login_user_service(email: str):
    return {
        "message": "Login data received successfully",
        "email": email
    }
