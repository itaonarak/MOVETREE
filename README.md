# MOVETREE
MOVETREE Mobile Application

## Deploy the web app

The Expo web frontend and FastAPI backend are deployed as separate Render
services from the root `render.yaml` Blueprint.

After the Blueprint creates both services, set `CORS_ORIGINS` on the API
service to the frontend's assigned Render origin, then redeploy the API.

The Supabase service-role key is a backend secret. Enter it only in Render's
environment settings; do not put it in frontend variables or commit it.
