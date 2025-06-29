import aiohttp
import asyncio
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from db import init_db, get_all_facts, get_random_fact, insert_fact
from fastapi.responses import JSONResponse
from fastapi import status, Form
app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/catfacts")
def read_cat_facts():
    rows = get_all_facts()
    return [{"id": r[0], "fact": r[1], "created_at": r[2]} for r in rows]

@app.get("/catfacts/random")
def random_cat_fact():
    fact = get_random_fact()
    return {"fact": fact}

@app.post("/catfacts")
def create_cat_fact(fact: str = Form(...)):
    try:
        insert_fact(fact)
        return {"message": "Fact added!"}
    except ValueError as ve:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"message": str(ve)}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": f"Internal error: {str(e)}"}
        )

@app.post("/catfacts/fetch")
async def fetch_and_replace_cat_facts():
    # from db import clear_db

    url = "https://catfact.ninja/fact"

    async def fetch_fact(session):
        async with session.get(url) as response:
            data = await response.json()
            return data["fact"]

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_fact(session) for _ in range(5)]
        facts = await asyncio.gather(*tasks)

    # clear_db()  # 🧹 Clear existing facts

    for fact in facts:
        try:
            insert_fact(fact)
        except:
            continue  # In case of any unexpected issues

    return {"message": "Replaced old facts with 5 new ones."}
