from lihil import Graph, Lihil
from lihil.config import lhl_read_config
from lihil.plugins.auth.supabase import supabase_factory
from src.config import ProjectConfig
from src.service.auth import me, tokens


def app_factory():
    app_config = lhl_read_config(".env", config_type=ProjectConfig)
    assert app_config
    graph = Graph()
    graph.node(supabase_factory)

    lhl = Lihil(graph=graph, app_config=app_config)
    lhl.include_routes(tokens, me)
    return lhl


if __name__ == "__main__":
    lhl = app_factory()
    lhl.run(__file__)
