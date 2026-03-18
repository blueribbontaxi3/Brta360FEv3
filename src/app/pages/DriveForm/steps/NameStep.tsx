import React from 'react';
import { Form, Button, Typography, Space, Row, Col, Avatar } from 'antd';
import { UserOutlined, XFilled } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { nameSchema } from '../validation/schemas';
import { StepProps } from '../types/formTypes';
import { InputField } from '@atoms/FormElement';

const { Title, Text } = Typography;

const NameStep: React.FC<StepProps> = ({ data, onNext, onBack }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(nameSchema),
    defaultValues: {
      firstName: data.firstName || '',
      middleName: data.middleName || '',
      lastName: data.lastName || '',
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
            <UserOutlined style={{ fontSize: 60 }} />
          </Avatar>
          <Title level={2}>What is your Name?</Title>
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

          <InputField
            label="First Name"
            fieldName="firstName"
            control={control}
            iProps={{
              placeholder: "First Name",
              size: "large",
              suffix: <XFilled style={{ color: '#ff4d4f' }} />,
            }}
            errors={errors}
          />
          <InputField
            label="Middle Name"
            fieldName="middleName"
            control={control}
            iProps={{
              placeholder: "Middle Name",
              size: "large",
              suffix: <XFilled style={{ color: '#1890ff' }} />,
            }}
            errors={errors}
          />

          <InputField
            label="Last Name"
            fieldName="lastName"
            control={control}
            iProps={{
              placeholder: "Last Name",
              size: "large",
              suffix: <XFilled style={{ color: '#ff4d4f' }} />,
            }}
            errors={errors}
          />

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

        </Form>
      </Col>
    </Row>
  );
};

export default NameStep;