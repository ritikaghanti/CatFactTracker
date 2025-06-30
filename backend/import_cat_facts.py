import aiohttp
import asyncio
from db import init_db, insert_fact

URL = "https://catfact.ninja/fact"

async def fetch_fact(session):
    async with session.get(URL) as response:
        data = await response.json()
        return data["fact"]

async def main():
    init_db()
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_fact(session) for _ in range(5)]
        facts = await asyncio.gather(*tasks)
        for fact in facts:
            insert_fact(fact)

if __name__ == "__main__":
    asyncio.run(main())