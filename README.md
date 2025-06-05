## Tech Stack

a full-fledged solopreneur template to let you develop & deploy an app with 0 cost.

Free as in beer, Free as in speech, Free as in ending modern slavery.

Actively developing.

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

## Usage & version control

You can either download the release zip file for source code
or you can go to corresponding release branch and clone the repo.

### Clone a single branch

```bash
git clone -b {branch_name} --single-branch {repo_url}
```

### Augogenerated axios client baesd on openapi

under project root, run

```python
make api
```

This would generate a openapi.json in frontend root based on backend type hints
and then generate corresponding sdk in frontend (default to `client/sdk.gen.ts`)
