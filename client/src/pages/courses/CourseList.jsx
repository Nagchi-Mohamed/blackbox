import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Card, Space, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import './CourseList.less';

const { Search } = Input;
const { Option } = Select;

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    status: 'all'
  });
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [searchText, filters, sortField, sortOrder]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses({
        search: searchText,
        ...filters,
        sortField,
        sortOrder
      });
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (text, record) => (
        <a onClick={() => navigate(`/courses/${record.id}`)}>{text}</a>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Mathematics', value: 'mathematics' },
        { text: 'Science', value: 'science' },
        { text: 'Language', value: 'language' }
      ],
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      filters: [
        { text: 'Beginner', value: 'beginner' },
        { text: 'Intermediate', value: 'intermediate' },
        { text: 'Advanced', value: 'advanced' }
      ],
      render: (level) => <Tag color="green">{level}</Tag>
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Draft', value: 'draft' },
        { text: 'Archived', value: 'archived' }
      ],
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'draft' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="course-list">
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space>
            <Search
              placeholder="Search courses..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={setSearchText}
              style={{ width: 300 }}
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => setFilters({ ...filters, category: value })}
            >
              <Option value="all">All Categories</Option>
              <Option value="mathematics">Mathematics</Option>
              <Option value="science">Science</Option>
              <Option value="language">Language</Option>
            </Select>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={(value) => setFilters({ ...filters, level: value })}
            >
              <Option value="all">All Levels</Option>
              <Option value="beginner">Beginner</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="advanced">Advanced</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/courses/create')}
            >
              Create Course
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={courses}
            rowKey="id"
            loading={loading}
            onChange={handleTableChange}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} courses`
            }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default CourseList; 