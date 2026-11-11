"use client";

import { useEffect, useState } from "react";

export default function MenteePayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/mentee/payments");
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch (error) {
        console.error("Failed to load payments", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3><i className="bi bi-credit-card"></i> My Payments</h3>
          <p className="text-muted">View all your payment transactions and history.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Total Spent</h6>
              <h2>K0.00</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Completed</h6>
              <h2>0</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body">
              <h6 className="card-title">Pending</h6>
              <h2>0</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Service Fees</h6>
              <h2>K0.00</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card shadow">
        <div className="card-header">
          <h6 className="mb-0"><i className="bi bi-list-ul"></i> Payment History</h6>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <p className="text-center text-muted py-3">Loading payments...</p>
          ) : payments.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-credit-card display-1 text-muted"></i>
              <p className="text-muted mt-3">No payment history found.</p>
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
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td><span className="badge bg-light text-dark">{payment.transaction_reference?.slice(-8)}</span></td>
                      <td>{payment.mentor_name}</td>
                      <td>{payment.course_code}</td>
                      <td>K{payment.amount}</td>
                      <td>K{payment.admin_fee}</td>
                      <td>
                        <span className={`badge bg-${payment.payment_status === 'released' ? 'success' : 'warning'}`}>
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