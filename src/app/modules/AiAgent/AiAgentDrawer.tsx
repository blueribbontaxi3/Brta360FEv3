import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Typography, Input, Button, Space, List, Spin, Avatar } from 'antd';
import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface AiAgentDrawerProps {
    open: boolean;
    onClose: () => void;
}

interface Message {
    role: 'user' | 'agent';
    content: string;
    sources?: string[];
}

const AiAgentDrawer: React.FC<AiAgentDrawerProps> = ({ open, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);

        try {
            // Call the AI Agent Service (running on port 3333)
            // Note: In production, this URL should be configurable
            const response = await axios.post('http://localhost:3333/api/v1/ai-agent/ask', {
                question: userMessage.content
            });

            const agentMessage: Message = {
                role: 'agent',
                content: response.data.answer,
                sources: response.data.sources
            };
            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            console.error("Failed to ask AI Agent:", error);
            const errorMessage: Message = {
                role: 'agent',
                content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title={
                <Space>
                    <RobotOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Ask Docs Agent</Title>
                </Space>
            }
            placement="right"
            onClose={onClose}
            open={open}
            width={500}
            bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <RobotOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                        <Title level={4} style={{ marginTop: '24px', color: '#595959' }}>
                            How can I help you today?
                        </Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                            Ask me about business logic, validation rules, or error messages.
                        </Text>
                        <Space direction="vertical" style={{ marginTop: '24px' }}>
                            <Button onClick={() => setInputValue("Why is my insurance balance negative?")}>
                                "Why is my insurance balance negative?"
                            </Button>
                            <Button onClick={() => setInputValue("What does 'Affiliation Price missing' mean?")}>
                                "What does 'Affiliation Price missing' mean?"
                            </Button>
                        </Space>
                    </div>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={(item) => (
                            <List.Item style={{ border: 'none', padding: '10px 0' }}>
                                <div style={{
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start'
                                }}>
                                    {item.role === 'agent' && (
                                        <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff', marginRight: '10px', marginTop: '5px' }} />
                                    )}
                                    <div style={{
                                        maxWidth: '80%',
                                        backgroundColor: item.role === 'user' ? '#1890ff' : '#fff',
                                        color: item.role === 'user' ? '#fff' : '#000',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        borderBottomRightRadius: item.role === 'user' ? '2px' : '12px',
                                        borderBottomLeftRadius: item.role === 'agent' ? '2px' : '12px'
                                    }}>
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{item.content}</div>
                                        {item.sources && item.sources.length > 0 && (
                                            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f0f0f0', fontSize: '12px' }}>
                                                <Text type="secondary" style={{ color: item.role === 'user' ? '#rgba(255,255,255,0.8)' : undefined }}>
                                                    Source: {item.sources[0]}
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                    {item.role === 'user' && (
                                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068', marginLeft: '10px', marginTop: '5px' }} />
                                    )}
                                </div>
                            </List.Item>
                        )}
                    />
                )}
                <div ref={bottomRef} />
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder="Type your question..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onPressEnter={handleSend}
                        disabled={loading}
                    />
                    <Button
                        type="primary"
                        icon={loading ? <Spin size="small" /> : <SendOutlined />}
                        onClick={handleSend}
                        disabled={loading}
                    />
                </Space.Compact>
            </div>
        </Drawer>
    );
};

export default AiAgentDrawer;
