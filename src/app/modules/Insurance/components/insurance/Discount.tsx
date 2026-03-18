import React from 'react';
import { Card, Descriptions, Button, Space, Typography, Badge, Avatar } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { usdFormat } from 'utils/helper';



export const DiscountInfo: React.FC<any> = ({ data, onViewPrices }) => {
    const corporation = data?.corporation || {};

    return (
        <Card
            size="small"
            title={
                <Typography.Text>
                    <BankOutlined className="mr-2" />
                    Discount Details
                </Typography.Text>
            }
        >
            <Descriptions column={1} size="small" >
                <Descriptions.Item label="Name">
                    {corporation?.discount?.name || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Price">
                    {usdFormat(corporation?.discount?.amount) || '-'}
                </Descriptions.Item>
            </Descriptions>
        </Card >
    );
};