🐱 Cat Facts App
A small full-stack application that fetches cat facts from an external API, stores them in a local SQLite database using FastAPI, and allows interaction via a React frontend.

🚀 Features
Fetch 5 random cat facts from catfact.ninja

Store facts in a local SQLite database (no duplicates)

FastAPI backend with:
 - GET /catfacts: View all stored facts
 - GET /catfacts/random: Fetch a random fact from the database
 - POST /catfacts: Add a new fact

React frontend with:
 - Form to add new facts
 - Button to view/hide all facts
 - Button to fetch a random fact
 - Modern, responsive UI

📁 Project Structure
introproject/
├── backend/
│   ├── main.py                # FastAPI app
│   ├── db.py                  # Database logic
│   ├── import_cat_facts.py    # Async standalone script to fetch & store 5 new facts
│   └── cat_facts.db           # SQLite DB (auto-generated)
├── frontend/                  # React app
│   └── src/App.js             # Main frontend logic
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation

🧪 API Reference
GET /catfacts
Returns all facts in the DB.

GET /catfacts/random
Returns one random fact.

POST /catfacts
Submit a new fact via form data: fact=...

📌 Notes
 - CORS is enabled to allow frontend-backend interaction
 - Duplicate facts are not inserted
 - Styled using simple inline React styles

🛠 Setup Instructions
1. Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r ../requirements.txt

To run the FastAPI backend:
uvicorn main:app --reload

To populate initial facts:
python import_cat_facts.py

2. Frontend Setup
cd frontend
npm install
npm start
Visit: http://localhost:3000

🐾 Credits
Cat facts powered by: https://catfact.ninja