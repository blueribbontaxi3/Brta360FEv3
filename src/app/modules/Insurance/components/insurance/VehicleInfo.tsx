import React from 'react';
import { Card, Descriptions, Typography } from 'antd';
import { CarOutlined } from '@ant-design/icons';

interface VehicleInfoProps {
  data: any;
}

export const VehicleInfo: React.FC<VehicleInfoProps> = ({ data }) => {
  const vehicle = data || {};
  const isYearMissing = !vehicle?.vehicleYear?.year; // Year agar missing ho to true hoga

  return (
    <Card
      style={{
        backgroundColor: data && isYearMissing ? '#ffccc7' : 'white', // Red light shade for missing year
        borderColor: data && isYearMissing ? 'red' : '#f0f0f0',
      }}
      size="small"
      title={
        <Typography.Text>
          <CarOutlined />
          Vehicle Information
        </Typography.Text>
      }
    >
      <Descriptions column={2} size="small">
        <Descriptions.Item label="VIN Number">
          {vehicle?.vinNumber || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Year">
          {vehicle?.vehicleYear?.year || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          {vehicle?.vehicleType?.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Make & Model">
          {`${vehicle?.vehicleMake?.name || ''} ${vehicle?.vehicleModel?.name || ''}`}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};