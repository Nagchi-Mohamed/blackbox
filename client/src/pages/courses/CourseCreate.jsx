import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Steps,
  Form,
  Input,
  Select,
  Button,
  Card,
  Upload,
  message,
  Space
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { courseService } from '../../services/courseService';
import './CourseCreate.less';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const CourseCreate = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: 'Basic Information',
      content: (
        <>
          <Form.Item
            name="title"
            label="Course Title"
            rules={[{ required: true, message: 'Please input course title!' }]}
          >
            <Input placeholder="Enter course title" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select placeholder="Select category">
              <Option value="mathematics">Mathematics</Option>
              <Option value="science">Science</Option>
              <Option value="language">Language</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: 'Please select level!' }]}
          >
            <Select placeholder="Select level">
              <Option value="beginner">Beginner</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="advanced">Advanced</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>
        </>
      )
    },
    {
      title: 'Course Content',
      content: (
        <Form.List name="lessons">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'title']}
                    rules={[{ required: true, message: 'Missing lesson title' }]}
                  >
                    <Input placeholder="Lesson Title" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    rules={[{ required: true, message: 'Missing lesson description' }]}
                  >
                    <TextArea placeholder="Lesson Description" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Lesson
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      )
    },
    {
      title: 'Media & Resources',
      content: (
        <>
          <Form.Item
            name="thumbnail"
            label="Course Thumbnail"
            rules={[{ required: true, message: 'Please upload thumbnail!' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            name="resources"
            label="Additional Resources"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Upload Resources</Button>
            </Upload>
          </Form.Item>
        </>
      )
    }
  ];

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await courseService.createCourse(values);
      message.success('Course created successfully');
      navigate('/courses');
    } catch (error) {
      message.error(error.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="course-create">
      <Card>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={prev}>
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Course
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CourseCreate; 