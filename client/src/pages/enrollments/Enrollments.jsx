import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getEnrollments, unenrollFromCourse } from '../../services/enrollmentService';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await getEnrollments();
      setEnrollments(response.data);
    } catch (error) {
      message.error('Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      await unenrollFromCourse(courseId);
      message.success('Successfully unenrolled from course');
      fetchEnrollments();
    } catch (error) {
      message.error('Failed to unenroll from course');
    }
  };

  const columns = [
    {
      title: 'Course Title',
      dataIndex: 'course_title',
      key: 'course_title',
      render: (text, record) => (
        <a onClick={() => navigate(`/courses/${record.course_id}`)}>{text}</a>
      ),
    },
    {
      title: 'Enrolled Date',
      dataIndex: 'enrolled_at',
      key: 'enrolled_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/courses/${record.course_id}`)}
          >
            View Course
          </Button>
          <Button
            danger
            onClick={() => handleUnenroll(record.course_id)}
          >
            Unenroll
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Table
        columns={columns}
        dataSource={enrollments}
        loading={loading}
        rowKey="enrollment_id"
      />
    </div>
  );
};

export default Enrollments; 