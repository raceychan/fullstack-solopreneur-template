from enum import Enum
from typing import ClassVar, TypeVar

import sqlalchemy as sa
from sqlalchemy import MetaData
from sqlalchemy import orm as sa_orm
from sqlalchemy.ext import asyncio as sa_aio
from sqlalchemy.sql import FromClause, func

T = TypeVar("T")


# Reference: https://docs.sqlalchemy.org/en/14/orm/declarative_mixins.html
def declarative(cls: type[T]) -> type[T]:
    """
    A more pythonic way to declare a sqlalchemy table
    """

    return sa_orm.declarative_base(cls=cls)


@declarative
class TableBase:
    """
    Representation of actual tables in database,
    used for DDL and data migrations only
    """

    __table__: ClassVar[FromClause]
    __tablename__: ClassVar[str]

    metadata: ClassVar[MetaData]

    gmt_modified = sa.Column(
        "gmt_modified", sa.DateTime, server_default=func.now(), onupdate=func.now()
    )
    gmt_created = sa.Column("gmt_created", sa.DateTime, server_default=func.now())

    @classmethod
    def create_table(cls, engine: sa.Engine) -> None:
        cls.metadata.create_all(engine)

    @classmethod
    async def create_table_async(cls, async_engine: sa_aio.AsyncEngine) -> None:
        async with async_engine.begin() as conn:
            await conn.run_sync(cls.metadata.create_all)

    @classmethod
    def generate_tableclause(cls) -> sa.TableClause:
        clause = sa.table(
            cls.__tablename__,
            *[sa.column(c.name, c.type) for c in cls.__table__.columns],
        )
        return clause


# ========== Tasks==========


class TaskStatus(str, Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in progress"
    DONE = "done"
    CANCELED = "canceled"


class TaskLabel(str, Enum):
    BUG = "bug"
    FEATURE = "feature"
    DOCUMENTATION = "documentation"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task(TableBase):
    __tablename__: ClassVar[str] = "tasks"

    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    title = sa.Column(sa.String)
    status = sa.Column(sa.Enum(TaskStatus), nullable=False)
    label = sa.Column(sa.Enum(TaskLabel), nullable=False)
    priority = sa.Column(sa.Enum(TaskPriority), nullable=False)


# =========== Users ============


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    INVITED = "invited"
    SUSPENDED = "suspended"


class UserRole(str, Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    CASHIER = "cashier"
    MANAGER = "manager"


from uuid import uuid4


class User(TableBase):
    __tablename__: ClassVar[str] = "users"

    id = sa.Column(sa.String, primary_key=True, default=lambda: str(uuid4()))
    first_name = sa.Column(sa.String, nullable=False)
    last_name = sa.Column(sa.String, nullable=False)
    username = sa.Column(sa.String, nullable=False, unique=True, index=True)
    email = sa.Column(sa.String, nullable=False, unique=True, index=True)
    phone_number = sa.Column(sa.String, nullable=True)

    status = sa.Column(sa.Enum(UserStatus), nullable=False)
    role = sa.Column(sa.Enum(UserRole), nullable=False)
