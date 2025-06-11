# Backend

This project uses uv as project /dependencies manager.

1. Install uv(skip if you have uv installed)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

if you have any problem installing uv, checkout [uv install guide](https://docs.astral.sh/uv/getting-started/installation/)

2. go to backend directory and install dependencies

```python
cd backend
uv install
```

3. create a `.env` file to store private config under `backend` folder

```python
touch .env
```

There are several config settings listed below, most of them have default values, we will start by create a 
`JWT_SECRET` for jwt encoding/decoding. 

If you don't have it already, run this following code in your terminal and copy paste the result into .env file

```python
python -c "import secrets; print(f'JWT_SECRET={secrets.token_urlsafe(64)}')"
```

your `.env` file should look like this

```python
JWT_SECRET=OBnIarAFulPafe8EGugKm71_sNpDDvkWQpvQ_Q-TDjjmgF6_PGink_HnsEsoDojpqHDNyJfIJJ3_bi4m3d2gow
```


4. start backend

```python
uvicorn src.main:app
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
API_VERSION = "1"

[lihil.db]
DIALECT = "sqlite"
DRIVER = "aiosqlite"
DATABASE="test.db"
```

```env
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_S=3600

# Supabase (alternative to custom db)

SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_API_KEY = "your-api-key"
SUPABASE_PG_URL_TEMPLT = "postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres"
SUPABASE_PG_PASSWORD = "your-db-password"
```