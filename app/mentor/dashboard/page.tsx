"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MentorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        fetch("/api/mentor/stats").then((r) => r.json()),
        fetch("/api/mentor/sessions").then((r) => r.json()),
      ]);
      setStats(statsRes);
      setSessions(Array.isArray(sessionsRes) ? sessionsRes : []);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-5">Loading...</div>;

  const fmt = (n: number) => "K" + (n || 0).toFixed(2);
  const upcomingSessions = sessions.filter(s => s.status === 'pending' || s.status === 'confirmed');

  return (
    <div>
      <div className="text-white p-4 rounded mb-4 shadow-sm" style={{ background: "linear-gradient(135deg,#28a745,#1e7e34)" }}>
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
          <Link href="/mentor/sessions" className="alert-link">Review</Link>
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
            <div className={`card ${c.bg} text-white shadow-sm border-0`}>
              <div className="card-body">
                <h6>{c.label}</h6>
                <h2 className="mb-0">{c.value}</h2>
                <small>{c.sub}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold"><i className="bi bi-calendar-event"></i> Upcoming Sessions</h6>
          <Link href="/mentor/sessions" className="btn btn-sm btn-primary">View All</Link>
        </div>
        <div className="card-body">
          {upcomingSessions.length === 0 ? (
            <p className="text-muted text-center py-3">No upcoming sessions.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr><th>Mentee</th><th>Course</th><th>Date</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {upcomingSessions.slice(0, 5).map((s: any) => (
                    <tr key={s.id}>
                      <td>{s.mentee_name}</td>
                      <td>{s.course_code}</td>
                      <td>{new Date(s.session_date).toLocaleString()}</td>
                      <td>
                        <span className={`badge bg-${s.status === "confirmed" ? "success" : "warning"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <Link href={`/mentor/sessions/${s.id}`} className="btn btn-sm btn-primary">
                          <i className="bi bi-eye"></i>
                        </Link>
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