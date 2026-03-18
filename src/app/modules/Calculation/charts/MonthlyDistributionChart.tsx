import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, Typography, Row, Col, Badge, Space } from 'antd';
import { CHART_COLORS, CHART_STYLES } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';

const { Title, Text } = Typography;

interface MonthlyDistributionChartProps {
  data: any
}

export const MonthlyDistributionChart: React.FC<MonthlyDistributionChartProps> = ({ data }) => {
  const renderMonthPieChart = (monthData: any) => {
    const chartData = [
      { name: 'Payable', value: monthData.payableAmount },
      { name: 'Unused', value: monthData.perAmount - monthData.payableAmount }
    ];

    const utilizationRate = ((monthData.payableAmount / monthData.perAmount) * 100).toFixed(1);
    const daysUtilization = ((monthData.payableDaysCount / monthData.totalDays) * 100).toFixed(1);

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={monthData.month}>
        <Card size="small">
          <Space direction="vertical" style={{ width: '100%' }} size={4}>
            {/* Month Header */}
            <Title level={5} style={{ textAlign: 'center', margin: 0 }}>
              {monthData.month}
            </Title>
            
            {/* Payment Details */}
            <div style={{ textAlign: 'center' }}>
              <Badge 
                color={CHART_COLORS.primary} 
                text={<Text>Payable: ${monthData.payableAmount}</Text>} 
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <Badge 
                color={CHART_COLORS.secondary} 
                text={<Text>Total: ${monthData.perAmount}</Text>} 
              />
            </div>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={CHART_COLORS.primary} />
                  <Cell fill={CHART_COLORS.secondary} />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Utilization Stats */}
            <Space direction="vertical" size={0} style={{ width: '100%', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Budget Usage:</Text>
                <Text strong>{utilizationRate}%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Days Used:</Text>
                <Text strong>{monthData.payableDaysCount}/{monthData.totalDays} ({daysUtilization}%)</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Daily Rate:</Text>
                <Text strong>${monthData.perDayAmount}</Text>
              </div>
            </Space>
          </Space>
        </Card>
      </Col>
    );
  };

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Monthly Payment Distribution</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Detailed breakdown of payment allocation and utilization by month
      </Text>
      <Row gutter={[16, 16]}>
        {data.map(renderMonthPieChart)}
      </Row>
    </Card>
  );
};