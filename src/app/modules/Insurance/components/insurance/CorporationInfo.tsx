import React from 'react';
import { Card, Descriptions, Button, Space, Typography, Badge, Avatar } from 'antd';
import { BankOutlined } from '@ant-design/icons';

interface CorporationInfoProps {
  data: any;
  onViewPrices?: () => void;
}

export const CorporationInfo: React.FC<CorporationInfoProps> = ({ data, onViewPrices }: any) => {
  const corporation = data;

  return (
    <Card
      size="small"
      title={
        <Typography.Text>
          <BankOutlined className="mr-2" />
          Corporation Details
        </Typography.Text>
      }
    // extra={
    //   <>
    //     {
    //       corporation?.affiliation?.name && (
    //         <Button
    //           type="primary"
    //           size="small"
    //           onClick={onViewPrices}
    //         >
    //           View Prices
    //         </Button>
    //       )
    //     }
    //   </>
    // }
    >
      <Descriptions column={1} size="small" >
        <Descriptions.Item label="Corporation Name">
          {corporation?.corporationName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Affiliation">
          <Space>
            <span>{corporation?.affiliation?.name || '-'}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Total Medallions">
          <Avatar size={'small'} style={{ backgroundColor: '#d6f2c8', color: '#52c41a' }}> {corporation?.medallionsCount || '-'}</Avatar>
        </Descriptions.Item>
      </Descriptions>
    </Card >
  );
};