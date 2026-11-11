"use client";

import { useEffect, useState } from "react";

export default function MenteeHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, spent: 0, courses: 0 });

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/mentee/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data.sessions);
          setStats(data.stats);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div>
      <h3><i className="bi bi-clock-history"></i> History</h3>
      <p className="text-muted">View your session history and learning journey.</p>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Total Sessions</h6>
              <h2>{stats.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Completed</h6>
              <h2>{stats.completed}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body">
              <h6 className="card-title">Total Spent</h6>
              <h2>K{stats.spent.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Courses</h6>
              <h2>{stats.courses}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header"><h5 className="mb-0">Session History</h5></div>
        <div className="card-body p-0">
          {history.length === 0 ? (
            <p className="text-center text-muted py-4">No session history yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Mentor</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((s) => (
                    <tr key={s.id}>
                      <td>#{s.id}</td>
                      <td>{s.mentor_name}</td>
                      <td>{s.course_code}</td>
                      <td>{new Date(s.session_date).toLocaleDateString()}</td>
                      <td>{s.duration_minutes} min</td>
                      <td>K{s.total_amount}</td>
                      <td>
                        <span className={`badge bg-${s.status === "completed" ? "success" : "warning"}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}