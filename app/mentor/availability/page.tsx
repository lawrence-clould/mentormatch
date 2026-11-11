"use client";
import { useEffect, useState } from "react";

export default function MentorAvailability() {
  const [slots, setSlots] = useState<any[]>([]);
  const [day, setDay] = useState("1");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const loadSlots = () => fetch("/api/mentor/availability").then(r => r.json()).then(setSlots);

  useEffect(() => { loadSlots(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/mentor/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day_of_week: parseInt(day), start_time: start, end_time: end }),
    });
    loadSlots();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this slot?")) return;
    await fetch(`/api/mentor/availability?id=${id}`, { method: "DELETE" });
    loadSlots();
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div>
      <h4 className="mb-4">My Availability</h4>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white"><h6 className="mb-0">Add Slot</h6></div>
            <div className="card-body">
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label className="form-label">Day</label>
                  <select className="form-select" value={day} onChange={e => setDay(e.target.value)}>
                    {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label">Start</label>
                    <input type="time" className="form-control" value={start} onChange={e => setStart(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label">End</label>
                    <input type="time" className="form-control" value={end} onChange={e => setEnd(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Add Slot</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white"><h6 className="mb-0">Current Availability</h6></div>
            <ul className="list-group list-group-flush">
              {slots.length === 0 && <li className="list-group-item text-muted">No slots added yet.</li>}
              {slots.map(s => (
                <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div><strong>{days[s.day_of_week]}</strong>: {s.start_time.slice(0,5)} - {s.end_time.slice(0,5)}</div>
                  <button onClick={() => handleDelete(s.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}