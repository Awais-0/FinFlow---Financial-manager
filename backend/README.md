# FinFlow Backend

This is the backend for FinFlow, built with FastAPI and SQLModel.

## Structure

- `app/`: Main application package.
  - `api/v1/`: API endpoints version 1.
  - `core/`: Configuration and security.
  - `db/`: Database session management.
  - `models/`: SQLModel database models.
  - `schemas/`: Pydantic schemas.
- `main.py`: Entry point for running with Uvicorn.
- `pyproject.toml`: Project configuration and dependencies.

## Running the application

### Development

Using the FastAPI CLI (recommended):

```bash
fastapi dev app/main.py
```

Or using Uvicorn directly:

```bash
python main.py
```

The API will be available at `http://127.0.0.1:8000`.
Documentation can be found at `http://127.0.0.1:8000/docs`.
