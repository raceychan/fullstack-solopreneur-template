from lihil.config import ConfigBase, lhl_read_config
from lihil.plugins.auth.supabase import SupabaseConfig
from sqlalchemy import URL as SQLURL


class DBConfig(ConfigBase, kw_only=True):
    DIALECT: str
    DRIVER: str
    USER: str | None = None
    PORT: int | None = None
    PASSWORD: str | None = None
    HOST: str | None = None
    DATABASE: str

    @property
    def url(self) -> SQLURL:
        protocol = f"{self.DIALECT}+{self.DRIVER}"

        return SQLURL.create(
            protocol,
            username=self.USER,
            password=self.PASSWORD,
            host=self.HOST,
            port=self.PORT,
            database=self.DATABASE,
        )


class ProjectConfig(SupabaseConfig, kw_only=True):
    SUPABASE_PG_URL_TEMPLT: str
    SUPABASE_PG_PASSWORD: str

    JWT_SECRET: str
    JWT_EXPIRES_S: int

    API_VERSION: str

    db: DBConfig | None = None

    @property
    def SUPABASE_PG_URL(self):
        return self.SUPABASE_PG_URL_TEMPLT.replace(
            "[YOUR-PASSWORD]", self.SUPABASE_PG_PASSWORD
        )


def read_config() -> ProjectConfig:
    app_config = lhl_read_config("settings.toml", ".env", config_type=ProjectConfig)
    assert app_config
    return app_config
