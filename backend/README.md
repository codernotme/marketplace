# Marketplace Backend (FastAPI)

This backend implements a modular monolith API under `app/modules/*`.
It supports two runtime modes:
- In-memory mode (default) for fast local development
- External services mode (MongoDB + Redis) for production-like setup

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open API docs:
- `http://127.0.0.1:8000/docs`

## Notes

- Default mode runs fully without MongoDB/Redis.
- Endpoints follow the route map from `Functions.md`.

## Runtime Modes

Set values in `.env` (see `.env.example`):

- In-memory mode:
	- `USE_IN_MEMORY=true`

- MongoDB + Redis mode:
	- `USE_IN_MEMORY=false`
	- `MONGODB_URI=mongodb://localhost:27017`
	- `MONGODB_DB_NAME=marketplace_db`
	- `REDIS_URL=redis://localhost:6379/0`
