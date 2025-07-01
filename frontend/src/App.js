import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "canvas-confetti";
import "./App.css";

function App() {
  const [facts, setFacts] = useState([]);
  const [newFact, setNewFact] = useState("");
  const [randomFact, setRandomFact] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteList, setShowDeleteList] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = async () => {
    try {
      const res = await axios.post(
        "https://catfacttracker-hj4a.onrender.com/login",
        new URLSearchParams({ 
          username: "admin",
          password: "password"
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
      setIsAuthenticated(true);
      toast.success("Login successful!");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false);
    toast.info("Logged out");
  };

  const fetchFacts = async () => {
    try {
      await axios.post("https://catfacttracker-hj4a.onrender.com/fetch");
      toast.success("Fetched 5 new facts!");
      fetchAllFacts();
    } catch (err) {
      toast.error("Failed to fetch new facts");
      console.error("Error fetching external facts:", err);
    }
  };

  const toggleFacts = async () => {
    if (!showAll) {
      await fetchAllFacts();
      setVisibleCount(5);
    }
    setShowDeleteList(false);
    setShowAll(!showAll);
  };

  const fetchAllFacts = async () => {
    try {
      const res = await axios.get("https://catfacttracker-hj4a.onrender.com/catfacts");
      setFacts(res.data);
    } catch (err) {
      console.error("Error fetching all facts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomFact = async () => {
    try {
      const res = await axios.get("https://catfacttracker-hj4a.onrender.com/catfacts/random");
      setRandomFact(res.data.fact);
    } catch (err) {
      console.error("Error fetching random fact:", err);
    }
  };

  const submitFact = async () => {
    if (!newFact.trim()) return;
    try {
      const res = await axios.post(
        "https://catfacttracker-hj4a.onrender.com/catfacts",
        new URLSearchParams({ fact: newFact }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Fact added!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setNewFact("");
      fetchAllFacts();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.success("That cat fact already exists!");
      } else {
        toast.error("Something went wrong.");
      }
      console.error(err);
    }
  };

  const deleteFact = async (id) => {
    try {
      await axios.delete(`https://catfacttracker-hj4a.onrender.com/catfacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFacts((prevFacts) => prevFacts.filter((f) => f.id !== id));
      toast.success("Fact deleted!");
      fetchAllFacts();
    } catch (err) {
      toast.error("Error deleting fact");
      console.error(err);
    }
  };

  const toggleDeleteMode = async () => {
    if (!showDeleteList) {
      await fetchAllFacts();
      setShowAll(false);
    }
    setShowDeleteList(!showDeleteList);
  };

  return (
    <div className="App">
      <h1>😸 Cat Facts Galore!</h1>
      {showConfetti && <Confetti />}

      {randomFact && (
        <div style={{ margin: "1rem" }}>
          <strong>🎲 Random Fact:</strong>
          <p>{randomFact}</p>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={fetchRandomFact}>🎲 Get Random Fact</button>
        <button onClick={toggleFacts}>{showAll ? "🙈 Hide Facts" : "📋 View All Facts"}</button>
        <button onClick={fetchFacts}>🌟 Fetch 5 New Facts</button>
        {isAuthenticated && (
          <>
            <button onClick={() => setShowModal(true)}>➕ Add New Fact</button>
            <button onClick={toggleDeleteMode}>{showDeleteList ? "🚫 Cancel Delete" : "🗑️ Delete a Fact"}</button>
            <button onClick={logout}>🚪 Logout</button>
          </>
        )}
      </div>

      {!isAuthenticated && (
        <div>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>🔐 Login</button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>🐾 Add a Cat Fact</h3>
            <input type="text" value={newFact} onChange={(e) => setNewFact(e.target.value)} />
            <div>
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={() => { submitFact(); setShowModal(false); }} disabled={!newFact.trim()}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showAll && (
        <div>
          <h2>📚 All Facts</h2>
          <input
            type="text"
            placeholder="Search facts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">Sort by...</option>
            <option value="length">Length</option>
            <option value="date">Date</option>
          </select>
          <ul>
            {facts.filter(f => f.fact.toLowerCase().includes(search.toLowerCase()))
              .sort((a, b) => {
                if (sortOption === "length") return a.fact.length - b.fact.length;
                if (sortOption === "date") return new Date(b.created_at) - new Date(a.created_at);
                return 0;
              })
              .slice(0, visibleCount)
              .map((f) => (<li key={f.id}>{f.fact}</li>))}
          </ul>
          {visibleCount < facts.length && (
            <button onClick={() => setVisibleCount(prev => prev + 5)}>Load More</button>
          )}
        </div>
      )}

      {showDeleteList && (
        <div>
          <h2>🗑️ Delete a Fact</h2>
          <ul>
            {facts.filter(f => f.fact.toLowerCase().includes(search.toLowerCase()))
              .sort((a, b) => {
                if (sortOption === "length") return a.fact.length - b.fact.length;
                if (sortOption === "date") return new Date(b.created_at) - new Date(a.created_at);
                return 0;
              })
              .map((f) => (
                <li key={f.id}>{f.fact}
                  <button onClick={() => deleteFact(f.id)}>Delete</button>
                </li>
              ))}
          </ul>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
