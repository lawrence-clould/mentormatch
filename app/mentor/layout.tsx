import Link from "next/link";
import { ReactNode } from "react";

export default function MentorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-fluid mt-4">
      <div className="row">
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
        <div className="col-md-9 col-lg-10">{children}</div>
      </div>
    </div>
  );
}