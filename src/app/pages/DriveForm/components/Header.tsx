import React from 'react';
import { Layout, Typography, Space, Avatar } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import { PRIMARY_COLOR } from '../../../../configs/env.config';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header: React.FC = () => {
  return (
    <AntHeader style={{
      background: 'linear-gradient(90deg, #cfae00 0%, #cfae00 100%)',
      padding: '0 50px',
      height: 'auto',
      lineHeight: 'normal',
      paddingTop: 20,
      paddingBottom: 20
    }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space size="large">
          <Title level={2} style={{ color: PRIMARY_COLOR, margin: 0 }}>
            EASY APPLY
          </Title>
          <Space>
            <Avatar style={{ backgroundColor: PRIMARY_COLOR }} icon={<CarOutlined />} />
            <Text strong style={{ fontSize: 18, color: '#333' }}>
              5 MINUTE REGISTRATION
            </Text>
          </Space>
        </Space>

        <Space>
          <Avatar size={64} style={{ backgroundColor: PRIMARY_COLOR }} icon={<CarOutlined />} />
          <Space direction="vertical" size={0}>
            <Text strong style={{ color: PRIMARY_COLOR, fontSize: 14 }}>BLUE RIBBON</Text>
            <Text strong style={{ color: PRIMARY_COLOR, fontSize: 14 }}>TAXI</Text>
            <Text style={{ color: PRIMARY_COLOR, fontSize: 12 }}>ASSOCIATION</Text>
          </Space>
        </Space>
      </Space>
    </AntHeader>
  );
};

export default Header;