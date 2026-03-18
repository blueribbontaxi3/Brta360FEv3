import React, { useState } from 'react';
import { Card, Space, List, Typography, Image, Select } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface TicketSidebarProps {
    ticketData: any;
    isSuperAdmin: boolean;
    getAllAttachments: () => any[];
    formatDate: (date: string) => string;
    onUpdateSuccess?: () => void;
}

const TicketSidebar: React.FC<TicketSidebarProps> = ({
    ticketData,
    getAllAttachments,
    formatDate,
}) => {
    // Ticket Details card removed as per request to simplify UI.
    // Status and Priority are now managed in the TicketHeader.

    if (!ticketData) return null;

    return (
        <Space direction="vertical" size="middle" style={{ width: '100%', position: 'sticky', top: 16 }}>
            {/* Attachments Card */}
            <Card
                title={
                    <Space>
                        <PaperClipOutlined />
                        <span>Attachments ({getAllAttachments().length})</span>
                    </Space>
                }
                size="small"
                bodyStyle={{ padding: getAllAttachments().length ? '0' : '24px' }}
            >
                {getAllAttachments().length > 0 ? (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <List
                            dataSource={getAllAttachments()}
                            renderItem={(attachment: any) => (
                                <List.Item style={{ padding: '8px 12px' }}>
                                    <Space size="small" align="start" style={{ width: '100%' }}>
                                        <Image
                                            width={40}
                                            height={40}
                                            src={attachment.file_path}
                                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <Space direction="vertical" size={0} style={{ flex: 1, overflow: 'hidden' }}>
                                            <Text strong style={{ fontSize: '12px' }}>
                                                {attachment.messageSender}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: '10px' }}>
                                                {formatDate(attachment.messageDate)}
                                            </Text>
                                        </Space>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </div>
                ) : (
                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                        <PaperClipOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>No attachments</Text>
                    </Space>
                )}
            </Card>
        </Space>
    );
};

export default TicketSidebar;
