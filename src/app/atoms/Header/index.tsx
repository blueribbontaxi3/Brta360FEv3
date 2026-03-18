import React, { useEffect, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Badge, notification, Col, Dropdown, Layout, List, Menu, Popover, Row, Space, theme, Typography, Button } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Image from '../Image';
import { isPermission } from '../../../utils/helper';
import { useNotifications } from 'hooks/useNotifications';
import NotificationBell from '@molecules/NotificationBell';
import AiAgentDrawer from '../../modules/AiAgent/AiAgentDrawer';

const { Header } = Layout;
const { Text } = Typography;


const BaseHeader = (props: any) => {
  const { children }: any = props;
  const [collapsed, setCollapsed] = useState(false);
  const [newNotification, setNewNotification] = useState(false);
  const [visible, setVisible] = useState(false);
  const [aiAgentOpen, setAiAgentOpen] = useState(false);

  const auth: any = useSelector(
    (state: any) => state?.user_login?.auth_user?.data
  );
  const navigate = useNavigate();
  const { notifications, unreadCount, setUnreadCount, setNotifications } = useNotifications(auth?.user?.id);


  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );

  // useEffect(() => {


  // }, [auth?.user?.id]);

  const items: any = [
    {
      key: '1',
      label: (
        <Link to="/profile">
          Profile
        </Link>
      ),
      icon: <UserOutlined />,
      permission: isPermission(authPermission, 'Profile Update')
    },
    {
      key: '4',
      danger: true,
      label: (
        <a rel="noopener noreferrer" href="/" onClick={() => {
          localStorage.removeItem('brta360_admin');
          window.location.href = '/login'
        }}>
          Logout
        </a>
      ),
      icon: <LogoutOutlined />,
      permission: true
    },
  ].filter(item => item.permission);


  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const handleVisibleChange = (visible: any) => {
    setVisible(visible);
    if (visible) {
      setNewNotification(false);
    }
  };
  const profileIcon = () => {
    const icon: any = auth?.media?.[0]?.url ? <Image src={auth?.media?.[0]?.url} /> : <UserOutlined />
    return icon;
  }

  // const content = (
  //   <div style={{ width: 350 }}>
  //     <List
  //       itemLayout="horizontal"
  //       dataSource={notifications}
  //       renderItem={(item: any) => (
  //         <List.Item >
  //           <List.Item.Meta
  //             title={item.message}
  //           />
  //         </List.Item>
  //       )}
  //     />
  //   </div>
  // );


  return (
    <>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Row justify={'space-between'} align="middle">
          <Col>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)} // Go back to the previous page
              style={{ marginRight: '10px' }}
            >
              Back
            </Button>

          </Col>
          <Col style={{
            marginRight: 30,
            marginLeft: 'auto'
          }}>
            <Space size={20} align="center">
              {/* <Button
                type="text"
                icon={<RobotOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                onClick={() => setAiAgentOpen(true)}
                title="Ask AI Agent"
              /> */}
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
                setUnreadCount={setUnreadCount}
              />
            </Space>
          </Col>
          <Col >
            <Space size={12}>
              <Dropdown menu={{ items }} trigger={['click']}>
                <Space>
                  <Avatar size={24} icon={profileIcon()} />
                  <Text>
                    {auth?.name}
                  </Text>
                </Space>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </Header>
      <AiAgentDrawer open={aiAgentOpen} onClose={() => setAiAgentOpen(false)} />
    </>
  );
};

export default BaseHeader;
