"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MentorEarnings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mentor/earnings")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading earnings...</div>;
  if (!data || data.error) return <div className="text-center py-5 text-danger">Failed to load earnings.</div>;

  const { stats, earningsByCourse, recentPayouts } = data;

  return (
    <div className="container-fluid mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-wallet"></i> My Earnings</h3>
        <p className="text-muted">Track your mentorship earnings and performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Total Earned</h6>
              <h2 className="mb-0">K{stats.totalEarned.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Pending</h6>
              <h2 className="mb-0">K{stats.pendingEarnings.toFixed(2)}</h2>
              <small>Awaiting admin release</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Total Hours</h6>
              <h2 className="mb-0">{stats.totalHours.toFixed(1)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Avg Rate</h6>
              <h2 className="mb-0">K{stats.avgRate.toFixed(2)}/hr</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {/* Earnings by Course */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Earnings by Course</h5>
            </div>
            <div className="card-body">
              {earningsByCourse.length === 0 ? (
                <p className="text-muted">No earnings data yet.</p>
              ) : (
                earningsByCourse.map((course: any, i: number) => (
                  <div key={i} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold">{course.course_code}</span>
                      <span>K{Number(course.total).toFixed(2)}</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${(course.total / stats.totalEarned) * 100}%` }}
                      ></div>
                    </div>
                    <small className="text-muted">{course.sessions} sessions</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><i className="bi bi-clock-history"></i> Recent Payouts</h5>
              <Link href="/mentor/sessions" className="btn btn-sm btn-outline-primary">View Sessions</Link>
            </div>
            <div className="card-body p-0">
              {recentPayouts.length === 0 ? (
                <p className="text-muted text-center py-4">No payouts yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Mentee</th>
                        <th>Course</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayouts.map((payout: any) => (
                        <tr key={payout.id}>
                          <td>{payout.mentee_name}</td>
                          <td>{payout.course_code}</td>
                          <td>{new Date(payout.session_date).toLocaleDateString()}</td>
                          <td className="fw-bold text-success">K{Number(payout.mentor_payout).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}