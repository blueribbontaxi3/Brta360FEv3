import React, { useState } from 'react';
import { Badge, Dropdown, List, Avatar, Typography, Empty, Divider } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link, useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);
const { Text } = Typography;

interface Props {
  notifications: any[];
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const NotificationBell: React.FC<Props> = ({
  notifications = [],
  unreadCount,
  setUnreadCount,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
    if (flag) setUnreadCount(0); // reset unread when dropdown opens
  };
  const menu = (
    <div
      style={{
        width: 340,
        maxHeight: 420,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          fontWeight: 600,
          fontSize: 15,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        Notifications
      </div>
      {notifications.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          style={{ maxHeight: 360, overflowY: 'auto' }}
          renderItem={(item) => {
            const isTicket = item?.data?.ticketId;

            return (
              <List.Item
                style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid #f5f5f5',
                  backgroundColor: item.read ? '#fff' : '#f9fbff',
                  cursor: isTicket ? 'pointer' : 'default',
                  transition: 'background 0.2s ease',
                }}
                onClick={() => {
                  if (isTicket) {
                    navigate(`/ticket/edit/${item?.data?.ticketId}?ticketMessageId=${item?.data?.ticketMessageId}`);
                    setOpen(false);
                  }
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#f0f7ff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = item.read ? '#fff' : '#f9fbff';
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: '#1677ff',
                        boxShadow: '0 2px 6px rgba(22,119,255,0.3)',
                      }}
                      icon={<BellOutlined />}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>{item.title || 'Notification'}</Text>
                    </div>
                  }
                  description={<Text type="secondary">{item.message || 'No message'}</Text>}
                />
              </List.Item>
            );
          }}
        />
      ) : (
        <div
          style={{
            padding: '40px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No new notifications</span>}
          />
        </div>
      )}

      <Divider style={{ margin: 0 }} />
      {/* <div
        style={{
          padding: '10px',
          textAlign: 'center',
          background: '#fafafa',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          color: '#1677ff',
        }}
        onClick={() => alert('View all notifications')}
      >
        View all
      </div> */}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => menu}
      placement="bottomRight"
      open={open}
      onOpenChange={handleOpenChange}
      trigger={['click']}
    >
      <Badge
        count={unreadCount}
        overflowCount={99}
        size="small"
        offset={[-2, 4]}
        style={{ boxShadow: '0 0 0 2px #fff' }}
      >
        <BellOutlined style={{ fontSize: 22, cursor: 'pointer', color: '#444' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
