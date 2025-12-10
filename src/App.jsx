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

      <main>
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
