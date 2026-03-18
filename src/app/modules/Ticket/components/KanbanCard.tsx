import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Avatar, Tag, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface KanbanCardProps {
    ticket: any;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ ticket }) => {
    const navigate = useNavigate();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: ticket.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'default';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'bug': return 'volcano';
            case 'feature': return 'blue';
            case 'inquiry': return 'cyan';
            case 'support': return 'purple';
            default: return 'default';
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Only navigate if not dragging
        if (!isDragging) {
            navigate(`/ticket/edit/${ticket.id}`);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <Card
                size="small"
                hoverable
                onClick={handleCardClick}
                style={{
                    marginBottom: 8,
                    borderRadius: 8,
                    borderLeft: `4px solid ${getPriorityColor(ticket.priority) === 'red' ? '#ff4d4f' : getPriorityColor(ticket.priority) === 'orange' ? '#fa8c16' : '#52c41a'}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
                bodyStyle={{ padding: '12px' }}
            >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    {/* Title */}
                    <Text strong style={{ fontSize: 13, display: 'block', lineHeight: 1.3 }}>
                        {ticket.subject}
                    </Text>

                    {/* User Info */}
                    <Space size={8}>
                        <Avatar size="small" icon={<UserOutlined />} src={ticket.user?.avatar} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {ticket.user?.name || 'Unknown'}
                        </Text>
                    </Space>

                    {/* Tags */}
                    <Space wrap size={4}>
                        {ticket.priority && (
                            <Tag color={getPriorityColor(ticket.priority)} style={{ fontSize: 10, margin: 0 }}>
                                {ticket.priority?.toUpperCase()}
                            </Tag>
                        )}
                        {ticket.category && (
                            <Tag color={getCategoryColor(ticket.category)} style={{ fontSize: 10, margin: 0 }}>
                                {ticket.category?.toUpperCase()}
                            </Tag>
                        )}
                        {ticket.tags?.slice(0, 2).map((tag: string) => (
                            <Tag key={tag} style={{ fontSize: 10, margin: 0 }}>{tag}</Tag>
                        ))}
                    </Space>
                </Space>
            </Card>
        </div>
    );
};

export default KanbanCard;
