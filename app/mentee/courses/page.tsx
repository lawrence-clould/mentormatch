"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MenteeCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState("");
  
  const availableCourses = [
    { code: "CSC101", name: "Introduction to Computer Science" },
    { code: "CSC102", name: "Programming Fundamentals" },
    { code: "MAT101", name: "Mathematics for Science" },
    { code: "MAT102", name: "Calculus I" },
    { code: "PHY101", name: "Physics I" },
    { code: "BIO101", name: "Biology I" },
    { code: "ENG101", name: "English Composition" },
    { code: "ACC101", name: "Principles of Accounting" },
    { code: "ECO101", name: "Principles of Economics" }
  ];

  const fetchCourses = () => {
    setLoading(true);
    fetch("/api/mentee/courses")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAdd = async () => {
    if (!newCourse) return alert("Please select a course");
    
    const selected = availableCourses.find(c => c.code === newCourse);
    
    try {
      const res = await fetch("/api/mentee/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          course_code: newCourse, 
          course_name: selected?.name 
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewCourse("");
        fetchCourses();
      } else {
        alert("Failed to add course");
      }
    } catch (err) {
      alert("Error adding course");
    }
  };

  const handleRemove = async (id: number) => {
    if (!confirm("Remove this course?")) return;
    try {
      await fetch(`/api/mentee/courses?id=${id}`, { method: "DELETE" });
      fetchCourses();
    } catch (err) {
      alert("Error removing course");
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3><i className="bi bi-book"></i> My Courses</h3>
          <p className="text-muted">Manage the courses you need help with.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle"></i> Add Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="row g-3">
        {loading ? (
          <div className="col-12 text-center py-5">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="col-12 text-center py-5">
            <i className="bi bi-book display-1 text-muted"></i>
            <h5 className="mt-3">No Courses Added Yet</h5>
            <p className="text-muted">Add courses you need help with to find the right mentors.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              Add Your First Course
            </button>
          </div>
        ) : (
          courses.map((course) => (
            <div className="col-md-4" key={course.id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0 text-primary">{course.course_code}</h5>
                    <span className="badge bg-success">Active</span>
                  </div>
                  <p className="text-muted small mb-3">{course.course_name}</p>
                  <div className="d-flex gap-2">
                    <Link href={`/mentee/search?course=${course.course_code}`} className="btn btn-sm btn-outline-primary flex-grow-1">
                      <i className="bi bi-search"></i> Find Mentors
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(course.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Add a New Course</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Select Course</label>
                <select className="form-select mb-3" value={newCourse} onChange={(e) => setNewCourse(e.target.value)}>
                  <option value="">-- Choose a course --</option>
                  {availableCourses.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAdd}>Add Course</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}