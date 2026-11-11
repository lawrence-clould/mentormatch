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

      const data = await res.json();

      if (res.ok) {
        setShowAddModal(false);
        setNewCourse("");
        fetchCourses();
      } else {
        alert(`Error: ${data.error}`); // Show the exact error
      }
    } catch (err: any) {
      alert(`Network Error: ${err.message}`);
    }
  };