import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="list-group list-group-flush rounded">
                <Link href="/admin/dashboard" className="list-group-item list-group-item-action border-0">
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </Link>
                <Link href="/admin/users" className="list-group-item list-group-item-action border-0">
                  <i className="bi bi-people me-2"></i> Users Management
                </Link>
                <Link href="/admin/applications" className="list-group-item list-group-item-action border-0">
                  <i className="bi bi-file-earmark-check me-2"></i> Applications
                </Link>
                <Link href="/admin/settings" className="list-group-item list-group-item-action border-0">
                  <i className="bi bi-gear me-2"></i> Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10">
          {children}
        </div>
      </div>
    </div>
  );
}