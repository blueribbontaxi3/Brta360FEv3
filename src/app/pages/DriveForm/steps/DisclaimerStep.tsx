import React from 'react';
import { Form, Input, Checkbox, Button, Typography, List, Space, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { disclaimerSchema } from '../validation/schemas';
import { StepProps } from '../types/formTypes';

const { Title, Text } = Typography;

const DisclaimerStep: React.FC<StepProps> = ({ data, onNext, isFirstStep }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(disclaimerSchema),
    defaultValues: {
      email: data.email || '',
      disclaimerAccepted: data.disclaimerAccepted || false,
    },
  });

  const onSubmit = (formData: any) => {
    onNext(formData);
  };

  const requirements = [
    'Minimum Driver Age is 23 years.',
    'Must have a valid Social Security Number',
    'Must have a valid U.S. Driver\'s license.',
    'Must have a valid City of Chicago Chauffeur License',
    'Some programs require a year or more of verifiable driving history',
    'Must not have failed a Department of Transportation drug screening in the past two years.'
  ];

  return (
    <Row gutter={[32, 32]}>
      <Col span={12}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2}>Disclaimer</Title>
          <Text>Thank you for your interest in Blue Ribbon Taxi Association.</Text>
          <Text strong>PLEASE READ BEFORE PROCEEDING:</Text>
          <Text strong>You must meet the following requirements to drive:</Text>
          <List
            dataSource={requirements}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <span style={{ 
                    width: 8, 
                    height: 8, 
                    backgroundColor: '#52c41a', 
                    borderRadius: '50%',
                    display: 'inline-block'
                  }} />
                  <Text>{item}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Space>
      </Col>
      
      <Col span={12}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Email Address"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Please enter your email address"
                  size="large"
                />
              )}
            />
          </Form.Item>
          
          <Form.Item
            validateStatus={errors.disclaimerAccepted ? 'error' : ''}
            help={errors.disclaimerAccepted?.message}
          >
            <Controller
              name="disclaimerAccepted"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} checked={field.value}>
                  I have read and accept the disclaimer
                </Checkbox>
              )}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              variant='solid'
              color='green'
              block
            >
              NEXT
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default DisclaimerStep;