from datetime import datetime

from lihil import Annotated, Empty, Route
from lihil.interface import Record
from sqlalchemy import delete, insert, select, update
from src.db.factory import AsyncConnection, conn_factory
from src.db.tables import User, UserStatus, UserRole
