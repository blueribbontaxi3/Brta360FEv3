import React from 'react';
import { Card, Typography, Row, Col, Statistic, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CalendarOutlined } from '@ant-design/icons';
import { CHART_COLORS } from './config/chartConfig';

const { Title } = Typography;

interface PaymentSummaryChartProps {
  data: any
}

export const PaymentSummaryChart: React.FC<PaymentSummaryChartProps> = ({ data }) => {
  if (!data.length) {
    return (
      <Card>
        <Empty description="No payment data available" />
      </Card>
    );
  }

  const totalDays = data.reduce((sum:any, item:any) => sum + item.totalDays, 0);
  const totalPayableDays = data.reduce((sum:any, item:any) => sum + item.payableDaysCount, 0);
  const utilizationRate = totalDays ? (totalPayableDays / totalDays) * 100 : 0;

  const highestMonth = data.reduce((prev:any, current:any) => 
    current.payableAmount > prev.payableAmount ? current : prev, 
    data[0]
  );

  const lowestMonth = data.reduce((prev:any, current:any) => 
    current.payableAmount < prev.payableAmount ? current : prev,
    data[0]
  );

  return (
    <Card>
      <Title level={5}>Payment Summary</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Highest Payment Month"
              value={highestMonth.month}
              prefix={<ArrowUpOutlined color={CHART_COLORS.primary} size={20} />}
              suffix={`$${highestMonth.payableAmount}`}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Lowest Payment Month"
              value={lowestMonth.month}
              prefix={<ArrowDownOutlined color={CHART_COLORS.secondary} size={20} />}
              suffix={`$${lowestMonth.payableAmount}`}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Days Utilization"
              value={utilizationRate}
              precision={1}
              prefix={<CalendarOutlined size={20} />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};