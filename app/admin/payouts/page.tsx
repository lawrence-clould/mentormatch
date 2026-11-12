"use client";
import { useEffect, useState } from "react";

export default function AdminPayouts() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = () => {
    fetch("/api/admin/payouts")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSessions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRelease = async (id: number) => {
    if (!confirm("Release funds to this mentor?")) return;
    await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: id }),
    });
    alert("Funds released!");
    fetchSessions();
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3><i className="bi bi-cash-stack"></i> Payouts</h3>
      <p className="text-muted">Release escrow funds to mentors for completed sessions.</p>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {sessions.length === 0 ? (
            <p className="text-center py-5 text-muted">No pending payouts.</p>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Session ID</th>
                  <th>Mentor</th>
                  <th>Course</th>
                  <th>Payout Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td>{s.mentor_name}</td>
                    <td>{s.course_code}</td>
                    <td>K{Number(s.mentor_payout).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm btn-success" onClick={() => handleRelease(s.id)}>
                        <i className="bi bi-check-circle"></i> Release
                      </button>
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