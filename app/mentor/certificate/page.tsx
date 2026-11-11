"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MentorCertificates() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mentor/certificates")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading certificates...</div>;
  if (!data || data.error) return <div className="text-center py-5 text-danger">Failed to load certificates.</div>;

  const { certificates, stats } = data;
  const hoursLeft = stats.minHoursRequired - stats.totalHours;

  return (
    <div className="container-fluid mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-award"></i> My Certificates</h3>
        <p className="text-muted">Track your mentorship achievements and certificates.</p>
      </div>

      {/* Eligibility Status */}
      {!stats.isEligible ? (
        <div className="alert alert-info shadow-sm border-0 mb-4">
          <h5 className="alert-heading"><i className="bi bi-clock"></i> In Progress</h5>
          <p className="mb-0">
            You have completed <strong>{stats.totalHours.toFixed(1)} hours</strong>. 
            You need <strong>{hoursLeft > 0 ? hoursLeft.toFixed(1) : 0} more hours</strong> to earn a certificate.
          </p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="alert alert-success shadow-sm border-0 mb-4">
          <h5 className="alert-heading"><i className="bi bi-check-circle"></i> You are eligible!</h5>
          <p className="mb-0">You have earned {stats.totalHours.toFixed(1)} hours this semester. Admin will issue your certificate soon.</p>
        </div>
      ) : null}

      {/* Certificates Grid */}
      <div className="row g-4">
        {certificates.length === 0 ? (
          <div className="col-12 text-center py-5">
            <i className="bi bi-award display-1 text-muted"></i>
            <h5 className="mt-3">No Certificates Yet</h5>
            <p className="text-muted">Complete {stats.minHoursRequired}+ hours of mentoring to earn your first certificate.</p>
            <Link href="/mentor/sessions" className="btn btn-primary mt-2">View Sessions</Link>
          </div>
        ) : (
          certificates.map((cert: any) => (
            <div className="col-md-6 col-lg-4" key={cert.id}>
              <div className="card shadow-sm border-0 h-100" style={{ borderTop: "5px solid #ffc107" }}>
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-award-fill text-warning" style={{ fontSize: "3rem" }}></i>
                  </div>
                  <h5 className="card-title mb-1">Certificate of Achievement</h5>
                  <p className="text-muted small mb-3">{cert.semester_name}</p>
                  
                  <div className="bg-light rounded p-3 mb-3 text-start">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted small">Hours:</span>
                      <span className="fw-bold">{Number(cert.total_hours).toFixed(1)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted small">Sessions:</span>
                      <span className="fw-bold">{cert.total_sessions}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Issued:</span>
                      <span className="fw-bold">{new Date(cert.issue_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button className="btn btn-outline-primary w-100">
                    <i className="bi bi-download"></i> Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}