"use client";

export default function MenteeFeedback() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3><i className="bi bi-star"></i> My Feedback</h3>
          <p className="text-muted">View all the feedback you've given to mentors.</p>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <h6 className="mb-0"><i className="bi bi-list-ul"></i> Feedback History</h6>
        </div>
        <div className="card-body text-center py-5">
          <i className="bi bi-star display-1 text-muted"></i>
          <p className="text-muted mt-3">No feedback given yet.</p>
          <p className="text-muted small">Feedback will appear here once you complete and rate a session.</p>
        </div>
      </div>
    </div>
  );
}