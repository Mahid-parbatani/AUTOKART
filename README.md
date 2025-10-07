# Blackbook API

A simple contacts "black book" service built with FastAPI and SQLite.

## Quickstart

1. Create a venv and install deps:
   ```bash
   python3 -m venv .venv
   . .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Run the server:
   ```bash
   uvicorn blackbook.main:app --reload --host 0.0.0.0 --port 8000
   ```
3. Open docs at `http://localhost:8000/docs`.

## Endpoints
- GET `/healthz`
- GET `/contacts?q=&tags=&limit=&offset=`
- POST `/contacts`
- GET `/contacts/{id}`
- PATCH `/contacts/{id}`
- DELETE `/contacts/{id}`

`tags` accepts comma or semicolon-separated strings. Tags are stored normalized (lowercase, unique).
