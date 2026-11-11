import Link from "next/link";
import { ReactNode } from "react";

export default function MenteeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-fluid mt-4">
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
                <Link href="/mentee/sessions" className="list-group-item list-group-item-action border-0">
                  <i className="bi bi-calendar-check me-2"></i> My Sessions
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

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10">
          {children}
        </div>
      </div>
    </div>
  );
}