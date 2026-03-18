import React from 'react';
import { Form, Input, Button, Typography, Space, Row, Col, Avatar } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactSchema } from '../validation/schemas';
import { StepProps } from '../types/formTypes';
import { InputField } from '@atoms/FormElement';

const { Title, Text } = Typography;

const ContactStep: React.FC<StepProps> = ({ data, onNext, onBack, isLastStep }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      cellPhone: data.cellPhone || '',
      homePhone: data.homePhone || '',
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
            <PhoneOutlined style={{ fontSize: 60 }} />
          </Avatar>
          <Title level={2}>test, best way for us to reach you?</Title>
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
          <Form.Item>
            <InputField
              label="Cell Phone"
              fieldName="cellPhone"
              control={control}
              iProps={{
                placeholder: "Cell Phone (Required)",
                size: "large",
                suffix: (
                  <span style={{
                    width: 12,
                    height: 12,
                    backgroundColor: '#ff4d4f',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }} />
                ),
              }}
              errors={errors}
            />
          </Form.Item>

          <Form.Item>
            <InputField
              label="Home Phone"
              fieldName="homePhone"
              control={control}
              iProps={{
                placeholder: "Home Phone (Optional)",
                size: "large",
                suffix: (
                  <span style={{
                    width: 12,
                    height: 12,
                    backgroundColor: '#1890ff',
                    borderRadius: '50%',
                    display: 'inline-block'
                  }} />
                ),
              }}
              errors={errors}
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
              >
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ContactStep;