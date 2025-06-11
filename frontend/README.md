# Frontend

This project uses npm for package management and Vite as the development server.

## Prerequisites

Make sure you have Node.js and npm installed on your system.

## Setup Instructions

1. Navigate to the frontend directory and install dependencies

```bash
cd frontend
npm install
```

2. Start the development server

```bash
npm run dev
```

The development server will start and you can access the application at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Configuration

The frontend connects to the backend API. Make sure your backend server is running before starting the frontend development server.

## Tech Stack

- React 19 with TypeScript
- Vite for development and building
- TailwindCSS for styling
- Tanstack Router for routing
- Tanstack Query for data fetching
- Radix UI components