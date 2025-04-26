import React, { useState } from 'react';
import { Modal, Form, Input, Button, Space, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import './PollCreator.less';

const PollCreator = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await onCreate(values.question, values.options);
      form.resetFields();
      onCancel();
      message.success('Poll created successfully');
    } catch (error) {
      message.error('Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Poll"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ options: [''] }}
      >
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: 'Please enter the question' }]}
        >
          <Input.TextArea
            placeholder="Enter your poll question"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Form.List
          name="options"
          rules={[
            {
              validator: async (_, options) => {
                if (!options || options.length < 2) {
                  return Promise.reject(new Error('At least 2 options are required'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Form.Item
                  {...restField}
                  name={[name]}
                  label={name === 0 ? 'Options' : ''}
                  rules={[{ required: true, message: 'Please enter an option' }]}
                  key={key}
                >
                  <Space style={{ width: '100%' }} align="baseline">
                    <Input placeholder="Enter option" />
                    {fields.length > 2 && (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    )}
                  </Space>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Option
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Poll
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PollCreator; 