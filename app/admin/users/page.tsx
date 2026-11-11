"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
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

      if (res.ok) {
        fetchUsers(); // Refresh the list
      } else {
        alert("Failed to approve user.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  if (loading) return <div className="container mt-5 text-center"><h3>Loading users...</h3></div>;
  if (error) return <div className="container mt-5 text-center text-danger"><h3>{error}</h3></div>;

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
          <div className="card stat-card bg-primary text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Total Users</h6>
              <h2 className="mb-0">{totalUsers}</h2>
              <small>All registered users</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card bg-success text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Active Mentors</h6>
              <h2 className="mb-0">{activeMentors}</h2>
              <small><i className="bi bi-star-fill"></i> Mentors</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card bg-info text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Active Mentees</h6>
              <h2 className="mb-0">{activeMentees}</h2>
              <small><i className="bi bi-person"></i> Mentees</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card stat-card bg-warning text-dark shadow">
            <div className="card-body">
              <h6 className="card-title">Pending</h6>
              <h2 className="mb-0">{pendingUsers}</h2>
              <small>Awaiting approval</small>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="row g-3">
        {users.length === 0 ? (
          <div className="col-12 text-center py-5">
            <i className="bi bi-people display-1 text-muted"></i>
            <p className="text-muted mt-3">No users found.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card user-card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-3">
                    <div 
                      className="me-3 d-flex align-items-center justify-content-center text-white rounded-circle"
                      style={{ 
                        width: '60px', height: '60px', fontSize: '1.5rem', fontWeight: 'bold',
                        background: user.role === 'mentor' ? 'linear-gradient(135deg, #0d6efd, #0a58ca)' : 'linear-gradient(135deg, #28a745, #1e7e34)' 
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{user.name}</h6>
                      <small className="d-block text-muted">MM-{String(user.id).padStart(8, '0')}</small>
                      <span className={`badge ${user.role === 'mentor' ? 'bg-primary' : 'bg-success'}`}>
                        {user.role}
                      </span>
                      <span className={`badge bg-${user.status === 'active' ? 'success' : 'warning'} ms-1`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="small text-muted">
                    <div><i className="bi bi-envelope"></i> {user.email}</div>
                    <div><i className="bi bi-phone"></i> {user.phone || 'N/A'}</div>
                    {user.programme && <div><i className="bi bi-book"></i> {user.programme}</div>}
                    {user.year_of_study && <div><i className="bi bi-graph-up"></i> Year {user.year_of_study}</div>}
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-primary w-100 me-1">View</button>
                  
                  {/* Added Approve Button */}
                  {user.status === "pending" && (
                    <button 
                      className="btn btn-sm btn-success w-100 mx-1" 
                      onClick={() => handleApprove(user.id)}
                    >
                      Approve
                    </button>
                  )}

                  <button className="btn btn-sm btn-outline-danger w-100 ms-1">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .stat-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .user-card {
            transition: all 0.3s ease;
            border-radius: 16px;
        }
        .user-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}