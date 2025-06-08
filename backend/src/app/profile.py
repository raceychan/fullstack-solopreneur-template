from datetime import datetime
from uuid import uuid4

from lihil import Annotated, Empty, Route
from lihil.interface import Record
from sqlalchemy import delete, insert, select, update
from src.db.factory import AsyncConnection, conn_factory
from src.db.tables import UserProfile, UserRole, UserStatus


class UserProfileDTO(Record, kw_only=True):
    id: str
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None
    email: str
    phone_number: str | None = None
    status: UserStatus
    role: UserRole
    gmt_created: datetime
    gmt_modified: datetime


class UserProfileCreate(Record, kw_only=True):
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None
    email: str
    phone_number: str | None = None
    status: UserStatus = UserStatus.ACTIVE
    role: UserRole = UserRole.USER


class UserProfileUpdate(UserProfileCreate): ...


class ProfileService:
    def __init__(self, conn: AsyncConnection):
        self._conn = conn

    async def list_profiles(self, limit: int, offset: int = 0):
        sql = (
            select(UserProfile)
            .order_by(UserProfile.gmt_created.desc())
            .limit(limit)
            .offset(offset)
        )
        cursor = await self._conn.execute(sql)
        result = cursor.mappings().fetchall()
        return [UserProfileDTO(**u) for u in result]

    async def get_profile(self, profile_id: str) -> UserProfileDTO | None:
        sql = select(UserProfile).where(UserProfile.id == profile_id)
        cursor = await self._conn.execute(sql)
        result = cursor.mappings().fetchone()
        if not result:
            return None

        return UserProfileDTO(**result)

    async def add_profile(self, profile_create: UserProfileCreate):
        profile_data = profile_create.asdict()
        sql = insert(UserProfile).values(profile_data).returning(UserProfile.id)
        cursor = await self._conn.execute(sql)
        return cursor.scalar_one()

    async def remove_profile(self, profile_id: str):
        sql = delete(UserProfile).where(UserProfile.id == profile_id)
        await self._conn.execute(sql)

    async def update_profile(self, profile_id: str, profile_update: UserProfileUpdate):
        sql = (
            update(UserProfile)
            .where(UserProfile.id == profile_id)
            .values(profile_update.asdict())
        )
        await self._conn.execute(sql)


profiles = Route("profiles")
profiles.add_nodes(ProfileService, conn_factory)


@profiles.get
async def get_profiles(
    service: ProfileService,
    limit: int = 10,
    offset: int = 0,
) -> list[UserProfileDTO]:
    return await service.list_profiles(limit, offset)


@profiles.post
async def create_new_profile(
    service: ProfileService,
    profile: UserProfileCreate,
) -> Annotated[Empty, 201]:
    await service.add_profile(profile)


@profiles.delete
async def remove_profile(service: ProfileService, profile_id: str):
    await service.remove_profile(profile_id=profile_id)


@profiles.put
async def update_profile(
    service: ProfileService,
    profile_id: str,
    profile: UserProfileUpdate,
) -> Annotated[Empty, 200]:
    await service.update_profile(profile_id, profile)
