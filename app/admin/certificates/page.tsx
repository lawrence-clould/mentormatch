"use client";

export default function AdminCertificates() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3><i className="bi bi-award"></i> Certificates</h3>
          <p className="text-muted">Accredit certificates to high-performing mentors.</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Total Issued</h6>
              <h2 className="mb-0">0</h2>
              <small>All certificates</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Active</h6>
              <h2 className="mb-0">0</h2>
              <small>Issued certificates</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body">
              <h6 className="card-title">Pending</h6>
              <h2 className="mb-0">0</h2>
              <small>Awaiting issuance</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <h6 className="card-title">Unique Mentors</h6>
              <h2 className="mb-0">0</h2>
              <small>With certificates</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0"><i className="bi bi-list-ul"></i> All Certificates</h6>
          <span className="badge bg-secondary">0 entries</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Mentor</th>
                  <th>Semester</th>
                  <th>Hours</th>
                  <th>Sessions</th>
                  <th>Issued</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    <i className="bi bi-award display-1 text-muted d-block mb-2"></i>
                    No certificates issued yet.
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