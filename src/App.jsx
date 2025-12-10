import { useState, useEffect, useMemo } from "react";
import "./App.css";

const STORAGE_KEY = "study-tracker:sessions";

const initialSessions = [
  {
    id: 1,
    subject: "Data Structures & Algorithms",
    duration: 60, // minutes
    date: "2025-12-10",
    completed: false,
  },
  {
    id: 2,
    subject: "DBMS Revision",
    duration: 45,
    date: "2025-12-11",
    completed: true,
  },
  {
    id: 3,
    subject: "Operating Systems",
    duration: 30,
    date: "2025-12-12",
    completed: false,
  },
];

function App() {
  // Load sessions from localStorage (fallback to initialSessions)
  const [sessions, setSessions] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error("Failed to load sessions from localStorage:", err);
    }
    return initialSessions;
  });

  const [formData, setFormData] = useState({
    subject: "",
    duration: "",
    date: "",
    notes: "",
  });

  // filter state: "all" | "completed" | "pending"
  const [filter, setFilter] = useState("all");

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (err) {
      console.error("Failed to save sessions to localStorage:", err);
    }
  }, [sessions]);

  // 📊 Derived stats
  const totalSessions = sessions.length;

  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0),
    [sessions]
  );

  const completedCount = useMemo(
    () => sessions.filter((s) => s.completed).length,
    [sessions]
  );

  const pendingCount = totalSessions - completedCount;

  const completionRate = totalSessions
    ? Math.round((completedCount / totalSessions) * 100)
    : 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.subject || !formData.duration || !formData.date) {
      alert("Subject, duration and date are required.");
      return;
    }

    const newSession = {
      id: Date.now(),
      subject: formData.subject,
      duration: Number(formData.duration),
      date: formData.date,
      notes: formData.notes,
      completed: false,
    };

    setSessions((prev) => [...prev, newSession]);

    setFormData({
      subject: "",
      duration: "",
      date: "",
      notes: "",
    });
  }

  function handleToggleCompleted(id) {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? { ...session, completed: !session.completed }
          : session
      )
    );
  }

  // 🗑️ NEW: delete session handler (Task 2)
  function handleDeleteSession(id) {
    const ok = window.confirm(
      "Are you sure you want to delete this session?"
    );
    if (!ok) return;

    setSessions((prev) => prev.filter((session) => session.id !== id));
  }

  function handleResetData() {
    setSessions(initialSessions);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear localStorage:", err);
    }
  }

  // derived list based on filter
  const filteredSessions = sessions.filter((session) => {
    if (filter === "completed") return session.completed;
    if (filter === "pending") return !session.completed;
    return true; // "all"
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Study Tracker</h1>
        <p>Track your daily study sessions in one place.</p>
      </header>

      {/* 📊 Stats summary */}
      <section className="stats-bar">
        <div className="stat-card">
          <span className="stat-label">Total Sessions</span>
          <span className="stat-value">{totalSessions}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Minutes</span>
          <span className="stat-value">{totalMinutes}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value">
            {completedCount} / {totalSessions}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pendingCount}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completion Rate</span>
          <span className="stat-value">{completionRate}%</span>
        </div>
      </section>

      <main className="layout">
        {/* Form section */}
        <section className="session-form">
          <h2>Add New Session</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. DSA, DBMS..."
                required
              />
            </div>

            <div className="field">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 45"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Topic, chapter, or any notes..."
              />
            </div>

            <button type="submit" className="primary-btn">
              Add Session
            </button>
          </form>
        </section>

        {/* List section */}
        <section className="session-list">
          <div className="session-list-header">
            <h2>Study Sessions</h2>

            <div className="header-actions">
              {/* filter buttons */}
              <div className="filter-buttons">
                <button
                  type="button"
                  className={`filter-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`filter-btn ${
                    filter === "completed" ? "active" : ""
                  }`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
                <button
                  type="button"
                  className={`filter-btn ${
                    filter === "pending" ? "active" : ""
                  }`}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </button>
              </div>

              {/* optional reset button */}
              <button
                type="button"
                className="link-btn"
                onClick={handleResetData}
              >
                Reset to sample data
              </button>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <p>No sessions for this filter.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Duration (mins)</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th> {/* 🆕 Task 2 column */}
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session, index) => (
                  <tr key={session.id}>
                    <td>{index + 1}</td>
                    <td>{session.subject}</td>
                    <td>{session.duration}</td>
                    <td>{session.date}</td>
                    <td>
                      {session.completed ? (
                        <>
                          ✅ Completed{" "}
                          <button
                            type="button"
                            className="link-btn"
                            onClick={() => handleToggleCompleted(session.id)}
                          >
                            Undo
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="primary-btn small"
                          onClick={() => handleToggleCompleted(session.id)}
                        >
                          Mark as completed
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="link-btn danger"
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
