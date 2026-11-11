"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MentorHistory() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mentor/history")
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
        <h3><i className="bi bi-clock-history"></i> My History</h3>
        <p className="text-muted">View your completed sessions and performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Total Sessions</h6>
              <h2 className="mb-0">{stats.totalSessions}</h2>
              <small>Completed & Cancelled</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Total Hours</h6>
              <h2 className="mb-0">{stats.totalHours.toFixed(1)}</h2>
              <small>Mentoring hours</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Total Earnings</h6>
              <h2 className="mb-0">K{stats.totalEarnings.toFixed(2)}</h2>
              <small>Released payments</small>
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
              <i className="bi bi-clock-history display-1 text-muted"></i>
              <p className="text-muted mt-3">No history found.</p>
              <Link href="/mentor/sessions" className="btn btn-primary btn-sm">View Your Sessions</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Mentee</th>
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
                      <td>
                        {session.mentee_name}
                        <br />
                        <small className="text-muted">{session.mentee_email}</small>
                      </td>
                      <td>{session.course_code}</td>
                      <td>{new Date(session.session_date).toLocaleDateString()}</td>
                      <td>{session.duration_minutes} min</td>
                      <td>K{Number(session.mentor_payout).toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${session.status === "completed" ? "success" : session.status === "cancelled" ? "danger" : "secondary"}`}>
                          {session.status.replace("_", " ")}
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