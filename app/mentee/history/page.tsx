"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeHistory() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mentee/history")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading history...</div>;
  if (!data || data.error) return <div className="text-center py-5 text-danger">Failed to load history.</div>;

  const { sessions, stats } = data;

  return (
    <div className="container-fluid mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-clock-history"></i> History</h3>
        <p className="text-muted">View your session history and learning journey.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Total Sessions</h6>
              <h2 className="mb-0">{stats.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Completed</h6>
              <h2 className="mb-0">{stats.completed}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Total Spent</h6>
              <h2 className="mb-0">K{stats.totalSpent.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Courses</h6>
              <h2 className="mb-0">{stats.courses}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">Session History</h5>
        </div>
        <div className="card-body p-0">
          {sessions.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No session history yet.</p>
              <Link href="/mentee/search" className="btn btn-primary btn-sm">Find a mentor now</Link>
            </div>
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
                  {sessions.map((session: any) => (
                    <tr key={session.id}>
                      <td>#{session.id}</td>
                      <td>{session.mentor_name}</td>
                      <td>{session.course_code}</td>
                      <td>{new Date(session.session_date).toLocaleDateString()}</td>
                      <td>{session.duration_minutes} min</td>
                      <td>K{Number(session.total_amount).toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${session.status === "completed" ? "success" : "danger"}`}>
                          {session.status}
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