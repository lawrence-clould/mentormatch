"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/mentee/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4><i className="bi bi-book"></i> My Courses</h4>
          <p className="text-muted">Manage the courses you need help with</p>
        </div>
        <span className="badge bg-primary"><i className="bi bi-cpu"></i> AI Powered</span>
      </div>

      {loading ? (
        <p className="text-center text-muted py-3">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-book display-1 text-muted"></i>
          <h5 className="mt-3">No Courses Added Yet</h5>
          <p className="text-muted">Add courses you need help with to find the right mentors.</p>
          <button className="btn btn-primary">Add Your First Course</button>
        </div>
      ) : (
        <div className="row g-3">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold text-primary fs-5">{course.course_code}</div>
                      <div className="text-muted small">{course.course_name}</div>
                    </div>
                    <span className={`badge bg-${course.status === "active" ? "success" : course.status === "pending" ? "warning" : "danger"}`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="row g-1 mt-3 text-center">
                    <div className="col-6">
                      <div className="bg-light rounded p-2">
                        <div className="fw-bold">{course.sessions_completed || 0}</div>
                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>Sessions</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded p-2">
                        <div className="fw-bold">{course.available_mentors || 0}</div>
                        <div className="text-muted" style={{ fontSize: "0.7rem" }}>Mentors</div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    {course.status === "active" ? (
                      <Link href={`/mentee/search?course=${course.course_code}`} className="btn btn-sm btn-primary flex-grow-1">
                        <i className="bi bi-search"></i> Find Mentors
                      </Link>
                    ) : (
                      <span className="text-muted small flex-grow-1">
                        {course.status === "pending" ? "Awaiting admin approval" : "Rejected by admin"}
                      </span>
                    )}
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}