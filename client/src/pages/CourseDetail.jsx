import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Divider } from 'antd';
import api from '../api';
import EnrollButton from '../components/courses/EnrollButton';

const { Title, Paragraph } = Typography;

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: courseData }, { data: enrollmentData }] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get('/enrollments')
        ]);

        setCourse(courseData.data);
        setIsEnrolled(enrollmentData.data.some(e => e.course_id === parseInt(courseId)));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [courseId]);

  const handleEnrollSuccess = () => {
    setIsEnrolled(true);
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className="course-detail">
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Title level={2}>{course.title}</Title>
          <Paragraph>{course.description}</Paragraph>
          <Divider />
          {/* Course content would go here */}
        </Col>
        <Col span={8}>
          <Card title="Course Actions">
            <EnrollButton 
              courseId={courseId}
              isEnrolled={isEnrolled}
              onEnrollSuccess={handleEnrollSuccess}
            />
            {isEnrolled && (
              <div style={{ marginTop: 16 }}>
                <p>You're enrolled in this course!</p>
                {/* Progress tracker could go here */}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CourseDetail; 