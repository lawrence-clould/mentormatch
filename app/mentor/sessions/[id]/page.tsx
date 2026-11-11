"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MentorSessionDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => { params.then(p => setId(p.id)); }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/mentor/sessions/${id}`)
      .then(r => r.json())
      .then(d => { setSession(d.error ? null : d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const act = async (action: string) => {
    if (action === "cancel" && !confirm("Cancel this session?")) return;
    setBusy(true);
    const res = await fetch(`/api/mentor/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) { const data = await fetch(`/api/mentor/sessions/${id}`).then(r => r.json()); setSession(data); }
    setBusy(false);
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!session) return <div className="text-center py-5">Session not found.</div>;

  return (
    <div>
      <h3><i className="bi bi-calendar-check"></i> Session #{session.id}</h3>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-body">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr><td><strong>Course</strong></td><td>{session.course_code}</td></tr>
                  <tr><td><strong>Mentee</strong></td><td>{session.mentee_name}<br /><small className="text-muted">{session.mentee_email}</small><br /><small className="text-muted">{session.mentee_phone}</small></td></tr>
                  <tr><td><strong>Date</strong></td><td>{new Date(session.session_date).toLocaleString()}</td></tr>
                  <tr><td><strong>Duration</strong></td><td>{session.duration_minutes} min</td></tr>
                  <tr><td><strong>Status</strong></td><td><span className={`badge bg-${session.status === "completed" ? "success" : session.status === "confirmed" ? "primary" : session.status === "pending" ? "warning" : "danger"}`}>{session.status}</span></td></tr>
                  <tr><td><strong>Payment</strong></td><td><span className={`badge bg-${session.payment_status === "released_to_mentor" ? "success" : session.payment_status === "paid_to_admin" ? "info" : "secondary"}`}>{session.payment_status}</span></td></tr>
                  <tr><td><strong>Total</strong></td><td>K{Number(session.total_amount).toFixed(2)} <small className="text-muted">(Payout K{Number(session.mentor_payout).toFixed(2)})</small></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header"><h6 className="mb-0">Actions</h6></div>
            <div className="card-body d-grid gap-2">
              {session.status === "pending" && <>
                <button disabled={busy} className="btn btn-success" onClick={() => act("confirm")}><i className="bi bi-check-circle"></i> Confirm</button>
                <button disabled={busy} className="btn btn-danger" onClick={() => act("cancel")}><i className="bi bi-x-circle"></i> Cancel</button>
              </>}
              {session.status === "confirmed" && <>
                <button disabled={busy} className="btn btn-success" onClick={() => act("complete")}><i className="bi bi-check-circle"></i> Mark Complete</button>
                <button disabled={busy} className="btn btn-danger" onClick={() => act("cancel")}><i className="bi bi-x-circle"></i> Cancel</button>
              </>}
              {session.status === "completed" && <div className="alert alert-success mb-0">Session completed</div>}
              {session.status === "cancelled" && <div className="alert alert-danger mb-0">Session cancelled</div>}
              <Link href="/mentor/sessions" className="btn btn-secondary"><i className="bi bi-arrow-left"></i> Back</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}