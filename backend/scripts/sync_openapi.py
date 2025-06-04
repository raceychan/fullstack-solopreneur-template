import asyncio
import json
from pathlib import Path

from msgspec.json import encode
from src.main import app_factory

FRONTEND_DIR = Path.cwd().parent / "frontend"
OPENAPI_PATH = FRONTEND_DIR / "openapi.json"


async def modify_openapi():
    app = app_factory()
    await app._setup()
    openapi = app.genereate_oas()
    content = encode(openapi).decode()
    OPENAPI_PATH.touch(exist_ok=True)
    OPENAPI_PATH.write_text(content)


if __name__ == "__main__":
    asyncio.run(modify_openapi())
