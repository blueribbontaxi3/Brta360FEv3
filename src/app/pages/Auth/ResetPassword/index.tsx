// ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosService from "utils/axiosInceptor";

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      message.error('Invalid reset link');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axiosService.post('/auth/reset-password', {
        email: token,
        otp: values.otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      const data = await response.data?.data;
      if (data) {
        message.success('Password reset successfully!');
        navigate('/login');
      } else {
        message.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await axiosService.post('/auth/resend-reset-otp', {
        token
      });

      const data = await response.data?.data;
      if (data) {
        message.success('OTP resent successfully!');
      } else {
        message.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      message.error('Something went wrong. Please try again.');
    } finally {
      setResendLoading(false);
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
      <Card style={{ width: 500, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <SafetyOutlined style={{ fontSize: 56, color: '#ff4d4f', marginBottom: 20 }} />
            <Title level={2}>Reset Password</Title>
            <Text type="secondary">
              Enter the OTP sent to your email and create a new password
            </Text>
          </div>

          <Form
            form={form}
            name="reset_password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="otp"
              label="Enter OTP"
              rules={[
                { required: true, message: 'Please enter OTP' },
                { len: 6, message: 'OTP must be 6 digits' },
                { pattern: /^\d+$/, message: 'OTP must contain only numbers' },
              ]}
            >
              {/* <Input
                placeholder="000000"
                maxLength={6}
                style={{
                  textAlign: 'center',
                  fontSize: 24,
                  letterSpacing: 10
                }}
              /> */}
              <Input.OTP formatter={(str) => str.toUpperCase()} />

            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
                { max: 20, message: 'Password must be less than 20 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
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
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Didn't receive the OTP? </Text>
            <Button
              type="link"
              onClick={handleResendOtp}
              loading={resendLoading}
              style={{ padding: 0, fontWeight: 600 }}
            >
              Resend OTP
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;