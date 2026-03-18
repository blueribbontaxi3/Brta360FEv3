import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, message, Space } from 'antd';
import { UserOutlined, TeamOutlined, ShopOutlined } from '@ant-design/icons';
import axiosService from 'utils/axiosInceptor';

const { Title, Text } = Typography;

const SelectRole: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSelect = async (role: string) => {
    // prevent re-clicks while request is in progress
    if (loading) return;

    setSelectedRole(role);
    setLoading(true);

    try {
      const response = await axiosService.post('auth/user/role', { role });
      if (response?.data?.status === 1) {
        message.success('Role selected successfully!');
        window.location.href = '/dashboard';
      } else {
        message.error('Something went wrong!');
      }
    } catch (error: any) {
      message.error('Unable to save your selection!');
      console.error("Error saving role:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    {
      key: 'member',
      title: 'Member',
      description:
        'Register as a member to manage your taxi, medallion, or insurance records easily within the BlueRibbon system.',
      icon: <UserOutlined style={{ fontSize: 40, color: '#1677ff' }} />,
    },
    {
      key: 'partner',
      title: 'Partner',
      description:
        'Join as a partner to collaborate with BlueRibbon for fleet, medallion, or insurance services in Chicago.',
      icon: <TeamOutlined style={{ fontSize: 40, color: '#52c41a' }} />,
    },
    {
      key: 'vendor',
      title: 'Vendor',
      description:
        'Register as a vendor to offer insurance, vehicle maintenance, or medallion-related services to BlueRibbon members.',
      icon: <ShopOutlined style={{ fontSize: 40, color: '#faad14' }} />,
    },
  ];

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f7fa',
      }}
    >
      <Card
        style={{
          width: '90%',
          maxWidth: 800,
          borderRadius: 12,
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          background: '#fff',
          padding: '20px 10px',
        }}
      >
        <Title level={3} style={{ marginBottom: 30 }}>
          Choose Your Account Type
        </Title>

        <Row gutter={[16, 16]} justify="center">
          {roleCards.map((role) => (
            <Col xs={24} sm={12} md={8} key={role.key}>
              <Card
                hoverable={!loading}
                onClick={() => handleSelect(role.key)}
                loading={loading && selectedRole === role.key}
                style={{
                  borderRadius: 10,
                  border:
                    selectedRole === role.key
                      ? '2px solid #1677ff'
                      : '1px solid #f0f0f0',
                  opacity: loading && selectedRole !== role.key ? 0.5 : 1,
                  pointerEvents:
                    loading && selectedRole !== role.key ? 'none' : 'auto',
                  transition: 'all 0.3s ease',
                }}
              >
                <Space
                  direction="vertical"
                  align="center"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  {role.icon}
                  <Text strong style={{ fontSize: 16 }}>
                    {role.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {role.description}
                  </Text>
                  <Button
                    type={selectedRole === role.key ? 'primary' : 'default'}
                    block
                    loading={loading && selectedRole === role.key}
                    disabled={loading && selectedRole !== role.key}
                  >
                    {selectedRole === role.key ? 'Selected' : 'Select'}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default SelectRole;
