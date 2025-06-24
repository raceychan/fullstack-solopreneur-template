# Next.js Solopreneur Fullstack Template

A full-fledged Next.js solopreneur template to let you develop & deploy an app with 0 cost.

Free as in beer, Free as in speech, Free as in ending modern slavery.

Actively developing.

## Features

- **Dashboard**: Complete analytics and metrics overview
- **User Management & Access Control**: Full user administration system
- **Authentication**: Sign up, sign in with OAuth support
- **Task Management**: Complete CRUD operations for task management
- **API Routes**: Full-stack Next.js with built-in API endpoints
- **Database Integration**: Prisma ORM with PostgreSQL support

### CMS Dashboard
![Dashboard](/docs/images/sales.png)

### User Admin
![Users](/docs/images/users.png)

### User Authentification
![Login](/docs/images/login.png)

### Tasks management

![Tasks](/docs/images/tasks.png)

## Quick Start

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-solopreneur

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Set up database
npm run db:push

# Run the development server
npm run dev
```

The application will be available at:
- **Application**: http://localhost:3000

## Tech Stack

### Full-Stack Framework

TypeScript + Next.js 15

| Component       | Tech                         |
| --------------- | ---------------------------- |
| Framework       | Next.js 15 (App Router)     |
| UI Library      | shadcn/ui                    |
| Styling         | Tailwind CSS                 |
| Database        | PostgreSQL + Prisma ORM     |
| Authentication  | NextAuth.js                  |
| State Management| Zustand                      |
| Form Handling   | React Hook Form + Zod       |

- Next.js App Router for full-stack development
- Server Components and Client Components
- API Routes for backend functionality
- Prisma for type-safe database access
- NextAuth.js for authentication
- shadcn/ui components built on Radix UI

Frontend is developed based on [shadcn-admin](https://github.com/satnaing/shadcn-admin)

**Note**: For a React+Python backend alternative, check out the [`master` branch](https://github.com/raceychan/fullstack-solopreneur-template/tree/master).

### Deployment

| Purpose          | Provider   |
| ---------------- | ---------- |
| Database         | Supabase   |
| Application      | Vercel     |

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Git** for version control
- **PostgreSQL** (local) or **Supabase** account

### Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Database Setup**:
   ```bash
   # Push database schema
   npm run db:push
   
   # Generate Prisma client
   npm run db:generate
   
   # (Optional) Seed database
   npm run db:seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

### Database Management

The project uses Prisma ORM for database management:

```bash
# Generate database client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (dev only)
npm run db:reset
```

### Port Configuration

#### Default Port

- **Application**: http://localhost:3000

#### Changing Port

```bash
# Change development port
npm run dev -- --port 4000

# Or set in package.json scripts
"dev": "next dev --port 4000"
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

The application uses environment variables for configuration. Create a `.env.local` file in the project root:

### Required Configuration

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `DATABASE_URL` | `string` | - | True | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | `string` | - | True | NextAuth.js secret key |
| `NEXTAUTH_URL` | `string` | `http://localhost:3000` | False | Application URL |

### Authentication Configuration

For OAuth providers, add the following:

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| `GOOGLE_CLIENT_ID` | `string` | - | False | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | `string` | - | False | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | `string` | - | False | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | `string` | - | False | GitHub OAuth client secret |

### Database Configuration

Choose one of the following database options:

#### Option 1: Local PostgreSQL

```env
DATABASE_URL="postgresql://username:password@localhost:5432/solopreneur"
```

#### Option 2: Supabase

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres"
```

### Configuration Example

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/solopreneur"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```


## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Check which process is using the port
lsof -i :3000

# Kill the process if needed
kill -9 <PID>

# Or use different port
npm run dev -- --port 4000
```

**Database Connection Issues**:
- Ensure your PostgreSQL database is running (if using local database)
- Check your `DATABASE_URL` in `.env.local`
- For Supabase, verify your connection string and credentials
- Run `npm run db:push` to ensure schema is up to date

**Build Errors**:
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json .next
npm install

# Regenerate Prisma client
npm run db:generate
```

**Authentication Issues**:
- Check `NEXTAUTH_SECRET` is set in `.env.local`
- Verify OAuth provider credentials (if using)
- Ensure `NEXTAUTH_URL` matches your development URL

**Prisma Issues**:
```bash
# Reset Prisma client
npm run db:generate

# Reset database (dev only)
npm run db:reset

# View database with Prisma Studio
npm run db:studio
```

### Development Tips

- Hot-reload works automatically with Next.js
- Use TypeScript for better development experience
- Prisma Studio provides a GUI for database management
- Check browser console and terminal for detailed error messages
- Use `npm run lint` to catch potential issues early

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes locally
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.