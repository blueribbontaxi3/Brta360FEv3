// OtpVerificationPage.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axiosService from "utils/axiosInceptor";
import type { GetProps } from 'antd';

type OTPProps = GetProps<typeof Input.OTP>;

const { Title, Text } = Typography;

const OtpVerificationPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        if (!token) {
            message.error('Invalid verification link');
            navigate('/register');
        }
    }, [token, navigate]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await axiosService.post('/auth/verify-otp', {
                token,
                otp: values.otp
            },
            );

            const data = await response.data?.data;
            console.log("OTP Verification Response:", data);
            if (data) {
                message.success('Email verified successfully!');
                // Store token and redirect to dashboard
                localStorage.setItem("brta360_admin", data.accessToken);
                localStorage.setItem("brta360_user", JSON.stringify(data.user));
                window.location.href = "/dashboard";
            } else {
                message.error(data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            message.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        try {
            const response = await axiosService.post('/auth/resend-otp', {
                token
            },
            );
            const data = await response.data;
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

    const onChange: OTPProps['onChange'] = (text: any) => {
        console.log('onChange:', text);
    };

    const onInput: OTPProps['onInput'] = (value: any) => {
        console.log('onInput:', value);
    };

    const sharedProps: OTPProps = {
        onChange,
        onInput,
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
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <SafetyOutlined style={{ fontSize: 56, color: '#1890ff', marginBottom: 20 }} />
                        <Title level={2}>Verify Your Email</Title>
                        <Text type="secondary">
                            We've sent a 6-digit OTP to your email address
                        </Text>
                    </div>

                    <Form
                        form={form}
                        name="otp_verification"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="otp"
                            rules={[
                                { required: true, message: 'Please enter OTP' },
                                { len: 6, message: 'OTP must be 6 digits' },
                                { pattern: /^\d+$/, message: 'OTP must contain only numbers' },
                            ]}
                        >
                            <Input.OTP formatter={(str) => str.toUpperCase()} {...sharedProps} />

                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                style={{ height: 45 }}
                            >
                                Verify OTP
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary">Didn't receive the code? </Text>
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

export default OtpVerificationPage;