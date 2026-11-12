"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MentorSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = () => {
    fetch("/api/mentor/sessions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleConfirm = async (id: number) => {
    if (!confirm("Confirm this booking request?")) return;
    await fetch(`/api/mentor/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "confirm" }),
    });
    alert("Booking confirmed!");
    fetchSessions();
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3><i className="bi bi-calendar-check"></i> My Sessions</h3>
      
      <div className="card shadow-sm border-0 mt-3">
        <div className="card-body p-0">
          {sessions.length === 0 ? (
            <p className="text-center py-5 text-muted">No sessions found.</p>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Mentee</th>
                  <th>Course</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.mentee_name}</td>
                    <td>{s.course_code}</td>
                    <td>{new Date(s.session_date).toLocaleString()}</td>
                    <td>
                      <span className={`badge bg-${s.status === 'completed' ? 'success' : s.status === 'confirmed' ? 'primary' : 'warning'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.status === "pending" && s.payment_status === "paid_to_admin" && (
                        <button className="btn btn-sm btn-success" onClick={() => handleConfirm(s.id)}>
                          Confirm Booking
                        </button>
                      )}
                      {s.status === "confirmed" && <span className="text-muted">Awaiting session</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}