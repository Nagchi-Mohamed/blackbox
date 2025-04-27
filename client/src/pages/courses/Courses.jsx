import React, { useEffect, useState } from 'react';
import { Card, List, message } from 'antd';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import './Courses.less';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses();
        setCourses(data);
      } catch (error) {
        message.error('Failed to fetch courses: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="courses-page">
      <h1>Available Courses</h1>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={courses}
        loading={loading}
        renderItem={course => (
          <List.Item>
            <Link to={`/courses/${course.id}`}>
              <Card
                title={course.title}
                hoverable
                className="course-card"
              >
                <p>{course.description}</p>
                <p>Created by: {course.creator_username}</p>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Courses; 