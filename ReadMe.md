
# Cat Facts App

A full-stack application that fetches cat facts from an external API, stores them in a local SQLite database using FastAPI, and provides a modern, interactive UI via React

[Visit this Project](https://cat-fact-tracker.vercel.app/)

## 📚 Table of Contents
- 🚀 [Features](#-features)
- 🧰 [Technologies Used](#-technologies-used)
- 🧪 [API Reference](#-API-Reference)
- 📁 [Project Structure](#-project-structure)
- 🐾 [Cloning](#-Cloning)
- 🐾 [Deployment](#-deployment)
- 🐾 [Credits](#-credits)
- 📄 [Documentations that might help](#-Documentationsthatmighthelp)


# 🚀 [Features](#-features)
Backend (FastAPI):
 - JWT Authentication for POST/DELETE routes
 - Secure login with hashed password and token-based sessions
 - CORS enabled for frontend-backend interaction
 - SQLite database for persistent storage
 - API routes:
   - GET /catfacts: View all stored facts
   - GET /catfacts/random: Fetch a random fact
   - POST /catfacts: Add a new fact (requires login)
   - DELETE /catfacts/{fact_id}: Remove a fact (requires login)
   - POST /catfacts/fetch: Fetch 5 new cat facts from external API (requires login)
   - POST /login: Token-based login route

Frontend (React):
 - Deployed on Vercel: [https://cat-fact-tracker.vercel.app](https://cat-fact-tracker.vercel.app)
 - Responsive UI with modern styling and animations
 - Confetti animation on successful fact addition 🎉
 - Login/logout flow with token storage in localStorage
 - Login-protected Add Fact, Delete Fact, and Fetch Facts features
 - Fact list with search, sort (length/date), and pagination
 - Toast notifications for feedback
 - Modal form for adding new facts
 - Cute cat-themed UI (with animation and background image)


# 🧰 [Technologies Used](#-technologies-used)

**Backend (FastAPI):**
- Python 3.11+
- FastAPI
- Uvicorn
- SQLite
- JWT Authentication (python-jose, passlib[bcrypt])
- Aiohttp (for async fact fetching)
- Pytest (for backend testing)

**Frontend (React):**
- React (Create React App)
- Axios
- React Toastify
- Canvas Confetti (fun animations)
- JWT Authentication (python-jose, passlib[bcrypt])
- CSS (custom styles)

**Deployment**
- Render (Backend)
- Vercel (Frontend)
- GitHub(Version control and CI/CD)


# 🧪 [API Reference](#API-Reference)

GET /catfacts: 
- Returns all facts in the DB.

GET /catfacts/random: 
- Returns one random fact.

POST /catfacts: 
- Submit a new fact via form data: `fact=...` (Requires Bearer Token)

DELETE /catfacts/{fact_id}: 
- Deletes a fact by ID (Requires Bearer Token)

POST /catfacts/fetch: 
- Fetch and insert 5 facts from external API (Requires Bearer Token)

POST /login
- Submit `username` and `password` as form data to receive a JWT token.

# 📁 [Project Structure](#-project-structure)
```
CatFactTracker/
├── backend/
│   ├── main.py                # FastAPI app
│   ├── db.py                  # Database logic
│   ├── import_cat_facts.py    # Async script to fetch & store 5 new facts
│   ├── auth.py                # Authentication logic (JWT)
│   ├── cat_facts.db           # SQLite DB (auto-generated)
│   ├── tests/                 # Pytest test cases
│   └── requirements.txt/      # Python dependencies
├── frontend/                  # React app
│   ├── src/App.js             # Main frontend logic
│   ├── src/App.css            # Custom cute cat-themed styling
│   └── src/App.test.js        # Frontend tests with Jest/RTL
└── README.md                  # Project documentation
```


# [Cloning](#-Cloning)

How to clone your project

🛠 Setup Instructions

1. Clone the GitHub Repo
```bash
git clone https://github.com/ritikaghanti/CatFactTracker.git
cd CatFactTracker
```

2. Set Up the Python Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Mac/Linux
# OR
venv\Scripts\activate          # Windows

pip install -r requirements.txt
pip install python-multipart  # for form handling (if not already installed)
```

3. Start the FastAPI Server Locally
```bash
uvicorn main:app --reload
```
Access: [http://localhost:8000/docs](http://localhost:8000/docs)

To populate initial facts:
```bash
python import_cat_facts.py
```

4. Set Up and Start the React Frontend
```bash
cd ../frontend
npm install
npm start
```
If required:
```bash
npm install react-toastify
```

🧪 Running Backend Tests
```bash
cd backend
pytest
```
🧹 Clearing the Database & Running the Script
Delete DB:
```bash
rm backend/cat_facts.db       # macOS/Linux
# OR
del backend\cat_facts.db      # Windows
```
OR clear only data via `clear_db()` in `db.py`

▶️ Repopulate:
```bash
cd backend
python import_cat_facts.py
```
Then restart the backend:
```bash
uvicorn main:app --reload
```

📍 API Endpoints

Here you can list the main routes of your API, and what are their expected request bodies.
​
| route               | description                                          
|----------------------|-----------------------------------------------------
| GET /catfacts    | Returns all facts in the DB.
| GET /catfacts/random    | Returns one random fact.
| POST /catfacts     | Submit a new fact via form data: `fact=...` (Requires Bearer Token)
| DELETE /catfacts/{fact_id}    | Deletes a fact by ID (Requires Bearer Token)
| POST /catfacts/fetch    | Fetch and insert 5 facts from external API (Requires Bearer Token)
| POST /login/     | Submit `username` and `password` as form data to receive a JWT token.


# 🐾 [Deployment](#-deployment)
- Backend: Render
  - Ensure `requirements.txt` is inside `backend/`
  - Start Command: `uvicorn main:app --host=0.0.0.0 --port=$PORT`
- Frontend: Vercel
  - Update all API URLs in `App.js` to point to `https://catfacttracker.onrender.com`


📌 Notes
 - JWT token must be included as `Authorization: Bearer <token>` for protected routes
 - Frontend auto-refreshes fact list after adding/deleting facts
 - React modal used for submitting new facts
 - Duplicate facts are not inserted


# 🐾 [Credits](#-credits)

Cat facts powered by: https://catfact.ninja

UI styling inspired by playful cat-themed designs 🐾

Made with ❤️ by Ritika Ghanti


# 📄 [Documentations that might help](#-Documentationsthatmighthelp)

[📝 How to create a Pull Request](https://www.atlassian.com/br/git/tutorials/making-a-pull-request)

[💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
