from datetime import datetime
from typing import Any

from gotrue.types import SignInWithEmailAndPasswordCredentials
from lihil import Annotated, Payload, Route
from lihil.config import lhl_get_config
from lihil.plugins.auth.jwt import JWTAuthParam, JWTAuthPlugin
from lihil.plugins.auth.oauth import OAuth2PasswordFlow, OAuth2Token, OAuthLoginForm
from src.config import ProjectConfig
from supabase import AsyncClient

tokens = Route("token")
me = Route("me")


def jwt_decode(graph, func, sig):
    config = lhl_get_config(config_type=ProjectConfig)
    jwt_auth = JWTAuthPlugin(
        jwt_secret=config.JWT_SECRET, jwt_algorithms="HS256", verify_aud=False
    )
    return jwt_auth.decode_plugin(audience="authenticated")(graph, func, sig)


@tokens.post
async def login_get_token(
    login_form: OAuthLoginForm,
    client: AsyncClient,
) -> OAuth2Token:
    form = SignInWithEmailAndPasswordCredentials(
        email=login_form.username, password=login_form.password
    )
    resp = await client.auth.sign_in_with_password(form)
    if not resp.session:
        raise Exception("no session")

    return OAuth2Token(resp.session.access_token, resp.session.expires_in)


class PublicUser(Payload):
    email: str
    last_login: datetime

    @classmethod
    def from_user_dict(cls, user_dict: dict[str, Any]):
        email = user_dict["email"]
        last_login = datetime.fromtimestamp(float(user_dict["iat"]))

        return cls(email, last_login)


@me.get(auth_scheme=OAuth2PasswordFlow(token_url="token"), plugins=[jwt_decode])
async def get_user(
    user_dict: Annotated[dict[str, Any] | None, JWTAuthParam] = None,
) -> PublicUser:
    assert user_dict
    return PublicUser.from_user_dict(user_dict)
