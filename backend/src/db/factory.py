from typing import AsyncGenerator

from lihil.config import lhl_get_config
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine, create_async_engine
from src.config import ProjectConfig


def engine_factory() -> AsyncEngine:
    # use config to build it here
    config = lhl_get_config(ProjectConfig)
    assert config.db
    return create_async_engine(config.db.url, echo=True)


async def conn_factory(engine: AsyncEngine) -> AsyncGenerator[AsyncConnection, None]:
    async with engine.begin() as conn:
        yield conn
