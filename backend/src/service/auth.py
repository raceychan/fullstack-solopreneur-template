from gotrue.types import SignInWithEmailAndPasswordCredentials
from lihil import Annotated, Form, Route
from lihil.config import lhl_get_config
from lihil.plugins.auth.jwt import JWTAuthParam, JWTAuthPlugin
from lihil.plugins.auth.oauth import OAuth2PasswordFlow, OAuthLoginForm
from src.config import ProjectConfig
from supabase import AsyncClient

tokens = Route("token")
me = Route("me")


def jwt_decode(graph, func, sig):
    config = lhl_get_config(config_type=ProjectConfig)
    jwt_auth = JWTAuthPlugin(jwt_secret=config.JWT_SECRET, jwt_algorithms="HS256", verify_aud=False)
    return jwt_auth.decode_plugin(graph, func, sig)


@tokens.post
async def login_get_token(
    login_form: OAuthLoginForm,
    client: AsyncClient,
):
    form = SignInWithEmailAndPasswordCredentials(
        email=login_form.username, password=login_form.password
    )
    resp = await client.auth.sign_in_with_password(form)
    if not resp.session:
        raise Exception("no session")

    return resp.session.access_token


@me.get(auth_scheme=OAuth2PasswordFlow(token_url="token"), plugins=[jwt_decode])
async def get_user(access_token: Annotated[str, JWTAuthParam]): 
    ""
    # assert profile.role == "user"
    # return User(name="user", email="user@email.com")
