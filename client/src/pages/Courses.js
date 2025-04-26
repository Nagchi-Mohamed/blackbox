import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data);
      } catch (error) {
        toast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="courses-container">
      <h2>Available Courses</h2>
      <div className="course-list">
        {courses.map(course => (
          <div key={course.course_id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <Link 
              to={`/classroom/${course.course_id}`} 
              className="btn btn-primary"
            >
              Enter Classroom
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses; 