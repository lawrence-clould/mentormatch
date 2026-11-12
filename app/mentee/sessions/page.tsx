"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [paying, setPaying] = useState<string | null>(null);

  const fetchSessions = () => {
    fetch("/api/mentee/sessions")
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

  const handlePay = async (id: number) => {
    if (!confirm("Confirm payment? Funds will be held in escrow.")) return;
    setPaying(id.toString());

    try {
      const res = await fetch(`/api/mentee/sessions/${id}/pay`, { method: "POST" });
      if (!res.ok) throw new Error("Payment failed");
      alert("Payment successful!");
      fetchSessions();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setPaying(null);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return s.status === "pending" || s.status === "confirmed";
    if (filter === "completed") return s.status === "completed";
    if (filter === "cancelled") return s.status === "cancelled";
    return true;
  });

  return (
    <div className="container-fluid mt-4">
      <h3><i className="bi bi-calendar-check"></i> My Sessions</h3>
      <ul className="nav nav-tabs mb-4 mt-3">
        {["all", "upcoming", "completed", "cancelled"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button className={`nav-link ${filter === tab ? "active" : ""}`} onClick={() => setFilter(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <p className="text-center py-5">Loading sessions...</p>
          ) : filteredSessions.length === 0 ? (
            <p className="text-center py-5 text-muted">No sessions found.</p>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Mentor</th>
                  <th>Course</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.mentor_name}</td>
                    <td>{s.course_code}</td>
                    <td>{new Date(s.session_date).toLocaleString()}</td>
                    <td>K{Number(s.total_amount).toFixed(2)}</td>
                    <td>
                      <span className={`badge bg-${s.status === 'completed' ? 'success' : s.status === 'confirmed' ? 'primary' : 'warning'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.payment_status === "pending" && (
                        <button className="btn btn-sm btn-success" onClick={() => handlePay(s.id)} disabled={paying === s.id.toString()}>
                          Pay
                        </button>
                      )}
                      {s.status === "confirmed" && <span className="badge bg-info">Ready</span>}
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