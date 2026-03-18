import React from 'react';
import { Form, Input, Button, Typography, Space, Row, Col, Avatar, Select, DatePicker } from 'antd';
import { IdcardOutlined, CalendarOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { personalInfoSchema } from '../validation/schemas';
import { StepProps } from '../types/formTypes';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const PersonalInfoStep: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: {
      socialNumber: data.socialNumber || '',
      dateOfBirth: data.dateOfBirth || '',
      gender: data.gender || '',
    },
  });

  const onSubmit = (formData: any) => {
    onNext(formData);
  };

  return (
    <Row gutter={[32, 32]} align="middle">
      <Col span={12}>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <Avatar size={120} style={{ backgroundColor: '#f0f0f0', color: '#999' }}>
            <IdcardOutlined style={{ fontSize: 60 }} />
          </Avatar>
          <Title level={2}>test, and how about..</Title>
          <Space>
            <Space align="center">
              <span style={{
                width: 12,
                height: 12,
                backgroundColor: '#ff4d4f',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              <Text>Required Field</Text>
            </Space>
            <Space align="center">
              <span style={{
                width: 12,
                height: 12,
                backgroundColor: '#1890ff',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              <Text>Optional Field</Text>
            </Space>
          </Space>
        </Space>
      </Col>

      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            validateStatus={errors.socialNumber ? 'error' : ''}
            help={errors.socialNumber?.message}
          >
            <Controller
              name="socialNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Social Number"
                  defaultValue="***-**-3123"
                  size="large"
                  suffix={
                    <span style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#52c41a',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }} />
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.dateOfBirth ? 'error' : ''}
            help={errors.dateOfBirth?.message}
          >
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }: any) => (
                <DatePicker
                  {...field}
                  placeholder="Date of Birth"
                  size="large"
                  style={{ width: '100%' }}
                  defaultValue={dayjs('2002-04-07')}
                  suffixIcon={
                    <Space>
                      <CalendarOutlined />
                      <span style={{
                        width: 12,
                        height: 12,
                        backgroundColor: '#52c41a',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }} />
                    </Space>
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.gender ? 'error' : ''}
            help={errors.gender?.message}
          >
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Gender"
                  size="large"
                  defaultValue="Male"
                  suffixIcon={
                    <span style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#52c41a',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }} />
                  }
                >
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%' }}>
              <Button
                onClick={onBack}
                size="large"
                variant='solid'
                color='danger'
              >
                BACK
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                variant='solid'
                color='green'
              >
                NEXT
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default PersonalInfoStep;