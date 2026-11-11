import Link from "next/link";
import { ReactNode } from "react";
import { logoutAction } from "@/app/login/actions";
import { getSession } from "@/lib/session";

export default async function MentorLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4 py-2 shadow-sm mb-4">
        <div className="container-fluid">
          <Link href="/mentor/dashboard" className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-person-workspace fs-4"></i>
            MentorMatch Mentor
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small d-none d-sm-inline">
              <i className="bi bi-person-circle me-1"></i> {user?.name || "Mentor"}
            </span>
            <form action={logoutAction} className="m-0">
              <button type="submit" className="btn btn-outline-light btn-sm">
                <i className="bi bi-box-arrow-right me-1"></i> Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 mb-3">
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="list-group list-group-flush rounded">
                  <Link href="/mentor/dashboard" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-speedometer2 me-2"></i> Dashboard
                  </Link>
                  <Link href="/mentor/sessions" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-calendar-check me-2"></i> My Sessions
                  </Link>
                  <Link href="/mentor/availability" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-clock me-2"></i> Availability
                  </Link>
                  <Link href="/mentor/rates" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-currency-dollar me-2"></i> My Rates
                  </Link>
                  <Link href="/mentor/earnings" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-wallet me-2"></i> Earnings
                  </Link>
                  <Link href="/mentor/history" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-clock-history me-2"></i> History
                  </Link>
                  <Link href="/mentor/certificate" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-award me-2"></i> Certificates
                  </Link>
                  <Link href="/mentor/profile" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-person me-2"></i> Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="col-md-9 col-lg-10 pb-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}