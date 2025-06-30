import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [facts, setFacts] = useState([]);
  const [newFact, setNewFact] = useState("");
  const [randomFact, setRandomFact] = useState("");
  const [showAll, setShowAll] = useState(false); // toggle state

  const fetchFacts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/catfacts");
      setFacts(res.data);
    } catch (err) {
      console.error("Error fetching facts:", err);
    }
  };
    const toggleFacts = async () => {
    if (!showAll) {
      await fetchAllFacts();
    }
    setShowAll(!showAll);
  };

  const fetchAllFacts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/catfacts");
      setFacts(res.data);
    } catch (err) {
      console.error("Error fetching all facts:", err);
    }
  };

  const fetchRandomFact = async () => {
    try {
      const res = await axios.get("http://localhost:8000/catfacts/random");
      setRandomFact(res.data.fact);
    } catch (err) {
      console.error("Error fetching random fact:", err);
    }
  };

  const submitFact = async () => {
    if (!newFact.trim()) return;
    try {
    const res = await axios.post(
      "http://localhost:8000/catfacts",
      new URLSearchParams({ fact: newFact }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    alert(res.data.message);
    setNewFact("");
    fetchAllFacts();
  } catch (err) {
    if (err.response && err.response.status === 409) {
      alert("That cat fact already exists!");
    } else {
      alert("Something went wrong.");
    }
    console.error(err);
  }

  };

  // useEffect(() => {
  //   fetchAllFacts();
  // }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🐱 Cat Facts</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "400px" }}>
  <input
    type="text" value={newFact} onChange={(e) => setNewFact(e.target.value)} placeholder="Enter a new cat fact"
    style={{
      width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc",
    }}
  />
  <button
    onClick={submitFact}
    style={{
      width: "50%", padding: "0.5rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer",
    }}
  >
    Submit
  </button>
</div>
      {/* <div>
        <input
          type="text"
          value={newFact}
          onChange={(e) => setNewFact(e.target.value)}
          placeholder="Enter a new cat fact"
          style={{ width: "400px", padding: "0.5rem" }}
        />
        <button onClick={submitFact}>Submit</button>
      </div> */}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={fetchRandomFact}>Get Random Fact</button>
        <button onClick={toggleFacts} style={{ marginLeft: "0.5rem" }}>
          {showAll ? "Hide Facts" : "View All Facts"}
        </button>
      </div>

      {randomFact && (
        <div style={{ marginTop: "1rem" }}>
          <strong>🎲 Random Fact:</strong>
          <p>{randomFact}</p>
        </div>
      )}

      {showAll && (
        <div style={{ marginTop: "2rem" }}>
          <h2>📜 All Facts</h2>
          <ul>
            {facts.map((f) => (
              <li key={f.id}>{f.fact}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;