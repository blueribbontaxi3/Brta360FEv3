import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { Card, Typography, Space } from 'antd';
import { CHART_COLORS, CHART_STYLES, AXIS_CONFIG } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';
import { axisProps } from './config/axisConfig';

const { Title, Text } = Typography;

interface PaymentForecastChartProps {
  data: any
}

export const PaymentForecastChart: React.FC<PaymentForecastChartProps> = ({ data }: any) => {
  const chartData = data.map((item: any) => {
    const projectedAmount = item.perAmount;
    const actualAmount = item.payableAmount;
    const variance = projectedAmount - actualAmount;

    return {
      month: item.month,
      'Projected Amount': projectedAmount,
      'Actual Amount': actualAmount,
      'Variance': variance,
      'Trend': (actualAmount / projectedAmount * 100).toFixed(1)
    };
  });

  return (
    <Card>
      <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 16 }}>
        <Title level={5} style={CHART_STYLES.title}>Payment Forecast & Variance Analysis</Title>
        <Text type="secondary">
          Analyzes projected vs actual payments and their variances over time
        </Text>
      </Space>
      <ResponsiveContainer {...CHART_STYLES.container}>
        <AreaChart data={chartData}>
          <CartesianGrid {...AXIS_CONFIG} />
          <XAxis dataKey="month" {...axisProps}>
            <Label value="Month" position="bottom" offset={0} />
          </XAxis>
          <YAxis {...axisProps}>
            <Label value="Amount ($)" angle={-90} position="insideLeft" offset={8} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="Projected Amount"
            stackId="1"
            stroke={CHART_COLORS.primary}
            fill={CHART_COLORS.primary}
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="Actual Amount"
            stackId="2"
            stroke={CHART_COLORS.secondary}
            fill={CHART_COLORS.secondary}
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="Variance"
            stackId="3"
            stroke={CHART_COLORS.tertiary}
            fill={CHART_COLORS.tertiary}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};