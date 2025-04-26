import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.less';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await forgotPassword(values.email);
      message.success('Password reset instructions have been sent to your email.');
    } catch (error) {
      message.error(error.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card title="Forgot Password" className="auth-card">
        <Form
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Send Reset Instructions
            </Button>
          </Form.Item>

          <div className="auth-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword; 