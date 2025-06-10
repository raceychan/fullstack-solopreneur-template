import secrets

from lihil.config import AppConfig, ConfigBase, lhl_read_config
from sqlalchemy import URL as SQLURL


class DBConfig(ConfigBase, kw_only=True):
    """
    Database connection configuration for SQLAlchemy.

    This class manages database connection parameters and provides a URL property
    that constructs a SQLAlchemy connection URL from the individual components.
    Supports various SQL dialects and drivers.

    Example:
        db_config = DBConfig(
            DIALECT="postgresql",
            DRIVER="psycopg2",
            USER="myuser",
            PASSWORD="mypass",
            HOST="localhost",
            PORT=5432,
            DATABASE="mydb"
        )
        engine = create_engine(db_config.url)
    """

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


class ProjectConfig(AppConfig, kw_only=True):
    """
    Main application configuration class for the fullstack solopreneur backend.

    This configuration manages all application settings including JWT authentication,
    API versioning, and database connections. It supports both traditional database
    connections via DBConfig and Supabase integration.

    You can define a new Config class by inheriting AppConfig class.

    Example:
        config = read_config("settings.toml", "local.toml")
        jwt_secret = config.JWT_SECRET
        api_prefix = f"/api/v{config.API_VERSION}"
    """

    JWT_SECRET: str = secrets.token_urlsafe(32)
    """
    JWT Secret used to decode jwt
    """
    JWT_EXPIRES_S: int = 3600
    """
    jwt expire time in seconds, 
    """

    API_VERSION: str = "1"
    """
    app version, root route would have path of f"/api/v{API_VERSION}"
    """

    db: DBConfig | None = None
    """
    database connection info, required if you want to use your own database
    instead of supabase
    """

    SUPABASE_URL: str | None = None
    """
    Supabase project URL for API access
    """
    SUPABASE_API_KEY: str | None = None
    """
    Supabase API key for authentication
    """
    SUPABASE_PG_URL_TEMPLT: str | None = None
    """
    Supabase PostgreSQL connection URL template with [YOUR-PASSWORD] placeholder
    """
    SUPABASE_PG_PASSWORD: str | None = None
    """
    Supabase PostgreSQL database password
    """

    @property
    def SUPABASE_PG_URL(self) -> str | None:
        if not self.SUPABASE_PG_URL_TEMPLT or not self.SUPABASE_PG_PASSWORD:
            return None

        return self.SUPABASE_PG_URL_TEMPLT.replace(
            "[YOUR-PASSWORD]", self.SUPABASE_PG_PASSWORD
        )


def read_config(*config_files: str) -> ProjectConfig:
    app_config = lhl_read_config(
        *config_files, config_type=ProjectConfig, raise_on_not_found=False
    )
    assert app_config
    return app_config
