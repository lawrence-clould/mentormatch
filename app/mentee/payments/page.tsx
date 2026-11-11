"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteePayments() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mentee/payments")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading payments...</div>;
  if (!data || data.error) return <div className="text-center py-5 text-danger">Failed to load payments.</div>;

  const { payments, stats } = data;

  return (
    <div className="container-fluid mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-credit-card"></i> My Payments</h3>
        <p className="text-muted">View all your payment transactions and history.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-white shadow-sm border-0" style={{ background: "#26867a" }}>
            <div className="card-body">
              <h6 className="card-title">Total Spent</h6>
              <h2 className="mb-0">K{stats.totalSpent.toFixed(2)}</h2>
              <small>{payments.length} transactions</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white shadow-sm border-0" style={{ background: "#3b9d53" }}>
            <div className="card-body">
              <h6 className="card-title">Completed</h6>
              <h2 className="mb-0">{stats.completedCount}</h2>
              <small>Released to mentors</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-dark shadow-sm border-0" style={{ background: "#ffc107" }}>
            <div className="card-body">
              <h6 className="card-title">Pending</h6>
              <h2 className="mb-0">{stats.pendingCount}</h2>
              <small>Awaiting confirmation</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white shadow-sm border-0" style={{ background: "#1bc5e8" }}>
            <div className="card-body">
              <h6 className="card-title">Service Fees</h6>
              <h2 className="mb-0">K{stats.totalFees.toFixed(2)}</h2>
              <small>5% of total payments</small>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">Payment History</h5>
        </div>
        <div className="card-body p-0">
          {payments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-credit-card display-1 text-muted"></i>
              <p className="text-muted mt-3">No payment history found.</p>
              <Link href="/mentee/search" className="btn btn-primary btn-sm">Find a Mentor</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ref</th>
                    <th>Mentor</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment: any) => (
                    <tr key={payment.id}>
                      <td><code>TXN-{payment.id}</code></td>
                      <td>{payment.mentor_name}</td>
                      <td>{payment.course_code}</td>
                      <td>K{Number(payment.amount).toFixed(2)}</td>
                      <td>K{Number(payment.admin_fee).toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${payment.payment_status === 'released' ? 'success' : 'info'}`}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td>{new Date(payment.created_at).toLocaleDateString()}</td>
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