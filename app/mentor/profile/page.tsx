"use client";
import { useEffect, useState } from "react";

export default function MentorProfile() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/mentor/profile").then(r => r.json()).then(setData);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/mentor/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    alert("Profile updated!");
  };

  if (!data) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white p-3"><h4 className="mb-0">My Profile</h4></div>
      <div className="card-body">
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" value={data.name || ""} onChange={e => setData({...data, name: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email (Read Only)</label>
            <input type="email" className="form-control" value={data.email || ""} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="text" className="form-control" value={data.phone || ""} onChange={e => setData({...data, phone: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label">Programme</label>
            <input type="text" className="form-control" value={data.programme || ""} onChange={e => setData({...data, programme: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Update Profile"}</button>
        </form>
      </div>
    </div>
  );
}