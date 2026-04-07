import { useState } from "react";
import "./App.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const LEVELS = ["Beginner", "Intermediate"];
const MOODS = ["Tired", "Confused", "Curious"];

function App() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [mood, setMood] = useState("Curious");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function callAPI(endpoint) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, mood }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setExplanation(data.explanation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleExplain() {
    if (!topic.trim()) {
      setError("Please enter a topic first.");
      return;
    }
    callAPI("/api/explain");
  }

  function handleSimplify() {
    if (!explanation) return;
    callAPI("/api/simplify");
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1 className="app-title">📚 StudyNanbar</h1>
        <p className="app-subtitle">
          Personalized AI explanations — tailored to your level and mood.
        </p>
      </header>

      <main className="app-main">
        <section className="input-section">
          <div className="field">
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              type="text"
              placeholder="e.g. Photosynthesis, Newton's Laws, Recursion…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExplain()}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="level">Level</label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="mood">Mood</label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleExplain}
            disabled={loading}
          >
            {loading ? "Thinking…" : "✨ Explain"}
          </button>
        </section>

        {error && <p className="error-msg">⚠️ {error}</p>}

        {explanation && (
          <section className="output-section">
            <h2 className="output-title">Explanation</h2>
            <div className="output-box">
              {explanation.split("\n").map((line, i) =>
                line.trim() ? <p key={i}>{line}</p> : null
              )}
            </div>
            <button
              className="btn btn-secondary"
              onClick={handleSimplify}
              disabled={loading}
            >
              {loading ? "Simplifying…" : "🔄 Simplify More"}
            </button>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Google Gemini · StudyNanbar MVP</p>
      </footer>
    </div>
  );
}

export default App;
