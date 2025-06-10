from functools import lru_cache
from typing import Any
from uuid import uuid4

from lihil import Annotated, Empty, Route
from lihil.config import lhl_get_config
from lihil.interface import Record
from lihil.plugins import IEndpointInfo
from lihil.plugins.auth.jwt import JWTAuthParam, JWTAuthPlugin
from lihil.plugins.auth.oauth import OAuth2PasswordFlow, OAuth2Token, OAuthLoginForm
from lihil.plugins.auth.utils import hash_password, verify_password
from lihil.problems import InvalidAuthError, HTTPException
from sqlalchemy import insert, select
from src.app.profile import ProfileService, UserProfileCreate, UserProfileDTO
from src.config import ProjectConfig
from src.db.factory import AsyncConnection, conn_factory
from src.db.tables import UserAuth, UserRole, UserStatus


@lru_cache
def jwt_factory():
    config = lhl_get_config(config_type=ProjectConfig)
    jwt_auth = JWTAuthPlugin(
        jwt_secret=config.JWT_SECRET,
        jwt_algorithms="HS256",
        verify_aud=False,
        verify_iat=False,
    )
    return jwt_auth


def jwt_decode(endpint_info: IEndpointInfo):
    jwt_auth = jwt_factory()
    return jwt_auth.decode_plugin(audience="authenticated")(endpint_info)


def jwt_encode(endpint_info: IEndpointInfo):
    config = lhl_get_config(config_type=ProjectConfig)
    jwt_auth = jwt_factory()
    return jwt_auth.encode_plugin(expires_in_s=config.JWT_EXPIRES_S)(endpint_info)


class EmailRegisteredError(HTTPException):
    """Exception raised when attempting to register with an email that's already in use."""
    
    def __init__(self, email: str):
        super().__init__(problem_status=400, detail=f"Email {email} is already registered")


class SignUpRequest(Record):
    email: str
    password: str


class AuthService:
    def __init__(self, conn: AsyncConnection, profile_service: ProfileService):
        self._conn = conn
        self._profile_service = profile_service

    async def sign_up(self, signup_request: SignUpRequest):
        existing_user = await self.get_profile_by_email(signup_request.email)
        if existing_user:
            raise EmailRegisteredError(signup_request.email)

        profile_data = UserProfileCreate(
            email=signup_request.email,
            status=UserStatus.ACTIVE,
        )

        profile_id = await self._profile_service.add_profile(profile_data)

        password_hash = hash_password(signup_request.password.encode())
        auth_data = {
            "id": str(uuid4()),
            "email": signup_request.email,
            "password_hash": password_hash,
            "is_verified": False,
            "profile_id": profile_id,
        }

        sql = insert(UserAuth).values(auth_data)
        await self._conn.execute(sql)
        return profile_id

    async def authenticate(self, email: str, password: str) -> UserProfileDTO | None:
        sql = select(UserAuth).where(UserAuth.email == email)
        cursor = await self._conn.execute(sql)
        auth_record = cursor.mappings().first()

        if not auth_record:
            return None

        if not verify_password(password.encode(), auth_record["password_hash"]):
            return None

        return await self._profile_service.get_profile(auth_record["profile_id"])

    async def get_profile_by_email(self, email: str) -> UserProfileDTO | None:
        sql = select(UserAuth).where(UserAuth.email == email)
        cursor = await self._conn.execute(sql)
        auth_record = cursor.mappings().first()

        if not auth_record:
            return None

        profiles = await self._profile_service.list_profiles(limit=1, offset=0)
        for profile in profiles:
            if profile.id == auth_record["profile_id"]:
                return profile
        return None


tokens = Route("token")
auth = Route("auth")


auth_scheme = OAuth2PasswordFlow(token_url="token")


@tokens.post(plugins=[jwt_encode])
async def login_get_token(
    login_form: OAuthLoginForm, auth_service: AuthService
) -> UserProfileDTO:
    profile = await auth_service.authenticate(login_form.username, login_form.password)
    if not profile:
        raise InvalidAuthError("Invalid credentials")
    return profile


@auth.post
async def sign_up(
    auth_service: AuthService,
    signup_request: SignUpRequest,
) -> Annotated[Empty, 201]:
    await auth_service.sign_up(signup_request)


@auth.sub("me").get(auth_scheme=auth_scheme, plugins=[jwt_decode])
async def get_me(
    auth_service: AuthService,
    user_dict: Annotated[dict[str, Any] | None, JWTAuthParam] = None,
) -> UserProfileDTO:
    assert user_dict
    email = user_dict["email"]
    profile = await auth_service.get_profile_by_email(email)
    if not profile:
        raise Exception("Profile not found")
    return profile
