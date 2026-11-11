"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeSessionDetails() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`/api/mentee/sessions/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setFeedback(data.feedback);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (params.id) fetchSession();
  }, [params.id]);

  const cancelSession = async () => {
    if (!confirm("Cancel this session?")) return;
    await fetch(`/api/mentee/sessions/${params.id}`, { method: "DELETE" });
    router.refresh();
  };

  const submitFeedback = async () => {
    await fetch(`/api/mentee/sessions/${params.id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comments }),
    });
    router.refresh();
  };

  if (!session) return <p className="text-center py-5">Loading session...</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3><i className="bi bi-calendar-check"></i> Session #{session.id}</h3>
        <Link href="/mentee/sessions" className="btn btn-secondary btn-sm">
          <i className="bi bi-arrow-left"></i> Back
        </Link>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card shadow mb-3">
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr><td><strong>Course:</strong></td><td>{session.course_code}</td></tr>
                  <tr><td><strong>Mentor:</strong></td><td>{session.mentor_name}<br/><small className="text-muted">{session.mentor_email}</small></td></tr>
                  <tr><td><strong>Date:</strong></td><td>{new Date(session.session_date).toLocaleString()}</td></tr>
                  <tr><td><strong>Duration:</strong></td><td>{session.duration_minutes} min</td></tr>
                  <tr><td><strong>Total:</strong></td><td>K{session.total_amount}</td></tr>
                  <tr><td><strong>Status:</strong></td><td><span className={`badge bg-${session.status === "completed" ? "success" : "warning"}`}>{session.status}</span></td></tr>
                  <tr><td><strong>Payment:</strong></td><td><span className={`badge bg-${session.payment_status === "released_to_mentor" ? "success" : "info"}`}>{session.payment_status}</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Feedback Form */}
          {session.status === "completed" && (
            <div className="card shadow">
              <div className="card-header"><h6 className="mb-0"><i className="bi bi-star"></i> Feedback</h6></div>
              <div className="card-body">
                {feedback ? (
                  <>
                    <p><strong>Your Rating:</strong> {"★".repeat(feedback.rating)}{"☆".repeat(5 - feedback.rating)}</p>
                    {feedback.comments && <p className="bg-light p-3 rounded">{feedback.comments}</p>}
                  </>
                ) : (
                  <>
                    <label className="form-label">Rating</label>
                    <div className="mb-3">
                      {[1,2,3,4,5].map((n) => (
                        <button key={n} className={`btn btn-sm me-1 ${rating === n ? "btn-warning" : "btn-outline-secondary"}`} onClick={() => setRating(n)}>
                          {n}★
                        </button>
                      ))}
                    </div>
                    <label className="form-label">Comments</label>
                    <textarea className="form-control mb-3" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} />
                    <button className="btn btn-primary" onClick={submitFeedback}>Submit Feedback</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-header"><h6 className="mb-0">Actions</h6></div>
            <div className="card-body d-grid gap-2">
              {session.payment_status === "pending" && (
                <Link href={`/mentee/payments/${session.id}`} className="btn btn-success">
                  <i className="bi bi-credit-card"></i> Pay Now
                </Link>
              )}
              {(session.status === "pending" || session.status === "confirmed") && (
                <button className="btn btn-danger" onClick={cancelSession}>
                  <i className="bi bi-x-circle"></i> Cancel Session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}