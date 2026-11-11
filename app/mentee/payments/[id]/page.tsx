"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentDetail() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    
    // Fetch the session details for this ID
    fetch(`/api/mentee/sessions/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handlePay = async () => {
    if (!confirm("Confirm payment for this session?")) return;
    setProcessing(true);

    try {
      const res = await fetch(`/api/mentee/sessions/${params.id}/pay`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Payment successful!");
        router.push("/mentee/sessions");
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading payment details...</div>;
  if (!session) return <div className="text-center py-5">Session not found.</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3><i className="bi bi-credit-card"></i> Payment Details</h3>
        <Link href="/mentee/sessions" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left"></i> Back to Sessions
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h5 className="card-title border-bottom pb-3 mb-3">Session Summary</h5>
          
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Session ID:</div>
            <div className="col-sm-8 fw-bold">#{session.id}</div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Course:</div>
            <div className="col-sm-8 fw-bold">{session.course_code}</div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Date & Time:</div>
            <div className="col-sm-8">{new Date(session.session_date).toLocaleString()}</div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-4 text-muted">Duration:</div>
            <div className="col-sm-8">{session.duration_minutes} minutes</div>
          </div>

          <div className="bg-light rounded p-3 mt-4 mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Mentor Rate</span>
              <span>K{Number(session.mentor_rate).toFixed(2)}/hr</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Service Fee (5%)</span>
              <span>K{Number(session.admin_fee).toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold fs-5">Total Amount</span>
              <span className="fw-bold fs-5 text-primary">K{Number(session.total_amount).toFixed(2)}</span>
            </div>
          </div>

          {session.payment_status === "pending" ? (
            <button 
              onClick={handlePay} 
              className="btn btn-success w-100 py-3 fs-5" 
              disabled={processing}
            >
              <i className="bi bi-wallet2"></i> {processing ? "Processing Payment..." : `Pay K${Number(session.total_amount).toFixed(2)} Now`}
            </button>
          ) : (
            <div className="alert alert-success text-center mb-0">
              <i className="bi bi-check-circle-fill"></i> This session has already been paid.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}