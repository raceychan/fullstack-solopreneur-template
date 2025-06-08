from datetime import datetime

from lihil import Annotated, Empty, Route
from lihil.interface import Record
from sqlalchemy import delete, insert, select, update
from src.db.factory import AsyncConnection, conn_factory
from src.db.tables import Task, TaskLabel, TaskPriority, TaskStatus


class TaskDTO(Record):
    id: int
    title: str
    status: TaskStatus
    label: TaskLabel
    priority: TaskPriority
    gmt_created: datetime
    gmt_modified: datetime


class TaskCreate(Record):
    title: str
    status: TaskStatus
    label: TaskLabel
    priority: TaskPriority


class TaskUpdate(TaskCreate): ...


class TaskService:
    def __init__(self, conn: AsyncConnection):
        self._conn = conn

    async def list_tasks(self, limit: int, offset: int = 0):
        sql = select(Task).order_by(Task.gmt_created.desc()).limit(limit).offset(offset)
        cursor = await self._conn.execute(sql)
        result = cursor.mappings().fetchall()
        return [TaskDTO(**t) for t in result]

    async def add_task(self, task_create: TaskCreate):
        sql = insert(Task).values(task_create.asdict()).returning(Task.id)
        cursor = await self._conn.execute(sql)
        task_id = cursor.scalar_one()

    async def remove_task(self, task_id: int):
        sql = delete(Task).where(Task.id == task_id)
        await self._conn.execute(sql)

    async def update_task(self, task_id: int, task_update: TaskUpdate):
        sql = update(Task).where(Task.id == task_id).values(task_update.asdict())
        await self._conn.execute(sql)


tasks = Route("tasks")
tasks.add_nodes(TaskService, conn_factory)


@tasks.get
async def get_tasks(
    service: TaskService,
    limit: int = 10,
    offset: int = 0,
) -> list[TaskDTO]:
    return await service.list_tasks(limit, offset)


@tasks.post
async def create_new_task(
    service: TaskService,
    task: TaskCreate,
) -> Annotated[Empty, 201]:
    await service.add_task(task)


@tasks.delete
async def remove_task(service: TaskService, task_id: int):
    await service.remove_task(task_id=task_id)


@tasks.put
async def update_task(
    service: TaskService,
    task_id: int,
    task: TaskUpdate,
) -> Annotated[Empty, 200]:
    await service.update_task(task_id, task)
