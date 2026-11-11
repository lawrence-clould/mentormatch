"use client";

export default function AdminSettings() {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3><i className="bi bi-gear"></i> Settings</h3>
          <p className="text-muted">Manage your account settings and security.</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-7">
          <div className="card shadow mb-4">
            <div className="card-header">
              <h5 className="mb-0"><i className="bi bi-lock"></i> Change Password</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Current Password *</label>
                  <input type="password" className="form-control" placeholder="Enter current password" />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password *</label>
                  <input type="password" className="form-control" placeholder="Enter new password (min 6 characters)" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password *</label>
                  <input type="password" className="form-control" placeholder="Re-enter new password" />
                </div>
                <div className="security-tips mb-3 bg-light p-3 rounded">
                  <strong><i className="bi bi-shield-check"></i> Security Tips:</strong>
                  <ul className="mb-0 small text-muted">
                    <li>Use a strong password with a mix of letters, numbers, and symbols</li>
                    <li>Do not share your password with anyone</li>
                  </ul>
                </div>
                <button type="button" className="btn btn-primary w-100">
                  <i className="bi bi-key"></i> Change Password
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow mb-4">
            <div className="card-header">
              <h5 className="mb-0"><i className="bi bi-person-circle"></i> Account Information</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                  A
                </div>
                <div>
                  <h6 className="mb-0">System Admin</h6>
                  <small className="text-muted">admin@mentormatch.com</small>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-6">
                  <small className="text-muted">Role</small>
                  <p className="fw-bold">Admin</p>
                </div>
                <div className="col-6">
                  <small className="text-muted">Status</small>
                  <p className="fw-bold"><span className="badge bg-success">Active</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}