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
    notes: "",
  },
  {
    id: 2,
    subject: "DBMS Revision",
    duration: 45,
    date: "2025-12-11",
    completed: true,
    notes: "",
  },
  {
    id: 3,
    subject: "Operating Systems",
    duration: 30,
    date: "2025-12-12",
    completed: false,
    notes: "",
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

  // search term and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

  // 📝 Edit modal state: null or { id, subject, duration, date, notes }
  const [editSession, setEditSession] = useState(null);

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
  const completionRate = totalSessions ? Math.round((completedCount / totalSessions) * 100) : 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setFormData({ subject: "", duration: "", date: "", notes: "" });
  }

  function handleToggleCompleted(id) {
    setSessions((prev) =>
      prev.map((session) => (session.id === id ? { ...session, completed: !session.completed } : session))
    );
  }

  // Delete session
  function handleDeleteSession(id) {
    const ok = window.confirm("Are you sure you want to delete this session?");
    if (!ok) return;
    setSessions((prev) => prev.filter((session) => session.id !== id));
  }

  // Reset
  function handleResetData() {
    setSessions(initialSessions);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear localStorage:", err);
    }
    setSearchTerm("");
    setFilter("all");
    setSortConfig({ key: "date", direction: "asc" });
  }

  // Search and sort handlers
  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }

  function getSortIndicator(key) {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  }

  // Combined filtered list
  const filteredSessions = useMemo(() => {
    let data = [...sessions];

    // filter
    data = data.filter((session) => {
      if (filter === "completed") return session.completed;
      if (filter === "pending") return !session.completed;
      return true;
    });

    // search
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      data = data.filter((session) => {
        const subject = (session.subject || "").toLowerCase();
        const notes = (session.notes || "").toLowerCase();
        return subject.includes(term) || notes.includes(term);
      });
    }

    // sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aVal;
        let bVal;
        if (sortConfig.key === "subject") {
          aVal = (a.subject || "").toLowerCase();
          bVal = (b.subject || "").toLowerCase();
        } else if (sortConfig.key === "duration") {
          aVal = Number(a.duration) || 0;
          bVal = Number(b.duration) || 0;
        } else {
          aVal = new Date(a.date || 0).getTime();
          bVal = new Date(b.date || 0).getTime();
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [sessions, filter, searchTerm, sortConfig]);

  // ===== Edit modal logic =====
  function openEditModal(session) {
    setEditSession({
      id: session.id,
      subject: session.subject || "",
      duration: session.duration || "",
      date: session.date || "",
      notes: session.notes || "",
    });
    // prevent background scroll
    document.body.style.overflow = "hidden";
  }

  function closeEditModal() {
    setEditSession(null);
    document.body.style.overflow = "";
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditSession((prev) => ({ ...prev, [name]: value }));
  }

  function handleSaveEdit() {
    // validation
    if (!editSession.subject || !editSession.duration || !editSession.date) {
      alert("Subject, duration and date are required.");
      return;
    }
    setSessions((prev) =>
      prev.map((s) => (s.id === editSession.id ? { ...s, subject: editSession.subject, duration: Number(editSession.duration), date: editSession.date, notes: editSession.notes } : s))
    );
    closeEditModal();
  }

  // close modal on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && editSession) {
        closeEditModal();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editSession]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Study Tracker</h1>
        <p>Track your daily study sessions in one place.</p>
      </header>

      {/* Stats */}
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
          <span className="stat-label">Completion Rate</span>
          <span className="stat-value">{completionRate}%</span>
        </div>
      </section>

      <main className="layout">
        {/* Form */}
        <section className="session-form">
          <h2>Add New Session</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} placeholder="e.g. DSA, DBMS..." required />
            </div>

            <div className="field">
              <label htmlFor="duration">Duration (minutes)</label>
              <input id="duration" name="duration" type="number" min="1" value={formData.duration} onChange={handleChange} placeholder="e.g. 45" required />
            </div>

            <div className="field">
              <label htmlFor="date">Date</label>
              <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Topic, chapter, or any notes..." />
            </div>

            <button type="submit" className="primary-btn">
              Add Session
            </button>
          </form>
        </section>

        {/* List */}
        <section className="session-list">
          <div className="session-list-header">
            <h2>Study Sessions</h2>

            <div className="header-actions">
              {/* filter buttons */}
              <div className="filter-buttons">
                <button type="button" className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                  All
                </button>
                <button type="button" className={`filter-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>
                  Completed
                </button>
                <button type="button" className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
                  Pending
                </button>
              </div>

              <div className="search-and-reset">
                <input type="text" className="search-input" placeholder="Search subject or notes..." value={searchTerm} onChange={handleSearchChange} />
                <button type="button" className="link-btn" onClick={handleResetData}>
                  Reset to sample data
                </button>
              </div>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <p>No sessions match this filter.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th className="sortable" onClick={() => handleSort("subject")}>
                    Subject <span className="sort-indicator">{getSortIndicator("subject")}</span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("duration")}>
                    Duration (mins) <span className="sort-indicator">{getSortIndicator("duration")}</span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("date")}>
                    Date <span className="sort-indicator">{getSortIndicator("date")}</span>
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
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
                          <button type="button" className="link-btn" onClick={() => handleToggleCompleted(session.id)}>
                            Undo
                          </button>
                        </>
                      ) : (
                        <button type="button" className="primary-btn small" onClick={() => handleToggleCompleted(session.id)}>
                          Mark as completed
                        </button>
                      )}
                    </td>
                    <td>
                      <button type="button" className="link-btn" onClick={() => openEditModal(session)}>
                        Edit
                      </button>
                      <button type="button" className="link-btn danger" onClick={() => handleDeleteSession(session.id)}>
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

      {/* Edit Modal */}
      {editSession && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target.classList.contains("modal-overlay")) closeEditModal(); }}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
            <h3 id="edit-modal-title">Edit Session</h3>

            <div className="field">
              <label htmlFor="edit-subject">Subject</label>
              <input id="edit-subject" name="subject" type="text" value={editSession.subject} onChange={handleEditChange} />
            </div>

            <div className="field">
              <label htmlFor="edit-duration">Duration (minutes)</label>
              <input id="edit-duration" name="duration" type="number" min="1" value={editSession.duration} onChange={handleEditChange} />
            </div>

            <div className="field">
              <label htmlFor="edit-date">Date</label>
              <input id="edit-date" name="date" type="date" value={editSession.date} onChange={handleEditChange} />
            </div>

            <div className="field">
              <label htmlFor="edit-notes">Notes (optional)</label>
              <textarea id="edit-notes" name="notes" value={editSession.notes} onChange={handleEditChange} />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", justifyContent: "flex-end" }}>
              <button type="button" className="link-btn" onClick={closeEditModal}>
                Cancel
              </button>
              <button type="button" className="primary-btn" onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
