import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { CHART_COLORS } from './config/chartConfig';

const { Title } = Typography;

interface PaymentHeatmapProps {
  data: any
}

export const PaymentHeatmap: React.FC<PaymentHeatmapProps> = ({ data }) => {
  const maxPayableAmount = Math.max(...data.map((item: any) => item.payableAmount));

  const getColor = (amount: number) => {
    const intensity = (amount / maxPayableAmount) * 0.8; // 0.8 to avoid too light colors
    return `rgba(136, 132, 216, ${intensity + 0.2})`; // 0.2 as base opacity
  };

  return (
    <Card>
      <Title level={5}>Payment Intensity Heatmap</Title>
      <Row gutter={[8, 8]}>
        {data.map((month: any) => (
          <Col key={month.month} xs={12} sm={8} md={6} lg={4}>
            <Card
              size="small"
              style={{
                backgroundColor: getColor(month.payableAmount),
                textAlign: 'center',
                color: '#fff'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{month.month}</div>
              <div>${month.payableAmount}</div>
              <div style={{ fontSize: '12px' }}>{month.payableDaysCount} days</div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};