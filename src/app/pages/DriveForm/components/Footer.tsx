import React from 'react';
import { Layout, Typography, Space, Avatar } from 'antd';
import { PhoneOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import { PRIMARY_COLOR } from '../../../../configs/env.config';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter style={{
      backgroundColor: PRIMARY_COLOR,
      color: 'white',
      padding: '40px 50px'
    }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>
          BLUE RIBBON TAXI NEW DRIVER REGISTRATION
        </Title>

        <Space size="large">
          <Avatar size={48} style={{ backgroundColor: '#cfae00' }}>
            <PhoneOutlined style={{ color: PRIMARY_COLOR }} />
          </Avatar>
          <Avatar size={48} style={{ backgroundColor: '#cfae00' }}>
            <MailOutlined style={{ color: PRIMARY_COLOR }} />
          </Avatar>
          <Avatar size={48} style={{ backgroundColor: '#cfae00' }}>
            <MessageOutlined style={{ color: PRIMARY_COLOR }} />
          </Avatar>
        </Space>

        <Title level={4} style={{ color: 'white', margin: 0 }}>
          HAVE A QUESTION, WE ARE HERE TO HELP
        </Title>
      </Space>

      <Text style={{ color: 'white', display: 'block', textAlign: 'center', marginTop: 20 }}>
        Copyright Blue Ribbon Taxi Association 1993-2025. All Rights reserved
      </Text>
    </AntFooter>
  );
};

export default Footer;