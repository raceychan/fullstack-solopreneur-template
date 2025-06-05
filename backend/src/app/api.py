from lihil import Graph, Lihil, Route
from lihil.plugins.auth.supabase import supabase_factory

from src.config import ProjectConfig, read_config
from src.app.auth import me, tokens
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine


def build_graph(config: ProjectConfig):
    graph = Graph()
    graph.node(supabase_factory)

    def engine_factory() -> AsyncEngine:
        # use config to build it here
        return create_async_engine("aiosqlite:///:memory:")

    graph.node(engine_factory)
    return graph


def app_factory():
    app_config = read_config()

    root = Route(f"/api/v{app_config.API_VERSION}")
    root.include_subroutes(tokens, me)
    root.sub("health").get(lambda: "ok")

    graph = build_graph(app_config)
    lhl = Lihil(root, graph=graph, app_config=app_config)
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
