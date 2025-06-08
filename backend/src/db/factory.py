from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine, create_async_engine


def engine_factory() -> AsyncEngine:
    # use config to build it here
    return create_async_engine("sqlite+aiosqlite:///test.db", echo=True)


async def conn_factory(engine: AsyncEngine) -> AsyncGenerator[AsyncConnection, None]:
    async with engine.begin() as conn:
        yield conn
