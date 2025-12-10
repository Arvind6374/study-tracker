import { useState } from "react";
import "./App.css";

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
  const [sessions, setSessions] = useState(initialSessions);

  const [formData, setFormData] = useState({
    subject: "",
    duration: "",
    date: "",
    notes: "",
  });

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

    // reset form
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Study Tracker</h1>
        <p>Track your daily study sessions in one place.</p>
      </header>

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
          <h2>Study Sessions</h2>

          {sessions.length === 0 ? (
            <p>No sessions yet. Start by adding one!</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Duration (mins)</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
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
