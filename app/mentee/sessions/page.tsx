"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch("/api/mentee/sessions");
        if (res.ok) {
          const data = await res.json();
          setSessions(data);
        }
      } catch (error) {
        console.error("Failed to load sessions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3><i className="bi bi-calendar-check"></i> My Sessions</h3>
          <p className="text-muted">View and manage all your booked sessions.</p>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <a className="nav-link active" href="#">All</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Upcoming</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Completed</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Cancelled</a>
        </li>
      </ul>

      {/* Sessions Table */}
      <div className="card shadow">
        <div className="card-body">
          {loading ? (
            <p className="text-center text-muted py-3">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <p className="text-muted mt-3">No sessions found. <Link href="/mentee/search">Find a mentor now</Link></p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mentor</th>
                    <th>Course</th>
                    <th>Date & Time</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td>#{session.id}</td>
                      <td>
                        {session.mentor_name}
                        <br /><small className="text-muted">{session.mentor_email}</small>
                      </td>
                      <td>{session.course_code}</td>
                      <td>{new Date(session.session_date).toLocaleString()}</td>
                      <td>{session.duration_minutes} min</td>
                      <td>K{session.total_amount}</td>
                      <td>
                        <span className={`badge bg-${session.status === 'completed' ? 'success' : 'warning'}`}>
                          {session.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${session.payment_status === 'released_to_mentor' ? 'success' : 'info'}`}>
                          {session.payment_status}
                        </span>
                      </td>
                      <td>
                        <Link href={`/mentee/sessions/${session.id}`} className="btn btn-sm btn-primary">
                          <i className="bi bi-eye"></i>
                        </Link>
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