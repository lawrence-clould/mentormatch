"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeFeedback() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mentee/feedback")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFeedback(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading feedback...</div>;

  return (
    <div className="container-fluid mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-star"></i> My Feedback</h3>
        <p className="text-muted">View all the feedback you've given to mentors.</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0"><i className="bi bi-list-ul"></i> Feedback History</h5>
        </div>
        <div className="card-body p-0">
          {feedback.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-star display-1 text-muted"></i>
              <h5 className="mt-3">No feedback given yet.</h5>
              <p className="text-muted">Feedback will appear here once you complete and rate a session.</p>
              <Link href="/mentee/sessions" className="btn btn-primary mt-2">View My Sessions</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Mentor</th>
                    <th>Course</th>
                    <th>Rating</th>
                    <th>Comments</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((item: any) => (
                    <tr key={item.id}>
                      <td>{item.mentor_name}</td>
                      <td>{item.course_code}</td>
                      <td>
                        <span className="text-warning">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`bi bi-star${i < item.rating ? '-fill' : ''}`}></i>
                          ))}
                        </span>
                        <span className="ms-2 text-muted small">({item.rating}/5)</span>
                      </td>
                      <td>
                        {item.comments ? (
                          <span className="fst-italic">"{item.comments}"</span>
                        ) : (
                          <span className="text-muted">No comments</span>
                        )}
                      </td>
                      <td>{new Date(item.submitted_at).toLocaleDateString()}</td>
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