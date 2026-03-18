import React from 'react';
import { Card, Row, Typography, Divider, Descriptions } from 'antd';

const { Text } = Typography;

const BalanceSummaryCard = ({
    data,
    lessCurrentMonth = 0,
    balanceOwed = 0,
    totalPayable = 0,
    nextMonthDue = 0,
    nextMonthLabel = '-'
}: any) => {
    const member = data?.corporation?.member;
    const corporationName = data?.corporation?.corporationName || '-';
    const medallionNumber = data?.medallionNumber || '-';
    const statementDate = data?.requestDate || '-';

    return (
        <Card bordered={false} size='small'>
            <Descriptions column={1} bordered={false} size="small" labelStyle={{ fontWeight: 'bold' }}>
                <Descriptions.Item label="Member">
                    {member ? `${member.id} - ${member.fullName}` : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Corporation">{corporationName}</Descriptions.Item>
                <Descriptions.Item label="Medallion">{medallionNumber}</Descriptions.Item>
                <Descriptions.Item label="Statement Date">{statementDate}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            <Card type="inner" title="Balance summary" bordered style={{ border: '1px solid #999', borderRadius: 8 }} size='small'>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Text>Charges for Ins & Affiliation</Text>
                    <Text strong>${Number(totalPayable).toFixed(2)}</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Text>Less Current Month</Text>
                    <Text strong>${Number(lessCurrentMonth).toFixed(2)}</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Text>Balance Owed</Text>
                    <Text strong>${Number(balanceOwed).toFixed(2)}</Text>
                </Row>
                <Row justify="space-between">
                    <Text>
                        Monthly Amount Due starting {nextMonthLabel !== '-' ? nextMonthLabel : (data?.effectiveDate || '-')}
                    </Text>
                    <Text strong>
                        ${Number(nextMonthDue).toFixed(2)}
                    </Text>
                </Row>
            </Card>
        </Card>
    );
};

export default BalanceSummaryCard;
