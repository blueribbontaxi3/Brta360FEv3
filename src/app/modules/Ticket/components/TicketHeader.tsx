import React from 'react';
import { Typography, Tag, Space, Divider, Avatar, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface TicketHeaderProps {
    ticketData: any;
    formatDate: (date: string) => string;
    statuses: any[];
    onStatusChange: (status: string) => void;
    onPriorityChange: (priority: string) => void;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ ticketData, formatDate, statuses, onStatusChange, onPriorityChange }) => {
    if (!ticketData) return null;

    const getStatusColor = (status: string) => {
        const foundStatus = statuses.find(s => (s.slug === status || s.id === status));
        return foundStatus?.color || 'default';
    };

    return (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {/* Header & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Space direction="vertical" size={2}>
                    <Space align="center">
                        <Title level={4} style={{ margin: 0 }}>
                            {ticketData.subject}
                        </Title>
                        <Tag color={getStatusColor(ticketData.status)}>
                            {ticketData.status?.replace(/_/g, ' ').toUpperCase()}
                        </Tag>
                    </Space>
                    <Space size="small" style={{ marginTop: 4 }}>
                        <Avatar size="small" icon={<UserOutlined />} src={ticketData.user?.avatar} />
                        <Text type="secondary">
                            by <Text strong>{ticketData.user?.name}</Text> • {formatDate(ticketData.createdAt)}
                        </Text>
                    </Space>
                </Space>
            </div>

            <div style={{ marginTop: 16, marginBottom: 16 }}>
                <Space align="center">
                    <Text type="secondary">Status:</Text>
                    <Select
                        value={ticketData.status}
                        style={{ width: 220 }}
                        onChange={onStatusChange}
                        placeholder="Change Status"
                    >
                        {statuses.map((status: any) => (
                            <Option key={status.id} value={status.slug || status.id}>
                                <Space>
                                    <Tag color={status.color} style={{ marginRight: 0 }}>
                                        {/* Just a color dot or small block could be cleaner, but Tag is fine */}
                                        {status.title}
                                    </Tag>
                                </Space>
                            </Option>
                        ))}
                    </Select>
                </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />
        </Space>
    );
};

export default TicketHeader;
