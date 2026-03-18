import React from 'react';
import { Card, Row, Col } from 'antd';
import { SelectField, InputField, DateField } from '@atoms/FormElement';
import { SafetyOutlined, UpCircleFilled } from '@ant-design/icons';

interface PolicyDetailsProps {
    control: any;
    errors: any;
    disabled?: boolean;
}

export const PolicyDetails: React.FC<PolicyDetailsProps> = ({
    control,
    errors,
    disabled = false
}) => {
    return (
        <Card
            size="small"
            title={
                <span className="flex items-center">
                    <SafetyOutlined className="mr-2" size={16} />
                    Policy Details
                </span>
            }
            className="mb-4"
        >
            <Row gutter={[8, 8]}>
                <Col span={8}>
                    <InputField
                        label="Liability"
                        fieldName="policyNumberLiability"
                        control={control}
                        iProps={{
                            placeholder: "Enter Policy Number",
                            disabled
                        }}
                        errors={errors}
                    />
                </Col>
                
                <Col span={8}>
                    <InputField
                        label="Workman Comp"
                        fieldName="policyNumberWorkmanComp"
                        control={control}
                        iProps={{
                            placeholder: "Enter Policy Number",
                            disabled
                        }}
                        errors={errors}
                    />
                </Col>
                <Col span={8}>
                    <InputField
                        label="Collision"
                        fieldName="policyNumberCollision"
                        control={control}
                        iProps={{
                            placeholder: "Enter Policy Number",
                            disabled
                        }}
                        errors={errors}
                    />
                </Col>
            </Row>
        </Card>
    );
};