"use client";
import { useEffect, useState } from "react";

export default function MentorRates() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState("");
  const [rate, setRate] = useState("");
  const [saving, setSaving] = useState(false);

  const loadRates = () => {
    setLoading(true);
    fetch("/api/mentor/rates")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/mentor/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_code: course, rate_per_hour: parseFloat(rate) }),
      });

      if (res.ok) {
        setCourse("");
        setRate("");
        loadRates();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Failed to save rate");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this rate?")) return;
    await fetch(`/api/mentor/rates?id=${id}`, { method: "DELETE" });
    loadRates();
  };

  return (
    <div className="container-fluid mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-currency-dollar"></i> My Rates</h3>
        <p className="text-muted">Set your hourly rate for each course you mentor.</p>
      </div>

      <div className="row g-4">
        {/* Add Rate Form */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h5 className="mb-0">Add / Update Rate</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label className="form-label">Course Code (e.g. CSC101)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={course}
                    onChange={(e) => setCourse(e.target.value.toUpperCase())}
                    required 
                    placeholder="CSC101"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rate per Hour (K)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    required 
                    placeholder="100.00"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                  {saving ? "Saving..." : "Save Rate"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Current Rates Table */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h5 className="mb-0">Current Rates</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <p className="text-center py-4 text-muted">Loading rates...</p>
              ) : rates.length === 0 ? (
                <p className="text-center py-4 text-muted">No rates set yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Course</th>
                        <th>Rate/Hour</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rates.map((r: any) => (
                        <tr key={r.id}>
                          <td className="fw-bold">{r.course_code}</td>
                          <td>K{Number(r.rate_per_hour).toFixed(2)}</td>
                          <td className="text-end">
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(r.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}