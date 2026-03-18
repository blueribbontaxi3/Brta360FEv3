import React from 'react';
import { Form, Input, Button, Typography, Space, Row, Col, Avatar } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addressSchema } from '../validation/schemas';
import { StepProps } from '../types/formTypes';

const { Title, Text } = Typography;

const AddressStep: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      streetAddress: data.streetAddress || '',
      unitApt: data.unitApt || '',
      location: data.location || '',
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
            <EnvironmentOutlined style={{ fontSize: 60 }} />
          </Avatar>
          <Title level={2}>test, what is your home address?</Title>
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
            validateStatus={errors.location ? 'error' : ''}
            help={errors.location?.message}
          >
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter a location"
                  size="large"
                  suffix={
                    <span style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#ff4d4f',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }} />
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.streetAddress ? 'error' : ''}
            help={errors.streetAddress?.message}
          >
            <Controller
              name="streetAddress"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Street Address"
                  size="large"
                  suffix={
                    <span style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#ff4d4f',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }} />
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Controller
              name="unitApt"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Unit/Apt (Optional)"
                  size="large"
                  suffix={
                    <span style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#1890ff',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }} />
                  }
                />
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

export default AddressStep;