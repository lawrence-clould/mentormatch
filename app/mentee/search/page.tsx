"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeSearch() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchMentors() {
      try {
        const res = await fetch("/api/mentee/search");
        if (res.ok) {
          const data = await res.json();
          setMentors(data);
        }
      } catch (error) {
        console.error("Failed to load mentors", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((m) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.course_code?.toLowerCase().includes(q) ||
      m.course_name?.toLowerCase().includes(q) ||
      m.programme?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Search Header */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: "linear-gradient(135deg, #0d6efd, #0a58ca)", color: "white" }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3><i className="bi bi-robot"></i> AI-Powered Search</h3>
              <p className="mb-0">Connect with the perfect mentor using our intelligent search</p>
            </div>
            <span className="badge bg-light text-primary"><i className="bi bi-cpu"></i> AI Enabled</span>
          </div>

          <div className="mt-3 position-relative">
            <i className="bi bi-search position-absolute" style={{ left: 16, top: "50%", transform: "translateY(-50%)", color: "#6c757d" }}></i>
            <input
              type="text"
              className="form-control"
              placeholder="Search a course code or name, e.g. CSC101 or Database Systems"
              style={{ paddingLeft: 45, height: 55, borderRadius: 12, border: "none" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>{filteredMentors.length}</strong> mentor(s) found
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <p className="text-muted">Loading mentors...</p>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-robot display-1 text-muted"></i>
          <h5 className="mt-3">No mentors found</h5>
          <p className="text-muted">AI couldn't find mentors matching your search criteria.</p>
          <button className="btn btn-primary mt-2" onClick={() => setSearchTerm("")}>Clear Search</button>
        </div>
      ) : (
        <div className="row g-3">
          {filteredMentors.map((mentor) => (
            <div key={`${mentor.id}-${mentor.course_code}`} className="col-xl-4 col-lg-6 col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: 60, height: 60, fontSize: "1.5rem", fontWeight: 700, flexShrink: 0 }}>
                      {mentor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{mentor.name}</h6>
                      <span className="badge bg-secondary">{mentor.programme || "Student"}</span>
                      {mentor.year_of_study && (
                        <span className="badge bg-light text-dark ms-1">Year {mentor.year_of_study}</span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="d-flex align-items-center gap-2 mb-2">
                    {mentor.avg_rating ? (
                      <>
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bi bi-star-fill ${i < Math.round(mentor.avg_rating) ? "" : "opacity-25"}`}></i>
                          ))}
                        </div>
                        <small className="text-muted">{Number(mentor.avg_rating).toFixed(1)}</small>
                        <small className="text-muted">({mentor.total_reviews || 0} reviews)</small>
                      </>
                    ) : (
                      <span className="text-muted small">No reviews yet</span>
                    )}
                  </div>

                  {/* Course */}
                  <div className="mb-2">
                    <span className="badge bg-primary">
                      <i className="bi bi-book me-1"></i> {mentor.course_code}
                    </span>
                    <span className="d-block text-muted small mt-1">{mentor.course_name}</span>
                  </div>

                  {/* Stats */}
                  <div className="row g-1 mb-3 text-center">
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

                  {/* Action */}
                  <Link
                    href={`/mentee/book?mentor_id=${mentor.id}&course=${mentor.course_code}`}
                    className="btn btn-primary w-100"
                  >
                    <i className="bi bi-calendar-plus me-1"></i> Book Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}