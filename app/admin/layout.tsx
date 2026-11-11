import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import { getSession } from "@/lib/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 shadow-sm mb-4">
        <div className="container-fluid">
          <Link href="/admin/dashboard" className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock fs-4"></i>
            MentorMatch Admin
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-light small d-none d-sm-inline">
              <i className="bi bi-person-circle me-1"></i> {user.name}
            </span>
            <form action={logoutAction} className="m-0">
              <button type="submit" className="btn btn-outline-light btn-sm">
                <i className="bi bi-box-arrow-right me-1"></i> Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content Area (Sidebar + Page) */}
      <div className="container-fluid">
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
                    <i className="bi bi-file-earmark-text me-2"></i> Applications
                  </Link>
                  <Link href="/admin/settings" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-gear me-2"></i> Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 pb-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}