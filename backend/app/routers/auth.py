from fastapi import APIRouter
from app.schemas.user import UserRegister, UserLogin
from app.services.user_service import (
    register_user_service,
    login_user_service,
)
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)




@router.post("/register")
def register_user(user: UserRegister):
    return register_user_service(
        username=user.username,
        email=user.email,
        password=user.password
    )


@router.post("/login")
def login_user(user: UserLogin):
    return login_user_service(
        username=user.username,
        password=user.password
    )


