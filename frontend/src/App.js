import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [facts, setFacts] = useState([]);
  const [newFact, setNewFact] = useState("");

  const fetchFacts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/catfacts");
      setFacts(res.data);
    } catch (err) {
      console.error("Error fetching facts:", err);
    }
  };

  const fetchNewFacts = async () => {
  try {
    await axios.post("http://localhost:8000/catfacts/fetch");
    fetchFacts(); // refresh list
  } catch (err) {
    alert("Failed to fetch new facts");
    console.error(err);
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
    fetchFacts();
  } catch (err) {
    if (err.response && err.response.status === 409) {
      alert("That cat fact already exists!");
    } else {
      alert("Something went wrong.");
    }
    console.error(err);
  }

  };

  useEffect(() => {
    fetchFacts();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🐱 Cat Facts</h1>
      <ul>
        {facts.slice(-5).map((f) => (
    <li key={f.id}>{f.fact}</li>
        ))}
      </ul>
      <input
        value={newFact}
        onChange={(e) => setNewFact(e.target.value)}
        placeholder="Add a new cat fact"
        style={{ marginRight: "0.5rem", padding: "0.25rem" }}
      />
      <button onClick={submitFact}>Submit</button>
      <button onClick={fetchNewFacts} style={{ marginTop: "1rem" }}>
  Get New Random Facts
</button>
    </div>
  );
}

export default App;