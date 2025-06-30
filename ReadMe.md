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

1. Clone the GitHub Repo
git clone https://github.com/ritikaghanti/CatFactTracker.git
cd CatFactTracker

2. Set Up the Python Backend
    a. Create and activate a virtual environment
        python -m venv venv
        source venv/bin/activate       # Mac/Linux
        # OR
        venv\Scripts\activate          # Windows

    b. Install backend dependencies
        pip install -r requirements.txt
        💡 If you get a form data error, also run:
        pip install python-multipart

3. Start the FastAPI Server
cd backend
uvicorn main:app --reload

To test backend:
Open: http://localhost:8000/docs

To populate initial facts:
python import_cat_facts.py

4. Set Up and Start the React Frontend
cd frontend
npm install
npm start

🧹 Clearing the Database & Running the Script
If you'd like to clear the database and repopulate it with fresh cat facts using the standalone script, follow these steps:

🔸 Option 1: Delete the Database File (Full Reset)
From the project root:
rm backend/cat_facts.db       # macOS/Linux
# OR
del backend\cat_facts.db      # Windows
This will delete the database entirely. You can then re-run the script to regenerate it.

🔸 Option 2: Use the clear_db() Function (Keep DB Schema)
Alternatively, use the clear_db() function in db.py to only delete all rows from the facts table without removing the database file.

▶️ Running the Script (No FastAPI Required)
To manually fetch and store 5 new cat facts:

Stop the backend if it’s running (CTRL+C)

Activate your virtual environment
Navigate to the backend/ folder: cd backend

Run the script: python import_cat_facts.py
This will fetch 5 new facts from the external API and insert them into cat_facts.db.

Once done, you can start the backend again with: uvicorn main:app --reload
And access the updated facts through the frontend or the FastAPI docs.

🐾 Credits
Cat facts powered by: https://catfact.ninja