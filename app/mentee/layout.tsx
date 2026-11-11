import Link from "next/link";
import { ReactNode } from "react";
import { logoutAction } from "@/app/login/actions";
import { getSession } from "@/lib/session";

export default async function MenteeLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 py-2 shadow-sm mb-4">
        <div className="container-fluid">
          <Link href="/mentee/dashboard" className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill fs-4"></i>
            MentorMatch Mentee
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small d-none d-sm-inline">
              <i className="bi bi-person-circle me-1"></i> {user?.name || "Mentee"}
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
                  <Link href="/mentee/dashboard" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-speedometer2 me-2"></i> Dashboard
                  </Link>
                  <Link href="/mentee/search" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-search me-2"></i> Find a Mentor
                  </Link>
                  <Link href="/mentee/courses" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-book me-2"></i> My Courses
                  </Link>
                  <Link href="/mentee/sessions" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-calendar-check me-2"></i> My Sessions
                  </Link>
                  <Link href="/mentee/history" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-clock-history me-2"></i> History
                  </Link>
                  <Link href="/mentee/payments" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-credit-card me-2"></i> Payments
                  </Link>
                  <Link href="/mentee/feedback" className="list-group-item list-group-item-action border-0">
                    <i className="bi bi-star me-2"></i> My Feedback
                  </Link>
                  <Link href="/mentee/profile" className="list-group-item list-group-item-action border-0">
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