from lihil import Route
from supabase import AsyncClient



users = Route("users")



@users.get
async def get_users(client: AsyncClient):
    # await client.get
    ...