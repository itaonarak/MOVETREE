
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()


def register_user_service(username: str, email: str, password: str):
    hashed_password = password_hash.hash(password)

    # Temporary: the hashed password will be stored in a database later.
    # Do not return the password hash in the API response.
    return {
        "message": "Registration data received successfully",
        "username": username,
        "email": email
    }


def login_user_service(email: str, password: str):
    return {
        "message": "Login data received successfully",
        "email": email
    }
