from lihil.plugins.auth.supabase import SupabaseConfig


class ProjectConfig(SupabaseConfig, kw_only=True):

    SUPABASE_PG_URL_TEMPLT: str
    SUPABASE_PG_PASSWORD: str
    JWT_SECRET: str

    @property
    def SUPABASE_PG_URL(self):
        return self.SUPABASE_PG_URL_TEMPLT.replace(
            "[YOUR-PASSWORD]", self.SUPABASE_PG_PASSWORD
        )
