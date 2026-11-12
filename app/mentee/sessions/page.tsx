"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [paying, setPaying] = useState<string | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");

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
    if (!confirm("Confirm payment? This will hold funds in escrow until the session is completed.")) return;
    setPaying(id.toString());

    try {
      const res = await fetch(`/api/mentee/sessions/${id}/pay`, { method: "POST" });
      if (!res.ok) throw new Error("Payment failed");
      alert("Payment successful! Session is now confirmed.");
      fetchSessions();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setPaying(null);
    }
  };

  const handleFeedback = async () => {
    try {
      const res = await fetch("/api/mentee/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: feedbackModal.id, rating, comments }),
      });
      if (res.ok) {
        alert("Feedback submitted!");
        setFeedbackModal(null);
        fetchSessions();
      }
    } catch (err) {
      alert("Error submitting feedback");
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

      <ul className="nav nav-tabs mb-4">
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
                        <br /><small className="text-muted">{session.mentor_email}</small>
                      </td>
                      <td>{session.course_code}</td>
                      <td>{new Date(session.session_date).toLocaleString()}</td>
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

                        {session.payment_status === "pending" && (
                          <button className="btn btn-sm btn-success ms-1" onClick={() => handlePay(session.id)} disabled={paying === session.id.toString()}>
                            <i className="bi bi-credit-card"></i> {paying === session.id.toString() ? "Processing..." : "Pay"}
                          </button>
                        )}

                        {session.status === "completed" && (
                          <button className="btn btn-sm btn-warning ms-1" onClick={() => setFeedbackModal(session)}>
                            <i className="bi bi-star"></i> Feedback
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

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Leave Feedback for {feedbackModal.mentor_name}</h5>
                <button type="button" className="btn-close" onClick={() => setFeedbackModal(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Rating</label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`btn ${rating >= star ? "btn-warning" : "btn-outline-secondary"}`}
                        onClick={() => setRating(star)}
                      >
                        {star} ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Comments</label>
                  <textarea className="form-control" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Share your experience..." />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setFeedbackModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleFeedback}>Submit Feedback</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}