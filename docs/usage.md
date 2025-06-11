1. clone repo

2. install dependencies & set up backend / fronend

    Prerequisites

    - **Node.js** (v18 or higher)
    - **Python** (3.10 or higher)
    - **Docker** and **Docker Compose** (for containerized setup)
    - **uv** (Python package manager)



    Tutorial on setup backend:

    [backend set up guide](/backend/README.md)

    Tutorial on setup frontend:

    [frontend setup guide](/frontend/README.md)

3. run locally in cli

It is recommended to run frontend and backend separatly in cli
before building images, as images takes longer to build.

4. build & run images via docker compose

```python
docker compose up
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1

To re-build backend images

```python
docker compose build backend
```

5. deploy

[Deploy your app for free using cloud providers](/docs/deploy.md)

### API Code Generation

The project uses OpenAPI for automatic client generation:

```bash
# Generate OpenAPI spec and TypeScript client
make api
```

This command:
1. Generates `openapi.json` in the frontend root based on backend type hints
2. Creates TypeScript SDK in `frontend/src/client/sdk.gen.ts`