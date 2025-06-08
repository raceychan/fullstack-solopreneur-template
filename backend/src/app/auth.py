from datetime import datetime
from functools import lru_cache
from typing import Any

# from gotrue.types import SignInWithEmailAndPasswordCredentials
from lihil import Annotated, Payload, Route
from lihil.config import lhl_get_config
from lihil.plugins import IEndpointInfo
from lihil.plugins.auth.jwt import JWTAuthParam, JWTAuthPlugin
from lihil.plugins.auth.oauth import OAuth2PasswordFlow, OAuth2Token, OAuthLoginForm
from sqlalchemy.ext.asyncio import AsyncEngine
from src.config import ProjectConfig
from supabase import AsyncClient as SBClient

tokens = Route("token")
me = Route("me")


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


# async def sb_login_get_token(
#     login_form: OAuthLoginForm,
#     client: SBClient,
# ) -> OAuth2Token:
#     form = SignInWithEmailAndPasswordCredentials(
#         email=login_form.username, password=login_form.password
#     )
#     resp = await client.auth.sign_in_with_password(form)
#     resp_session = resp.session
#     if not resp_session:
#         raise Exception("no session")


#     return OAuth2Token(resp_session.access_token, resp_session.expires_in)


class PublicUser(Payload):
    email: str
    last_login: datetime

    @classmethod
    def from_user_dict(cls, user_dict: dict[str, Any]):
        email = user_dict["email"]
        last_login = datetime.fromtimestamp(float(user_dict["iat"]))

        return cls(email, last_login)


async def login_get_token(
    login_form: OAuthLoginForm, engine: AsyncEngine
) -> OAuth2Token:
    return PublicUser(email="admin@email.com", last_login=datetime.now()) # type: ignore


async def get_user(
    public_user: Annotated[PublicUser | None, JWTAuthParam] = None,
) -> PublicUser:
    assert public_user
    return public_user


tokens.post(plugins=[jwt_encode])(login_get_token)
me.get(auth_scheme=OAuth2PasswordFlow(token_url="token"), plugins=[jwt_decode])(
    get_user
)
