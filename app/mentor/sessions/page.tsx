"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SessionsInner() {
  const sp = useSearchParams();
  const filter = sp.get("filter") || "all";
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/mentor/sessions?filter=${filter}`)
      .then(r => r.json())
      .then(d => { setSessions(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const tabs = ["all", "upcoming", "pending", "requests", "completed", "cancelled"];
  const label = (t: string) => t === "requests" ? "Needs response" : t.charAt(0).toUpperCase() + t.slice(1);

  return (
    <div>
      <h3><i className="bi bi-calendar-check"></i> My Sessions</h3>
      <ul className="nav nav-tabs mb-4">
        {tabs.map(t => (
          <li className="nav-item" key={t}>
            <Link href={`/mentor/sessions?filter=${t}`} className={`nav-link ${filter === t ? "active" : ""}`}>{label(t)}</Link>
          </li>
        ))}
      </ul>
      <div className="card">
        <div className="card-body">
          {loading ? <p>Loading...</p> : sessions.length === 0 ? (
            <p className="text-muted text-center py-3">No sessions found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead><tr><th>ID</th><th>Mentee</th><th>Course</th><th>Date</th><th>Status</th><th>Payment</th><th></th></tr></thead>
                <tbody>
                  {sessions.map((s: any) => (
                    <tr key={s.id}>
                      <td>#{s.id}</td>
                      <td>{s.mentee_name}<br /><small className="text-muted">{s.mentee_email}</small></td>
                      <td>{s.course_code}</td>
                      <td>{new Date(s.session_date).toLocaleString()}</td>
                      <td><span className={`badge bg-${s.status === "completed" ? "success" : s.status === "confirmed" ? "primary" : s.status === "pending" ? "warning" : "danger"}`}>{s.status}</span></td>
                      <td><span className={`badge bg-${s.payment_status === "released_to_mentor" ? "success" : s.payment_status === "paid_to_admin" ? "info" : "secondary"}`}>{s.payment_status}</span></td>
                      <td><Link href={`/mentor/sessions/${s.id}`} className="btn btn-sm btn-primary"><i className="bi bi-eye"></i></Link></td>
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

export default function MentorSessions() {
  return <Suspense fallback={<div className="text-center py-5">Loading...</div>}><SessionsInner /></Suspense>;
}