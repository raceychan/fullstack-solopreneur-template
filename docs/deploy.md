

# Deploy for Free with Cloud Providers

This guide will help you deploy your fullstack solopreneur application using free cloud providers:

- **Backend**: Deploy the Lihil ASGI Python app to Vercel
- **Frontend**: Deploy the React + shadcn/ui app to Cloudflare Pages

## Deploy Backend to Vercel

### Prerequisites
- [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/cli) (optional but recommended)

### Step 1: Prepare Your Backend

1. **Create a `vercel.json` file** in your `backend/` directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.py"
    }
  ],
  "env": {
    "PYTHONPATH": "."
  }
}
```

Do notice that you would need to keep the `app` instance in `main.py` with the name `app`.
According to vercel:

> The entry point of this runtime is a glob matching .py source files with one of the following variables defined:
> - handler that inherits from the BaseHTTPRequestHandler class
>  - app that exposes a WSGI or ASGI Application

2. **Create a `requirements.txt` file** in your `backend/` directory:

Generate `requirements.txt` using uv

```bash
cd backend
make requirements
```

You might need to inspect on the uv generated requirements.txt to make sure it works as expected.

### Step 2: Deploy to Vercel

**Option A: Deploy via Vercel CLI**
```bash
cd backend
npx vercel --prod
```

**Option B: Deploy via Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"  
3. Import your repository
4. Set **Root Directory** to `backend`
5. Click "Deploy"

### Step 3: Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:
- `DATABASE_URL` (if using external database)
- Any other environment variables from your `settings.toml`

### Step 4: Test Your Deployment
Your API will be available at: `https://your-project-name.vercel.app/api/v1`

## Deploy Frontend to Cloudflare Pages

### Prerequisites  
- [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Step 1: Prepare Your Frontend

1. **Update API base URL** in `frontend/src/config/config.ts`:
```typescript
export const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.vercel.app/api/v1'
    : 'http://localhost:8000/api/v1',
  // ... other config
}
```

2. **Ensure build works locally**:
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Cloudflare Pages

**Option A: Connect via Git (Recommended)**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your Git repository
4. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`
5. Click "Save and Deploy"

**Option B: Direct Upload**
```bash
cd frontend
npm run build
# Upload the 'dist' folder contents via Cloudflare Pages dashboard
```

### Step 3: Configure Environment Variables
In Cloudflare Pages → Settings → Environment Variables, add:
- `NODE_ENV=production`
- `VITE_API_URL=https://your-backend-url.vercel.app/api/v1`

### Step 4: Configure Custom Domain (Optional)
1. In Cloudflare Pages → Custom domains
2. Add your domain and follow DNS configuration steps

## Post-Deployment Configuration

### Update CORS Settings
Update your backend's CORS configuration to allow your frontend domain:

```python
# In your backend configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Local development
    "https://your-frontend-domain.pages.dev",  # Cloudflare Pages
    "https://your-custom-domain.com"  # Custom domain if applicable
]
```

### Update OpenAPI Generation
Update your `frontend/makefile` or scripts to point to the production API:

```bash
# Generate API from production backend
curl https://your-backend-url.vercel.app/openapi.json > openapi.json
npm run openapi-ts
```

## Troubleshooting

### Backend Issues
- **Build fails**: Ensure `requirements.txt` includes all dependencies
- **Runtime errors**: Check Vercel function logs in dashboard
- **Database connection**: Verify environment variables are set correctly

### Frontend Issues  
- **Build fails**: Check that all environment variables are prefixed with `VITE_`
- **API calls fail**: Verify CORS settings and API URL configuration
- **404 errors**: Ensure your routes are configured for SPA routing

### Environment Variables
- Backend: Use Vercel dashboard to set environment variables
- Frontend: Use `VITE_` prefix for environment variables in Cloudflare Pages

## Database Options

### Supabase (Recommended Free Database)

For a free PostgreSQL database, we recommend [Supabase](https://supabase.com/):

1. **Create a Supabase account** at [supabase.com](https://supabase.com)
2. **Create a new project**
3. **Get your database URL** from Settings → Database → Connection string
4. **Add to environment variables**:
   - Vercel: Add `DATABASE_URL` in dashboard
   - Local: Update `settings.toml` with your connection string

Example connection string:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

**Supabase Benefits:**
- 500MB database storage (free tier)
- Built-in authentication (optional)
- Real-time subscriptions
- Automatic API generation
- Dashboard for database management

## Cost Considerations

Both services offer generous free tiers(check their docs for accurate information):


- **Vercel**: 100GB bandwidth, 1000 serverless function invocations per month
- **Cloudflare Pages**: Unlimited bandwidth, 500 builds per month
- **Supabase**: 500MB database, 2GB bandwidth per month

For higher usage, consider their paid plans or alternative providers.
