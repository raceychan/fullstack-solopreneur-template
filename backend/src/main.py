from lihil import Lihil, Route
from lihil.config import lhl_read_config, AppConfig
from lihil.plugins.auth.supabase import signin_route_factory


class SupabaseConfig(AppConfig, kw_only=True):
    SUPABASE_URL: str
    SUPABASE_API_KEY: str

class ProjectConfig(SupabaseConfig):
    LOGIN_PATH: str =  "/login"
    SIGNUP_PATH: str = "/signup"
    

def main():
    app_config = lhl_read_config(".env", config_type=ProjectConfig)
    assert app_config
    root = Route()
    sign_in_route = signin_route_factory(app_config.LOGIN_PATH)
    lhl = Lihil(root, sign_in_route, app_config=app_config)

    lhl.run(__file__)


if __name__ == "__main__":
    main()
