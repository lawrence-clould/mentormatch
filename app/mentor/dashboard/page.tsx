"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MentorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/mentor/stats").then(r => r.json()),
      fetch("/api/mentor/sessions?filter=upcoming").then(r => r.json()),
    ]).then(([s, sess]) => {
      setStats(s);
      setSessions(Array.isArray(sess) ? sess : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading...</div>;

  const fmt = (n: number) => "K" + (n || 0).toFixed(2);

  return (
    <div>
      <div className="text-white p-4 rounded mb-4" style={{ background: "linear-gradient(135deg,#28a745,#1e7e34)" }}>
        <h3><i className="bi bi-person-circle"></i> Mentor Dashboard</h3>
        <small>Track your mentorship performance</small>
      </div>

      {!stats?.has_rates && (
        <div className="alert alert-warning">
          <strong>Action required:</strong> You haven't set your rates yet.{" "}
          <Link href="/mentor/rates" className="alert-link">Set rates now</Link>
        </div>
      )}

      {stats?.requests > 0 && (
        <div className="alert alert-info">
          <strong>New session requests:</strong> {stats.requests} paid booking(s) waiting for your response.{" "}
          <Link href="/mentor/sessions?filter=requests" className="alert-link">Review</Link>
        </div>
      )}

      <div className="row g-3 mb-4">
        {[
          { label: "Total Sessions", value: stats?.total || 0, sub: `${stats?.completed || 0} completed`, bg: "bg-primary" },
          { label: "Hours", value: (stats?.hours || 0).toFixed(1), sub: "Mentoring hours", bg: "bg-success" },
          { label: "Earnings", value: fmt(stats?.earnings), sub: `${stats?.pending || 0} pending`, bg: "bg-warning text-dark" },
          { label: "Certificates", value: stats?.has_certificate ? "Yes" : "No", sub: "Earned", bg: "bg-info" },
        ].map((c, i) => (
          <div className="col-md-3" key={i}>
            <div className={`card ${c.bg} text-white`}>
              <div className="card-body">
                <h6>{c.label}</h6>
                <h2 className="mb-0">{c.value}</h2>
                <small>{c.sub}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-2 mb-4">
        {[
          { href: "/mentor/sessions", icon: "bi-calendar-check text-primary", label: "My Sessions" },
          { href: "/mentor/availability", icon: "bi-clock text-success", label: "Availability" },
          { href: "/mentor/rates", icon: "bi-currency-dollar text-warning", label: "My Rates" },
          { href: "/mentor/earnings", icon: "bi-wallet text-info", label: "Earnings" },
        ].map((q, i) => (
          <div className="col-6 col-md-3" key={i}>
            <Link href={q.href} className="d-block text-center p-3 bg-light rounded text-decoration-none text-dark">
              <i className={`${q.icon} fs-2 d-block mb-1`}></i>
              <small>{q.label}</small>
            </Link>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h6 className="mb-0"><i className="bi bi-calendar-event"></i> Upcoming Sessions</h6>
          <Link href="/mentor/sessions" className="btn btn-sm btn-primary">View All</Link>
        </div>
        <div className="card-body">
          {sessions.length === 0 ? (
            <p className="text-muted text-center py-3">No upcoming sessions.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead><tr><th>Mentee</th><th>Course</th><th>Date</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {sessions.slice(0, 5).map((s: any) => (
                    <tr key={s.id}>
                      <td>{s.mentee_name}</td>
                      <td>{s.course_code}</td>
                      <td>{new Date(s.session_date).toLocaleString()}</td>
                      <td><span className={`badge bg-${s.status === "confirmed" ? "success" : "warning"}`}>{s.status}</span></td>
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