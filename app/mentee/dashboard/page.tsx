"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalSpent: 0,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/mentee/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentSessions(data.recentSessions);
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: "linear-gradient(135deg, #17a2b8 0%, #0d6efd 100%)", color: "white" }}>
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3><i className="bi bi-person-circle"></i> Welcome back!</h3>
              <small>Find the right mentor to help you succeed in your courses.</small>
            </div>
            <div className="col-md-4 text-end">
              <div className="bg-white bg-opacity-25 p-2 rounded d-inline-block">
                <div className="small">Active Semester</div>
                <div className="fw-bold">Semester 1</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Total Sessions</h6>
              <h2 className="mb-0">{loading ? "..." : stats.totalSessions}</h2>
              <small>{stats.completedSessions} completed</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Upcoming</h6>
              <h2 className="mb-0">{loading ? "..." : stats.upcomingSessions}</h2>
              <small>Scheduled sessions</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body">
              <h6 className="card-title">Total Spent</h6>
              <h2 className="mb-0">K{loading ? "..." : stats.totalSpent.toFixed(2)}</h2>
              <small>All payments</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Feedback Given</h6>
              <h2 className="mb-0">{loading ? "..." : 0}</h2>
              <small>Help others improve</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-2 mb-4">
        <div className="col-4 col-md-3">
          <Link href="/mentee/search" className="btn btn-outline-primary w-100 py-3">
            <i className="bi bi-search d-block fs-3 mb-2"></i> Find a Mentor
          </Link>
        </div>
        <div className="col-4 col-md-3">
          <Link href="/mentee/sessions" className="btn btn-outline-success w-100 py-3">
            <i className="bi bi-calendar-check d-block fs-3 mb-2"></i> My Sessions
          </Link>
        </div>
        <div className="col-4 col-md-3">
          <Link href="/mentee/payments" className="btn btn-outline-warning w-100 py-3">
            <i className="bi bi-credit-card d-block fs-3 mb-2"></i> Payments
          </Link>
        </div>
        <div className="col-4 col-md-3">
          <Link href="/mentee/feedback" className="btn btn-outline-info w-100 py-3">
            <i className="bi bi-star d-block fs-3 mb-2"></i> My Feedback
          </Link>
        </div>
      </div>

      {/* Recent Sessions Placeholder */}
      <div className="card shadow mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0"><i className="bi bi-clock-history"></i> Recent Sessions</h6>
          <Link href="/mentee/sessions" className="btn btn-sm btn-primary">View All</Link>
        </div>
        <div className="card-body">
          {loading ? (
            <p className="text-center text-muted py-3">Loading sessions...</p>
          ) : recentSessions.length === 0 ? (
            <p className="text-center text-muted py-3">No sessions yet. <Link href="/mentee/search">Find a mentor now</Link></p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Mentor</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((session) => (
                    <tr key={session.id}>
                      <td>{session.mentor_name}</td>
                      <td>{session.course_code}</td>
                      <td>{new Date(session.session_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${session.status === "completed" ? "success" : "warning"}`}>
                          {session.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${session.payment_status === "released_to_mentor" ? "success" : "info"}`}>
                          {session.payment_status}
                        </span>
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