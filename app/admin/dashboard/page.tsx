"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalMentees: 0,
    totalSessions: 0,
    completedSessions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3><i className="bi bi-speedometer2"></i> Admin Dashboard</h3>
          <p className="text-muted">Welcome back! Here is what&apos;s happening today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-4 col-md-6">
          <div className="card bg-primary text-white shadow">
            <div className="card-body position-relative">
              <i className="bi bi-people stat-icon"></i>
              <h6 className="card-title">Total Users</h6>
              <h2 className="mb-0">{loading ? "..." : stats.totalUsers}</h2>
              <small>
                <i className="bi bi-person-check"></i> {stats.totalMentors} Mentors | <i className="bi bi-person"></i> {stats.totalMentees} Mentees
              </small>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6">
          <div className="card bg-success text-white shadow">
            <div className="card-body position-relative">
              <i className="bi bi-calendar-check stat-icon"></i>
              <h6 className="card-title">Sessions</h6>
              <h2 className="mb-0">{loading ? "..." : stats.totalSessions}</h2>
              <small>
                <i className="bi bi-check-circle"></i> {stats.completedSessions} Completed
              </small>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body position-relative">
              <i className="bi bi-currency-dollar stat-icon"></i>
              <h6 className="card-title">Revenue</h6>
              <h2 className="mb-0">K{loading ? "..." : stats.totalRevenue.toFixed(2)}</h2>
              <small>Total platform revenue</small>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Placeholder */}
      <div className="row g-3">
        <div className="col-md-6">
            <div className="card shadow">
                <div className="card-header"><h6 className="mb-0"><i className="bi bi-clock-history"></i> Recent Sessions</h6></div>
                <div className="card-body text-muted text-center py-4">
                    Sessions will appear here once the database is connected.
                </div>
            </div>
        </div>
        <div className="col-md-6">
            <div className="card shadow">
                <div className="card-header"><h6 className="mb-0"><i className="bi bi-activity"></i> Recent Activity</h6></div>
                <div className="card-body text-muted text-center py-4">
                    System logs will appear here.
                </div>
            </div>
        </div>
      </div>
      
      <style jsx>{`
        .stat-icon {
            font-size: 3rem;
            opacity: 0.2;
            position: absolute;
            right: 1rem;
            top: 1rem;
        }
      `}</style>
    </div>
  );
}