import React from 'react';
import { List, Card, Space, Avatar, Typography, Image, Divider } from 'antd';
import { UserOutlined, PaperClipOutlined, RobotOutlined, DownloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Text, Paragraph } = Typography;

interface TicketConversationProps {
    messages: any[];
    formatDate: (date: string) => string;
}

const TicketConversation: React.FC<TicketConversationProps> = ({ messages, formatDate }) => {

    const auth: any = useSelector((state: any) => state?.user_login);
    const currentUserId = auth?.id; // Assuming user_login has id. If not, we might need to check structure.

    if (!messages || messages.length === 0) return null;

    return (
        <div style={{ padding: '0 8px' }}>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>Conversation</Typography.Title>

            <List
                dataSource={messages}
                split={false}
                renderItem={(message: any) => {
                    // Determine alignment based on sender
                    // We need to know who sent the message. 
                    // Assuming message.sender_id or message.sender.id exists and we can compare with current user or infer 'admin' role.
                    // For now, let's assume if it's NOT the current user, it's the "support" (left), and current user is right.
                    // OR if we are admin, we are right?
                    // Let's stick to a standard: Customer Left/Right? 
                    // Usually: Me = Right, Others = Left.

                    const isMe = message.sender_id === currentUserId || (message.sender && message.sender.id === currentUserId);
                    const alignment = isMe ? 'flex-end' : 'flex-start';
                    const bubbleColor = isMe ? '#e6f7ff' : '#f0f2f5'; // Light blue for me, Grey for others
                    const textAlign = 'left';

                    return (
                        <div style={{ display: 'flex', justifyContent: alignment, marginBottom: 20 }}>
                            <div style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', maxWidth: '80%' }}>
                                <Avatar
                                    icon={<UserOutlined />}
                                    src={message.sender?.avatar}
                                    style={{ margin: isMe ? '0 0 0 8px' : '0 8px 0 0', flexShrink: 0 }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: alignment }}>
                                    <div style={{
                                        padding: '12px 16px',
                                        background: bubbleColor,
                                        borderRadius: '12px',
                                        borderTopRightRadius: isMe ? '2px' : '12px',
                                        borderTopLeftRadius: isMe ? '12px' : '2px',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}>
                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                            {/* Sender Name */}
                                            <Text strong style={{ fontSize: '12px', color: '#595959' }}>
                                                {message.sender?.name || 'Unknown'}
                                            </Text>

                                            {/* Message Body */}
                                            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                                {message.message}
                                            </Paragraph>

                                            {/* Attachments */}
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div style={{ marginTop: 8 }}>
                                                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 4 }}>
                                                        <PaperClipOutlined /> {message.attachments.length} Attachments
                                                    </Text>
                                                    {/* Separate Images and Videos/Files for better layout */}
                                                    <Image.PreviewGroup>
                                                        <Space wrap size={8} align="start">
                                                            {message.attachments.map((attachment: any) => {
                                                                const isVideo = (url: string) => {
                                                                    if (!url) return false;
                                                                    const extension = url.split('.').pop()?.toLowerCase();
                                                                    return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension || '');
                                                                };

                                                                if (isVideo(attachment.file_path)) {
                                                                    return (
                                                                        <div key={attachment.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                            <video
                                                                                src={attachment.file_path}
                                                                                controls
                                                                                style={{
                                                                                    width: 200,
                                                                                    height: 120,
                                                                                    borderRadius: '8px',
                                                                                    border: '1px solid #d9d9d9',
                                                                                    backgroundColor: '#000'
                                                                                }}
                                                                            />
                                                                            <a
                                                                                href={attachment.file_path}
                                                                                download
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                style={{ marginTop: 4, fontSize: '11px' }}
                                                                            >
                                                                                <DownloadOutlined /> Download Video
                                                                            </a>
                                                                        </div>
                                                                    );
                                                                }

                                                                return (
                                                                    <Image
                                                                        key={attachment.id}
                                                                        width={60}
                                                                        height={60}
                                                                        src={attachment.file_path}
                                                                        style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid #d9d9d9' }}
                                                                    />
                                                                );
                                                            })}
                                                        </Space>
                                                    </Image.PreviewGroup>
                                                </div>
                                            )}
                                        </Space>
                                    </div>
                                    <Text type="secondary" style={{ fontSize: '10px', marginTop: 4 }}>
                                        {formatDate(message.createdAt)}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default TicketConversation;
