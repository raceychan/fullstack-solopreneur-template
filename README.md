# NestJS Solopreneur Fullstack Template

A full-fledged solopreneur template to let you develop & deploy an app with 0 cost.

**NestJS Backend Implementation** - For Python/Lihil backend, see the [`master` branch](https://github.com/raceychan/fullstack-solopreneur-template/tree/master).

Free as in beer, Free as in speech.

Actively developing.

## ✨ Features

- **Dashboard**: Complete analytics and metrics overview
- **User Management & Access Control**: Full user administration system
- **Authentication**: Sign up, sign in with OAuth support
- **Task Management**: Complete CRUD operations for task management

## What Can I Do with This Template?
This project is more than just a demo—it’s a production-ready starter with:

- Best practices for fullstack development using modern tools

- Real-world examples of authentication, task management, and admin dashboards

- Vertical slicing & DDD in both frontend and backend

- Type-safe APIs with auto-generated clients using OpenAPI

- Pre-configured dev environment with Docker and hot-reloading

You can use this template to:

- Kickstart your own project and customize features as needed

- Learn how to build fullstack apps with React, TypeScript, Lihil, and Supabase

- Deploy a real app on Vercel and Cloudflare with minimal cost

- Implement auth flows, access control, and role-based permissions

- Extend it with your own models, routes, and components

Whether you're building a SaaS app, internal tool, or MVP, this template saves weeks of setup.



## Previews

### CMS Dashboard
![Dashboard](/docs/images/sales.png)

### User Admin
![Users](/docs/images/users.png)

### User Authentification
![Login](/docs/images/login.png)

### Tasks management

![Tasks](/docs/images/tasks.png)

## Tech Stack

### Frontend

React 19 with TypeScript

| Component   | Tech                         |
| ----------- | ---------------------------- |
| UI          | shadcnUI, Tailwind CSS       |
| Framework   | React(typescript)            |
| Tooling     | Vite                         |
| API Codegen | OpenAPI-TS                   |

- Tanstack Router for routing
- Tanstack Query for data fetching
- Radix UI components

Frontend is developed based on [shadcn-admin](https://github.com/satnaing/shadcn-admin)

### Backend

NestJS with TypeScript

| Component       | Tech       |
| --------------- | ---------- |
| Framework       | NestJS     |
| Runtime         | Node.js    |
| Package Manager | npm        |
| Database        | Postgres   |

**Note**: For a Python/Lihil backend alternative, check out the [`master` branch](https://github.com/raceychan/fullstack-solopreneur-template/tree/master).

### Cloud Provider

| Purpose          | Provider   |
| ---------------- | ---------- |
| Database         | Supabase   |
| Frontend Hosting | Cloudflare |
| Backend Hosting  | Vercel     |


## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/raceychan/fullstack-solopreneur-template.git
cd fullstack-solopreneur-template

# Switch to NestJS branch (this branch)
git checkout nestjs

# Run with Docker Compose
docker compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/v1

### Option 2: Local Development

Prerequisites:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for database)

```bash
# 1. Install dependencies
# Frontend
cd frontend
npm install

# Backend (NestJS)
cd ../backend
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Run the application
# Backend (in one terminal)
cd backend
npm run start:dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

## NestJS Backend Features

This NestJS implementation provides:
- **TypeScript throughout** the backend
- **Decorators** for routing and validation  
- **Built-in dependency injection**
- **Swagger/OpenAPI documentation**
- **JWT Authentication** with guards
- **TypeORM** for database operations
- **Same API endpoints** as the Python version

**Alternative**: For a Python/Lihil backend implementation, check out the [`master` branch](https://github.com/raceychan/fullstack-solopreneur-template/tree/master).

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
cd backend

# Then generate API in a new terminal
make api

cd frontend

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