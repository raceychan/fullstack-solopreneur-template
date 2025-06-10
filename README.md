# Lihil Solopreneur Fullstack Template

A full-fledged solopreneur template to let you develop & deploy an app with 0 cost.

Free as in beer, Free as in speech, Free as in ending modern slavery.

Actively developing.

## Features

- **Dashboard**: Complete analytics and metrics overview
- **User Management & Access Control**: Full user administration system
- **Authentication**: Sign up, sign in with OAuth support
- **Task Management**: Complete CRUD operations for task management

### CMS Dashboard
![Dashboard](/docs/images/sales.png)

### User Admin
![Users](/docs/images/users.png)

### User Authentification
![Login](/docs/images/login.png)

### Tasks management

![Tasks](/docs/images/tasks.png)

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-solopreneur

# Run with Docker Compose
docker compose up
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1

### Option 2: Local Development

```bash
# Install dependencies and run backend
make backend

# In another terminal, run frontend
make frontend
```

## Tech Stack

### Frontend

Typescript

| Component   | Tech                         |
| ----------- | ---------------------------- |
| UI Library  | shadcnUI                     |
| Framework   | React(typescript) + TanStack |
| Tooling     | Vite                         |
| API Codegen | OpenAPI-TS                   |

### Backend

Python 3.10

| Component       | Tech     |
| --------------- | -------- |
| Framework       | Lihil    |
| Project manager | uv       |
| Database        | Postgres |

### Cloud Provider

| Purpose          | Provider   |
| ---------------- | ---------- |
| Database         | Supabase   |
| Frontend Hosting | Cloudflare |
| Backend Hosting  | Vercel     |

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.10 or higher)
- **Docker** and **Docker Compose** (for containerized setup)
- **uv** (Python package manager)

### Local Development Setup

1. **Backend Setup**:
   ```bash
   cd backend
   # uv will automatically install dependencies
   make dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   make dev
   ```

### API Code Generation

The project uses OpenAPI for automatic client generation:

```bash
# Generate OpenAPI spec and TypeScript client
make api
```

This command:
1. Generates `openapi.json` in the frontend root based on backend type hints
2. Creates TypeScript SDK in `frontend/src/client/sdk.gen.ts`

### Port Configuration

#### Default Ports

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Base Path**: `/api/v{API_VERSION}` (default: `/api/v1`)

#### Changing Ports

**Frontend Port (Vite)**:
```bash
cd frontend
npm run dev -- --port 4000
```

**Backend Port**:
```bash
cd backend
# For local development
uv run python -m src.main --port 9000

# Or modify docker-compose.yml for Docker setup
```

**Docker Compose Port Mapping**:
Edit `docker-compose.yml` to change port mappings:
```yaml
services:
  frontend:
    ports:
      - "4000:80"  # Change 3000 to your desired port
  backend: 
    ports:
      - "9000:8000"  # Change 8000 to your desired port
```

## Getting Started

### Clone the Repository

```bash
# Clone the entire repository
git clone <your-repo-url>

# Or clone a specific branch
git clone -b {branch_name} --single-branch {repo_url}
```

## Configuration

The application requires configuration through TOML files or environment variables. Below are the required configuration parameters:

### Required Configuration

This project recommends two config files for configuration

`*.env` for secrets, private information
`*.toml` for app config, public information


| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `JWT_SECRET` | `str` | - | True | JWT secret key used for token encoding/decoding |
| `JWT_EXPIRES_S` | `int` | `3600` | False | JWT token expiration time in seconds |
| `API_VERSION` | `str` | `"1"` | False | API version for route prefixing (`/api/v{API_VERSION}`) |

### Database Configuration (Optional)

Use either custom database or Supabase. If using custom database, configure the `db` section:

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `db.DIALECT` | `str` | - | True | Database dialect (e.g., `postgresql`, `mysql`) |
| `db.DRIVER` | `str` | - | True | Database driver (e.g., `psycopg2`, `pymysql`) |
| `db.USER` | `str` | `None` | False | Database username |
| `db.PASSWORD` | `str` | `None` | False | Database password |
| `db.HOST` | `str` | `None` | False | Database host |
| `db.PORT` | `int` | `None` | False | Database port |
| `db.DATABASE` | `str` | - | True | Database name |

*Required if using custom database instead of Supabase

### Supabase Configuration (Optional)

Alternative to custom database configuration:

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `SUPABASE_URL` | `str` | `None` | False | Supabase project URL for API access |
| `SUPABASE_API_KEY` | `str` | `None` | False | Supabase API key for authentication |
| `SUPABASE_PG_URL_TEMPLT` | `str` | `None` | False | Supabase PostgreSQL URL template with `[YOUR-PASSWORD]` placeholder |
| `SUPABASE_PG_PASSWORD` | `str` | `None` | False | Supabase PostgreSQL database password |

### Configuration Example

Create a `settings.toml` file in the project root:

```toml
[lihil]

# Option 1: Custom Database
[lihil.db]
DIALECT = "postgresql"
DRIVER = "psycopg2"
USER = "myuser"
PASSWORD = "mypass"
HOST = "localhost"
PORT = 5432
DATABASE = "mydb"
```

```env
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_S=3600
API_VERSION="1"

# Option 2: Supabase (alternative to custom db)

SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_API_KEY = "your-api-key"
SUPABASE_PG_URL_TEMPLT = "postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres"
SUPABASE_PG_PASSWORD = "your-db-password"
```


## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Check which process is using the port
lsof -i :3000  # or :8000 for backend

# Kill the process if needed
kill -9 <PID>

# Or use different ports as described in Port Configuration section
```

**Database Connection Issues**:
- Ensure your database is running (if using custom database)
- Check your `settings.toml` configuration
- For Supabase, verify your URL and API keys are correct
- Default setup uses SQLite (`test.db`) - no additional setup required

**API Generation Fails**:
```bash
# Ensure backend is running first
make backend

# Then generate API in a new terminal
make api
```

**Frontend Build Errors**:
```bash
cd frontend
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Docker Issues**:
```bash
# Reset Docker environment
docker compose down -v
docker compose up --build
```

### Development Tips

- Always run `make api` after backend changes that affect API endpoints
- Use `docker compose down -v` to reset Docker volumes if needed
- Check `backend/test.db` file permissions if using SQLite locally
- Frontend hot-reload works automatically with Vite
- Backend auto-reload is enabled in development mode
- The backend uses SQLite by default, so no external database setup is required for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes locally
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.