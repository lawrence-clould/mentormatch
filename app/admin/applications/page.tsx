"use client";

import { useEffect, useState } from "react";

export default function AdminApplications() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h3><i className="bi bi-file-earmark-check"></i> Applications</h3>
          <p className="text-muted">Review and manage mentor and mentee applications.</p>
        </div>
        <div>
          <span className="badge bg-primary fs-6 me-2">
            <i className="bi bi-clock"></i> Pending: 0
          </span>
          <a href="/admin/users" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-people"></i> View All Users
          </a>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card stat-card bg-warning text-dark shadow">
            <div className="card-body">
              <h6 className="card-title">Pending Applications</h6>
              <h2 className="mb-0">0</h2>
              <small>0 Mentors | 0 Mentees</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card bg-success text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Active Users</h6>
              <h2 className="mb-0">0</h2>
              <small>0 Mentors | 0 Mentees</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card bg-primary text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Total Approved</h6>
              <h2 className="mb-0">0</h2>
              <small>All time approvals</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card bg-info text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Active Semester</h6>
              <h2 className="mb-0">None</h2>
              <small>Create one</small>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#mentors" type="button" role="tab">
            <i className="bi bi-person-badge"></i> Mentor Applications
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#mentees" type="button" role="tab">
            <i className="bi bi-person"></i> Mentee Enrollments
          </button>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane fade show active" id="mentors" role="tabpanel">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><i className="bi bi-person-badge"></i> Pending Mentor Applications</h5>
              <span className="badge bg-primary">0 pending</span>
            </div>
            <div className="card-body text-center py-5">
              <i className="bi bi-check-circle display-1 text-success"></i>
              <p className="text-muted mt-3">No pending mentor applications.</p>
              <p className="text-muted small">All mentor applications have been reviewed.</p>
            </div>
          </div>
        </div>
        
        <div className="tab-pane fade" id="mentees" role="tabpanel">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><i className="bi bi-person"></i> Pending Mentee Enrollments</h5>
              <span className="badge bg-primary">0 pending</span>
            </div>
            <div className="card-body text-center py-5">
              <i className="bi bi-check-circle display-1 text-success"></i>
              <p className="text-muted mt-3">No pending mentee enrollments.</p>
              <p className="text-muted small">All mentee enrollments have been reviewed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}