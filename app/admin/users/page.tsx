"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError("Failed to load users.");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId: number) => {
    if (!confirm("Are you sure you want to approve this user?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, status: "active" }),
      });
      if (res.ok) fetchUsers();
      else alert("Failed to approve user.");
    } catch (err) {
      alert("An error occurred.");
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("An error occurred.");
    }
  };

  if (loading && users.length === 0) return <div className="text-center py-5">Loading users...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  // Calculate stats dynamically
  const totalUsers = users.length;
  const activeMentors = users.filter(u => u.role === 'mentor' && u.status === 'active').length;
  const activeMentees = users.filter(u => u.role === 'mentee' && u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h3><i className="bi bi-people"></i> Users Management</h3>
          <p className="text-muted">Manage all mentors and mentees on the platform.</p>
        </div>
        <div>
          <Link href="/register" className="btn btn-success" target="_blank">
            <i className="bi bi-person-plus"></i> Add New User
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card stat-card text-white shadow" style={{ background: "#26867a", border: "none" }}>
            <div className="card-body">
              <h6 className="card-title">Total Users</h6>
              <h2 className="mb-0">{totalUsers}</h2>
              <small className="opacity-75">All registered users</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card text-white shadow" style={{ background: "#3b9d53", border: "none" }}>
            <div className="card-body">
              <h6 className="card-title">Active Mentors</h6>
              <h2 className="mb-0">{activeMentors}</h2>
              <small className="opacity-75"><i className="bi bi-star-fill"></i> Mentors</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card text-dark shadow" style={{ background: "#1bc5e8", border: "none" }}>
            <div className="card-body">
              <h6 className="card-title">Active Mentees</h6>
              <h2 className="mb-0">{activeMentees}</h2>
              <small className="opacity-75"><i className="bi bi-person"></i> Mentees</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card text-dark shadow" style={{ background: "#ffc107", border: "none" }}>
            <div className="card-body">
              <h6 className="card-title">Pending</h6>
              <h2 className="mb-0">{pendingUsers}</h2>
              <small className="opacity-75">Awaiting approval</small>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="row g-4">
        {users.map((user) => (
          <div className="col-xl-4 col-lg-6 col-md-6" key={user.id}>
            <div className="card user-card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center text-white me-3 ${
                      user.role === "mentor" ? "bg-primary" : "bg-success"
                    }`}
                    style={{ width: "50px", height: "50px", fontSize: "1.2rem", fontWeight: "bold" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-0 fw-bold">{user.name}</h5>
                    <small className="text-muted">MM-{String(user.id).padStart(8, '0')}</small>
                    <div className="mt-1">
                      <span className={`badge ${user.role === "mentor" ? "bg-primary" : "bg-success"}`}>
                        {user.role}
                      </span>
                      <span
                        className={`badge ms-1 ${
                          user.status === "pending"
                            ? "bg-warning text-dark"
                            : user.status === "active"
                            ? "bg-info"
                            : "bg-secondary"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-muted small mb-3">
                  <div className="mb-1"><i className="bi bi-envelope me-2"></i>{user.email}</div>
                  <div className="mb-1"><i className="bi bi-phone me-2"></i>{user.phone || "N/A"}</div>
                  <div className="mb-1"><i className="bi bi-book me-2"></i>{user.programme || "N/A"}</div>
                  <div className="mb-1"><i className="bi bi-graph-up me-2"></i>Year {user.year_of_study || "N/A"}</div>
                </div>

                <div className="d-flex gap-2 mt-auto pt-2">
                  <button className="btn btn-outline-primary flex-grow-1">View</button>
                  
                  {user.status === "pending" && (
                    <button
                      className="btn btn-success flex-grow-1"
                      onClick={() => handleApprove(user.id)}
                    >
                      Approve
                    </button>
                  )}

                  <button 
                    className="btn btn-outline-danger flex-grow-1"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="col-12 text-center py-5">
            <h4 className="text-muted">No users found</h4>
          </div>
        )}
      </div>
    </div>
  );
}