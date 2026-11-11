"use client";
import { useEffect, useState } from "react";

export default function MentorRates() {
  const [rates, setRates] = useState<any[]>([]);
  const [course, setCourse] = useState("");
  const [rate, setRate] = useState("");

  const loadRates = () => fetch("/api/mentor/rates").then(r => r.json()).then(setRates);

  useEffect(() => { loadRates(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/mentor/rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_code: course, rate_per_hour: parseFloat(rate) }),
    });
    setCourse(""); setRate("");
    loadRates();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this rate?")) return;
    await fetch(`/api/mentor/rates?id=${id}`, { method: "DELETE" });
    loadRates();
  };

  return (
    <div>
      <h4 className="mb-4">My Rates</h4>
      <div className="row g-4">
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white"><h6 className="mb-0">Add / Update Rate</h6></div>
            <div className="card-body">
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label className="form-label">Course Code (e.g. CSC101)</label>
                  <input type="text" className="form-control" value={course} onChange={e => setCourse(e.target.value.toUpperCase())} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rate per Hour (K)</label>
                  <input type="number" step="0.01" className="form-control" value={rate} onChange={e => setRate(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Save Rate</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white"><h6 className="mb-0">Current Rates</h6></div>
            <ul className="list-group list-group-flush">
              {rates.length === 0 && <li className="list-group-item text-muted">No rates set yet.</li>}
              {rates.map(r => (
                <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div><strong>{r.course_code}</strong> - K{Number(r.rate_per_hour).toFixed(2)}/hr</div>
                  <button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}