import React from 'react';
import { Typography, Row, Col, Divider, Space, Card, Descriptions } from 'antd';
import {
    PhoneOutlined,
    LaptopOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { QRCode } from 'antd';

const { Title, Text, Paragraph } = Typography;

const StatementOfService = ({ statusBorderColor }: any) => {
    return (
        <Card title="STATEMENT OF SERVICE" size='small'>
            {/* PAY ONLINE */}
            <Row gutter={[16, 16]} align="middle">
                <Col>
                    <LaptopOutlined style={{ fontSize: 24 }} />
                </Col>
                <Col flex="auto">
                    <Text strong>PAY ONLINE</Text>
                    <br />
                    <Text>Visit br360.com</Text>
                </Col>
                <Col>
                    <Text type="secondary">or scan</Text>
                    <QRCode value="https://br360.com" size={40} style={{ padding: 0 }} />
                </Col>
            </Row>

            {/* PAY BY PHONE */}
            <Row gutter={[16, 16]} align="middle">
                <Col>
                    <PhoneOutlined style={{ fontSize: 24 }} />
                </Col>
                <Col>
                    <Text strong>PAY BY PHONE</Text>
                    <br />
                    <Text>Call 773-279-4100 Ext. 226</Text>
                </Col>
            </Row>

            {/* CUSTOMER SERVICE */}
            <Row gutter={[16, 16]} align="top" style={{ marginTop: 10 }} wrap={false}>
                <Col>
                    <UsergroupAddOutlined style={{ fontSize: 24, color: 'rgba(0,0,0,0.88)', marginTop: 4 }} />
                </Col>
                <Col flex="auto">
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>CUSTOMER SERVICE</Text>
                    <Descriptions column={1} size="small" bordered={false}>
                        <Descriptions.Item label="Phone">
                            <Text>
                                For questions, itemized bills, payment arrangements <br /> call 773-279-4100X 226
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Website">
                            Visit br360.com to obtain a copy of our member information sheet and your renewal and inspection dates.
                        </Descriptions.Item>
                        <Descriptions.Item label="Live Chat">
                            Chat with us at &nbsp; epay.br360.com
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>


        </Card>
    );
};

export default StatementOfService;
