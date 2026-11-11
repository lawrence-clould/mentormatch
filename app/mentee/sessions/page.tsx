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
    if (!confirm("Are you sure you want to pay for this session?")) return;
    setPaying(id.toString());

    try {
      const res = await fetch(`/api/mentee/sessions/${id}/pay`, {
        method: "POST",
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Payment failed");

      alert("Payment successful!");
      fetchSessions(); // Refresh the table
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setPaying(null);
    }
  };

  // CHANGED: Hard Delete Function
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this session? All associated payments and feedback will also be deleted. This cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/mentee/sessions/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        fetchSessions(); // Refresh the table
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (err) {
      alert("An error occurred");
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
      <div className="mb-4">
        <h3><i className="bi bi-calendar-check"></i> My Sessions</h3>
        <p className="text-muted">View and manage all your booked sessions.</p>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        {["all", "upcoming", "completed", "cancelled"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Sessions Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <p className="text-center py-5 text-muted">Loading sessions...</p>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <p className="text-muted mt-3">No sessions found. <Link href="/mentee/search">Find a mentor now</Link></p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
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
                  {filteredSessions.map((session) => (
                    <tr key={session.id}>
                      <td>#{session.id}</td>
                      <td>
                        {session.mentor_name}
                        <br />
                        <small className="text-muted">{session.mentor_email}</small>
                      </td>
                      <td>{session.course_code}</td>
                      <td>{new Date(session.session_date).toLocaleString()}</td>
                      <td>{session.duration_minutes} min</td>
                      <td>K{Number(session.total_amount).toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${session.status === "completed" ? "success" : session.status === "confirmed" ? "primary" : session.status === "pending" ? "warning" : "danger"}`}>
                          {session.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${session.payment_status === "released_to_mentor" ? "success" : session.payment_status === "paid_to_admin" ? "info" : "secondary"}`}>
                          {session.payment_status}
                        </span>
                      </td>
                      <td>
                        <Link href={`/mentee/sessions/${session.id}`} className="btn btn-sm btn-primary">
                          <i className="bi bi-eye"></i> View
                        </Link>

                        {/* DELETE Button */}
                        <button 
                          className="btn btn-sm btn-outline-danger ms-1" 
                          onClick={() => handleDelete(session.id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>

                        {session.payment_status === "pending" && (
                          <button 
                            className="btn btn-sm btn-success ms-1" 
                            onClick={() => handlePay(session.id)}
                            disabled={paying === session.id.toString()}
                          >
                            <i className="bi bi-credit-card"></i> {paying === session.id.toString() ? "Processing..." : "Pay"}
                          </button>
                        )}
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