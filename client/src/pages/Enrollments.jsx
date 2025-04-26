import React, { useEffect, useState } from 'react';
import { Table, Space, Progress, Typography } from 'antd';
import api from '../api';
import EnrollmentStatus from '../components/courses/EnrollmentStatus';

const { Title } = Typography;

const columns = [
  {
    title: 'Course',
    dataIndex: 'course_title',
    key: 'course_title'
  },
  {
    title: 'Instructor',
    dataIndex: 'instructor_name',
    key: 'instructor_name'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <EnrollmentStatus status={status} />
  },
  {
    title: 'Progress',
    dataIndex: 'progress_percentage',
    key: 'progress',
    render: (percent) => (
      <Progress percent={percent} status="active" />
    )
  },
  {
    title: 'Last Accessed',
    dataIndex: 'last_accessed_at',
    key: 'last_accessed',
    render: (date) => new Date(date).toLocaleDateString()
  }
];

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await api.get('/enrollments');
        setEnrollments(data.data);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div className="enrollments-container">
      <Title level={2}>My Enrollments</Title>
      <Table 
        columns={columns}
        dataSource={enrollments}
        rowKey="enrollment_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Enrollments; 