"use client";

export default function AdminPayments() {
  return (
    <div>
      <h3><i className="bi bi-credit-card"></i> Payments</h3>
      <p className="text-muted">View and manage all payment transactions.</p>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <h5 className="card-title">Total Payments</h5>
              <h2>0</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <h5 className="card-title">Captured</h5>
              <h2>K0.00</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <h5 className="card-title">Released</h5>
              <h2>K0.00</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body">
              <h5 className="card-title">Service Fees</h5>
              <h2>K0.00</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <form className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Filter by Status</label>
              <select className="form-select">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="captured">Captured</option>
                <option value="released">Released</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Mentee</th>
                  <th>Mentor</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Fee (5%)</th>
                  <th>Payout</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9} className="text-center text-muted py-4">
                    No payments found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}