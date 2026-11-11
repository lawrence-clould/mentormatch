"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminApplications() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mentors");

  useEffect(() => {
    fetch("/api/admin/applications")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!data || data.error) return <div className="text-center py-5 text-danger">Failed to load data.</div>;

  const { users, stats } = data;
  
  const pendingMentors = users.filter((u: any) => u.role === 'mentor' && u.status === 'pending');
  const pendingMentees = users.filter((u: any) => u.role === 'mentee' && u.status === 'pending');

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3><i className="bi bi-file-earmark-check"></i> Applications</h3>
          <p className="text-muted">Review and manage mentor and mentee applications.</p>
        </div>
        <div>
          <span className="badge bg-primary fs-6 me-2">
            <i className="bi bi-clock"></i> Pending: {stats.pendingApps}
          </span>
          <Link href="/admin/users" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-people"></i> View All Users
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Pending Applications</h6>
              <h2 className="mb-0">{stats.pendingApps}</h2>
              <small>{pendingMentors.length} Mentors | {pendingMentees.length} Mentees</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Active Users</h6>
              <h2 className="mb-0">{stats.activeUsers}</h2>
              <small>{stats.activeMentors} Mentors | {stats.activeMentees} Mentees</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Total Approved</h6>
              <h2 className="mb-0">{stats.totalApproved}</h2>
              <small>All time approvals</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title">Active Semester</h6>
              <h2 className="mb-0">Semester 1</h2>
              <small>Create one</small>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'mentors' ? 'active' : ''}`} onClick={() => setActiveTab('mentors')}>
            <i className="bi bi-person-badge"></i> Mentor Applications
            {pendingMentors.length > 0 && <span className="badge bg-danger ms-2">{pendingMentors.length}</span>}
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'mentees' ? 'active' : ''}`} onClick={() => setActiveTab('mentees')}>
            <i className="bi bi-person"></i> Mentee Enrollments
            {pendingMentees.length > 0 && <span className="badge bg-danger ms-2">{pendingMentees.length}</span>}
          </button>
        </li>
      </ul>

      {/* Content */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            {activeTab === 'mentors' ? 'Pending Mentor Applications' : 'Pending Mentee Enrollments'}
          </h5>
        </div>
        <div className="card-body">
          {activeTab === 'mentors' && pendingMentors.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-check-circle display-1 text-success"></i>
              <p className="text-muted mt-3">No pending mentor applications.</p>
            </div>
          )}
          {activeTab === 'mentees' && pendingMentees.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-check-circle display-1 text-success"></i>
              <p className="text-muted mt-3">No pending mentee enrollments.</p>
            </div>
          )}

          {/* (Optional) You can map through pendingMentors or pendingMentees here to show cards with Approve/Reject buttons */}
        </div>
      </div>
    </div>
  );
}