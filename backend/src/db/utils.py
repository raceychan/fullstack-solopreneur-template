import json
from pathlib import Path

from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncConnection, AsyncEngine
from src.db.tables import TableBase, Task


async def insert_data_if_no_exist(
    table: type[TableBase], data_path: Path, conn: AsyncConnection
):
    assert data_path.exists()
    sql = select(Task).limit(1)

    cursor = await conn.execute(sql)
    result = cursor.one_or_none()
    if result is not None:
        return

    with data_path.open(encoding="utf-8") as f:
        tasks = json.load(f)  # ✅ use json.load() for file objects

    # Insert data (example using SQLAlchemy bulk insert)
    await conn.execute(insert(table).values(tasks))
    await conn.commit()


async def create_tables(conn: AsyncConnection):
    await conn.run_sync(TableBase.metadata.create_all)


async def init_db(engine: AsyncEngine):
    ROOT = Path.cwd()
    tasks = ROOT / "src" / "db" / "data" / "tasks.json"
    async with engine.begin() as conn:
        await create_tables(conn)
        await insert_data_if_no_exist(Task, tasks, conn)
