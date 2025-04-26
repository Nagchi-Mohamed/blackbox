import React, { useState, useEffect } from 'react';
import { Card, List, Button, Input, Space, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../../services/courseService';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      message.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchText.toLowerCase()) ||
    course.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space>
          <Input
            placeholder="Search courses"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/courses/create')}
          >
            Create Course
          </Button>
        </Space>

        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={filteredCourses}
          loading={loading}
          renderItem={course => (
            <List.Item>
              <Card
                hoverable
                title={course.title}
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <p>{course.description}</p>
                <p>Created by: {course.creator_username}</p>
              </Card>
            </List.Item>
          )}
        />
      </Space>
    </div>
  );
};

export default Courses; 