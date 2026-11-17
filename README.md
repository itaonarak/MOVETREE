# MOVETREE
MOVETREE Mobile Application

## Deploy the web app

The web frontend can be deployed to Vercel, with the FastAPI backend on Render.

1. Create a Render Blueprint from this repository using `render.yaml`. Set
	`SUPABASE_URL`, `SUPABASE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in the
	Render dashboard.
2. Deploy `frontend/` as the Vercel project root. Set the Vercel environment
	variable `EXPO_PUBLIC_API_URL` to the Render API URL, such as
	`https://movetree-api.onrender.com`, and redeploy the frontend.
3. Add `CORS_ORIGINS` in Render with the Vercel origin, for example
	`https://your-app.vercel.app`, then redeploy the backend.

The Supabase service-role key is a backend secret. Enter it only in Render's
environment settings; do not put it in frontend variables or commit it.
