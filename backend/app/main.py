
from fastapi import FastAPI
from app.routers import health
from app.routers import root
from app.routers import auth

app = FastAPI(
    title="MOVETREE API",
    description="Backend API for the MOVETREE application",
    version="1.0.0"
)
app.include_router(health.router)
app.include_router(root.router)
app.include_router(auth.router)
