"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function BookForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mentorId = searchParams.get("mentor_id");
  const initialCourse = searchParams.get("course");

  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(initialCourse || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [error, setError] = useState("");

  const durationOptions = [30, 60, 90, 120];
  const availableDates = Array.from({ length: 15 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    async function fetchMentor() {
      if (!mentorId) return;
      try {
        const res = await fetch(`/api/mentee/search`);
        if (res.ok) {
          const data = await res.json();
          const found = data.find((m: any) => m.id.toString() === mentorId);
          if (found) setMentor(found);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMentor();
  }, [mentorId]);

  const rate = mentor?.rate_per_hour || 0;
  const total = (rate * duration) / 60;
  const fee = total * 0.05;
  const finalTotal = total;

  const handleBook = () => {
    if (!selectedCourse || !selectedDate || !selectedTime) {
      setError("Please select course, date, and time.");
      return;
    }
    alert(`Booking placed for ${selectedDate} at ${selectedTime}!`);
    router.push("/mentee/sessions");
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!mentor) return <div className="text-center py-5">Mentor not found.</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4><i className="bi bi-calendar-plus"></i> Book a Session</h4>
          <p className="text-muted">Choose a time inside your mentor's weekly availability.</p>
        </div>
        <Link href="/mentee/search" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left"></i> Back to Search
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header text-white" style={{ background: "linear-gradient(135deg, #0d6efd, #0a58ca)" }}>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-3" style={{ width: 80, height: 80, fontSize: "2rem", fontWeight: 700 }}>
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <h5 className="mb-0">{mentor.name}</h5>
                  <small className="opacity-75"><i className="bi bi-book"></i> {mentor.programme}</small>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-2 mb-3 text-center">
                <div className="col-4">
                  <div className="bg-light rounded p-2">
                    <div className="fw-bold">{mentor.completed_sessions || 0}</div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>Sessions</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-light rounded p-2">
                    <div className="fw-bold">{mentor.total_reviews || 0}</div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>Reviews</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-light rounded p-2">
                    <div className="fw-bold text-primary">K{mentor.rate_per_hour}</div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>/hour</div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="text-muted small fw-bold">Course Offered</label>
                <div className="mt-1">
                  <span className="badge bg-primary fs-6">{mentor.course_code}</span>
                  <span className="text-muted ms-2 small">{mentor.course_name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h6 className="mb-0"><i className="bi bi-calendar"></i> Schedule Your Session</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">1. Select Course *</label>
                <div>
                  <button
                    className={`badge me-1 fs-6 border-0 ${selectedCourse === mentor.course_code ? 'bg-primary' : 'bg-light text-dark'}`}
                    onClick={() => setSelectedCourse(mentor.course_code)}
                  >
                    {mentor.course_code}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">2. Select Date *</label>
                <div className="d-flex gap-2 overflow-auto pb-2">
                  {availableDates.map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0];
                    return (
                      <button
                        key={i}
                        className={`btn border text-center flex-shrink-0 ${selectedDate === dateStr ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ minWidth: 70 }}
                        onClick={() => setSelectedDate(dateStr)}
                      >
                        <small className="d-block text-uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</small>
                        <span className="fs-5 fw-bold d-block">{date.getDate()}</span>
                        <small className="d-block">{date.toLocaleDateString('en-US', { month: 'short' })}</small>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">3. Select Time *</label>
                <div className="row g-2">
                  {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map((time) => (
                    <div key={time} className="col-4">
                      <button
                        className={`btn w-100 ${selectedTime === time ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">4. Duration</label>
                <div className="d-flex gap-2">
                  {durationOptions.map((d) => (
                    <button
                      key={d}
                      className={`btn ${duration === d ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setDuration(d)}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-light rounded p-3 mb-3">
                <h6 className="mb-2"><i className="bi bi-calculator"></i> Payment Summary</h6>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Mentor Rate</span>
                  <span className="fw-bold">K{mentor.rate_per_hour}/hr</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Duration</span>
                  <span className="fw-bold">{duration} min</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Service Fee (5%)</span>
                  <span className="text-muted">K{fee.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total Amount</span>
                  <span className="fw-bold text-primary fs-5">K{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleBook} className="btn btn-success w-100 mb-2">
                <i className="bi bi-credit-card"></i> Proceed to Payment
              </button>
              <Link href="/mentee/search" className="btn btn-secondary w-100">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenteeBook() {
  return (
    <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
      <BookForm />
    </Suspense>
  );
}