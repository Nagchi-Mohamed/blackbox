import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, message } from 'antd';
import courseService from '../../services/courseService';
import './CourseDetail.less';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(courseId);
        setCourse(data);
      } catch (error) {
        message.error('Failed to fetch course details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-detail">
      <Card title={course.title} loading={loading}>
        <p>{course.description}</p>
        <p>Created by: {course.creator_username}</p>
        <p>Created at: {new Date(course.created_at).toLocaleDateString()}</p>
      </Card>
    </div>
  );
};

export default CourseDetail; 