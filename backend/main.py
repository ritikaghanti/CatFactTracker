import aiohttp
import asyncio
from fastapi import FastAPI, Form
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import init_db, get_all_facts, get_random_fact, insert_fact, delete_fact_by_id
from fastapi.responses import JSONResponse
from fastapi import status, Form
from fastapi import APIRouter
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from auth import authenticate_user, create_access_token
from auth import get_current_user

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
def create_cat_fact(
    fact: str = Form(...),
    current_user: dict = Depends(get_current_user)  # 🔐 Require token
):
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
    
@app.delete("/catfacts/{fact_id}")
def delete_fact(
    fact_id: int,
    current_user: dict = Depends(get_current_user)  # 🔐 Require token
):
    success = delete_fact_by_id(fact_id)  # add this in db.py
    if not success:
        raise HTTPException(status_code=404, detail="Fact not found")
    return {"message": "Fact deleted"}


@app.post("/catfacts/fetch")
async def fetch_and_replace_cat_facts():
    url = "https://catfact.ninja/fact"

    async def fetch_fact(session):
        async with session.get(url) as response:
            data = await response.json()
            return data["fact"]

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_fact(session) for _ in range(5)]
        facts = await asyncio.gather(*tasks)

    for fact in facts:
        try:
            insert_fact(fact)
        except:
            continue

    return {"message": "Replaced old facts with 5 new ones."}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}