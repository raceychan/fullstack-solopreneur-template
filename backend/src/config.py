from lihil.plugins.auth.supabase import SupabaseConfig
from lihil.config import lhl_read_config


class ProjectConfig(SupabaseConfig, kw_only=True):
    SUPABASE_PG_URL_TEMPLT: str
    SUPABASE_PG_PASSWORD: str
    JWT_SECRET: str

    API_VERSION: str

    @property
    def SUPABASE_PG_URL(self):
        return self.SUPABASE_PG_URL_TEMPLT.replace(
            "[YOUR-PASSWORD]", self.SUPABASE_PG_PASSWORD
        )


def read_config() -> ProjectConfig:
    app_config = lhl_read_config("settings.toml", ".env", config_type=ProjectConfig)
    assert app_config
    return app_config
