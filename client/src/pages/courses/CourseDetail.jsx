import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Tabs,
  List,
  Avatar,
  Tag,
  Space,
  message,
  Modal
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';
import './CourseDetail.less';

const { TabPane } = Tabs;

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseById(id);
      setCourse(data);
      setEnrolled(data.enrolled);
    } catch (error) {
      message.error('Failed to load course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await courseService.enrollInCourse(id);
      setEnrolled(true);
      message.success('Successfully enrolled in the course');
      setShowEnrollModal(false);
    } catch (error) {
      message.error(error.message || 'Failed to enroll in the course');
    }
  };

  const renderCourseInfo = () => (
    <Descriptions bordered>
      <Descriptions.Item label="Category" span={3}>
        <Tag color="blue">{course.category}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Level" span={3}>
        <Tag color="green">{course.level}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Duration" span={3}>
        <ClockCircleOutlined /> {course.duration} hours
      </Descriptions.Item>
      <Descriptions.Item label="Instructor" span={3}>
        <Space>
          <Avatar icon={<UserOutlined />} />
          {course.instructor.name}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label="Description" span={3}>
        {course.description}
      </Descriptions.Item>
    </Descriptions>
  );

  const renderLessons = () => (
    <List
      itemLayout="horizontal"
      dataSource={course.lessons}
      renderItem={(lesson) => (
        <List.Item
          actions={[
            <Button
              type="link"
              onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}`)}
            >
              View Lesson
            </Button>
          ]}
        >
          <List.Item.Meta
            avatar={<BookOutlined />}
            title={lesson.title}
            description={lesson.description}
          />
        </List.Item>
      )}
    />
  );

  const renderStudents = () => (
    <List
      itemLayout="horizontal"
      dataSource={course.students}
      renderItem={(student) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={student.name}
            description={`Joined ${new Date(student.enrolledAt).toLocaleDateString()}`}
          />
        </List.Item>
      )}
    />
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-detail">
      <Card
        title={course.title}
        extra={
          !enrolled && (
            <Button type="primary" onClick={() => setShowEnrollModal(true)}>
              Enroll Now
            </Button>
          )
        }
      >
        {renderCourseInfo()}

        <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
          <TabPane
            tab={
              <span>
                <BookOutlined />
                Lessons
              </span>
            }
            key="1"
          >
            {renderLessons()}
          </TabPane>
          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Students
              </span>
            }
            key="2"
          >
            {renderStudents()}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Confirm Enrollment"
        visible={showEnrollModal}
        onOk={handleEnroll}
        onCancel={() => setShowEnrollModal(false)}
        okText="Enroll"
        cancelText="Cancel"
      >
        <p>Are you sure you want to enroll in this course?</p>
        <p>You will have access to all course materials and can start learning immediately.</p>
      </Modal>
    </div>
  );
};

export default CourseDetail; 