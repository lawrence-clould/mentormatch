"use client";

export default function MenteeProfile() {
  return (
    <div>
      <h3><i className="bi bi-person"></i> My Profile</h3>
      <p className="text-muted">Manage your account details and preferences.</p>

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm text-center mb-3">
            <div className="card-body">
              <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 120, height: 120, fontSize: "3rem", fontWeight: 700 }}>
                M
              </div>
              <h4>Mentee User</h4>
              <p className="text-muted">Mentee</p>
              <div className="bg-light rounded p-2 mb-3">
                <small className="text-muted d-block">Your Reference</small>
                <strong className="fs-5">MM-00000001</strong>
              </div>
              <hr />
              <div className="row text-center">
                <div className="col-4">
                  <h5>0</h5>
                  <small className="text-muted">Total</small>
                </div>
                <div className="col-4">
                  <h5>0</h5>
                  <small className="text-muted">Completed</small>
                </div>
                <div className="col-4">
                  <h5>K0.00</h5>
                  <small className="text-muted">Spent</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Edit Profile</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-control" defaultValue="Mentee User" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email (Read Only)</label>
                  <input type="email" className="form-control" defaultValue="mentee@example.com" disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" className="form-control" defaultValue="+260 97 000 0000" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Programme</label>
                  <input type="text" className="form-control" defaultValue="Computer Science" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Year of Study</label>
                  <select className="form-select">
                    <option>Select Year</option>
                    <option>Year 1</option>
                    <option>Year 2</option>
                    <option>Year 3</option>
                    <option>Year 4</option>
                  </select>
                </div>
                <hr />
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" placeholder="Leave blank to keep current" />
                </div>
                <button type="button" className="btn btn-primary w-100">Update Profile</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}