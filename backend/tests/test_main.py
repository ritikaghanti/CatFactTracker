import sys
import os
import pytest
from fastapi.testclient import TestClient
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app  # update if your FastAPI app file is named differently

client = TestClient(app)

# Replace with valid credentials (should match your fake_user_db)
USERNAME = "admin"
PASSWORD = "password"

@pytest.fixture
def token():
    response = client.post(
        "/login",
        data={"username": USERNAME, "password": PASSWORD},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]

def test_get_all_facts():
    res = client.get("/catfacts")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_login_valid_credentials():
    res = client.post(
        "/login",
        data={"username": USERNAME, "password": PASSWORD},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert res.status_code == 200
    assert "access_token" in res.json()

def test_create_fact(token):
    fact = "Test cat fact from pytest"
    res = client.post(
        "/catfacts",
        data={"fact": fact},
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )
    assert res.status_code in [200, 409]  # 409 if it already exists
    assert "message" in res.json()

def test_delete_fact(token):
    # First create a fact
    fact = "Fact to be deleted by test"
    create_res = client.post(
        "/catfacts",
        data={"fact": fact},
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )
    # Then get all facts and delete the last one (newest)
    facts_res = client.get("/catfacts")
    fact_id = facts_res.json()[-1]["id"]

    del_res = client.delete(
        f"/catfacts/{fact_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert del_res.status_code == 200
    assert del_res.json()["message"] == "Fact deleted"
