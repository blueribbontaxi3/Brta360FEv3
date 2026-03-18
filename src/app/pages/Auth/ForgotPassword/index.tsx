// ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosService from "utils/axiosInceptor";

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axiosService.post('/auth/forgot-password', {
        email: values.email,
      });

      const data = await response.data?.data;
      if (data) {
        message.success('OTP sent to your email!');
        navigate(`/reset-password?token=${data.token}`);
      } else {
        message.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 450, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2}>Forgot Password?</Title>
          <Text type="secondary">
            Enter your email address and we'll send you an OTP to reset your password
          </Text>
        </div>

        <Form
          form={form}
          name="forgot_password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email address"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 45 }}
            >
              Send OTP
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;