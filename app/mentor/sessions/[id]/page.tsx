"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function MentorSessionDetail() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [meetingLink, setMeetingLink] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSession = () => {
    if (!params.id) return;
    fetch(`/api/mentor/sessions/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSession(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSession();
  }, [params.id]);

  const handleAddLink = async () => {
    setSaving(true);
    await fetch(`/api/mentor/sessions/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meeting_link: meetingLink }),
    });
    setSaving(false);
    fetchSession();
    alert("Meeting link saved!");
  };

  const handleComplete = async () => {
    if (!confirm("Mark this session as completed?")) return;
    await fetch(`/api/mentor/sessions/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    fetchSession();
    alert("Session marked as completed!");
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!session) return <div className="text-center py-5">Session not found.</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h3>Session #{session.id}</h3>
      <div className="card shadow-sm border-0 mt-3">
        <div className="card-body p-4">
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Mentee:</div>
            <div className="col-sm-8 fw-bold">{session.mentee_name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Course:</div>
            <div className="col-sm-8">{session.course_code}</div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Date:</div>
            <div className="col-sm-8">{new Date(session.session_date).toLocaleString()}</div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Status:</div>
            <div className="col-sm-8"><span className={`badge bg-${session.status === "completed" ? "success" : "primary"}`}>{session.status}</span></div>
          </div>

          {/* Step 4: Add Meeting Link */}
          {!session.meeting_link && session.status !== "completed" && (
            <div className="mt-4">
              <label className="form-label fw-bold">Add Meeting Link (Zoom/Google Meet)</label>
              <div className="input-group">
                <input type="url" className="form-control" placeholder="https://..." value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
                <button className="btn btn-primary" onClick={handleAddLink} disabled={saving}>
                  {saving ? "Saving..." : "Save Link"}
                </button>
              </div>
            </div>
          )}

          {session.meeting_link && (
            <div className="alert alert-info mt-3">
              <strong>Meeting Link:</strong> <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">{session.meeting_link}</a>
            </div>
          )}

          {/* Step 5: Mark as Completed */}
          {session.status !== "completed" && (
            <button className="btn btn-success w-100 mt-3" onClick={handleComplete}>
              <i className="bi bi-check-circle"></i> Mark as Completed
            </button>
          )}

          {session.status === "completed" && (
            <div className="alert alert-success mt-3">
              <i className="bi bi-check-circle"></i> Session completed. Awaiting admin payout release.
            </div>
          )}

          <Link href="/mentor/sessions" className="btn btn-secondary w-100 mt-2">Back to Sessions</Link>
        </div>
      </div>
    </div>
  );
}