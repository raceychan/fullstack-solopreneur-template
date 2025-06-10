from lihil import Lihil, Route
from lihil.plugins.auth.supabase import supabase_factory
from sqlalchemy.ext.asyncio import AsyncEngine
from src.app.auth import auth, tokens
from src.app.profile import profiles
from src.app.tasks import tasks
from src.config import read_config
from src.db.factory import conn_factory, engine_factory
from src.db.utils import init_db
from starlette.middleware.cors import CORSMiddleware


async def lifespan(app: Lihil):
    engine = app.graph.resolve(AsyncEngine)
    await init_db(engine)
    yield


def app_factory():
    app_config = read_config("settings.toml", ".env")

    root = Route(
        f"/api/v{app_config.API_VERSION}",
        deps=[supabase_factory, engine_factory, conn_factory],
    )
    root.include_subroutes(tokens, auth, tasks, profiles)
    root.sub("health").get(lambda: "ok")

    lhl = Lihil(root, app_config=app_config, lifespan=lifespan)
    lhl.add_middleware(
        lambda app: CORSMiddleware(
            app,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    )
    return lhl
