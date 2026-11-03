
from fastapi import FastAPI
from app.routers import auth, checkins, health, missions, places, posts, root
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="MOVETREE API",
    description="Backend API for the MOVETREE application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(root.router)
app.include_router(auth.router)
app.include_router(places.router)
app.include_router(missions.router)
app.include_router(checkins.router)
app.include_router(posts.router)
