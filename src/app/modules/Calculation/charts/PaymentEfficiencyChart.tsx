import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, Label } from 'recharts';
import { Card, Typography, Space } from 'antd';
import { CHART_COLORS, CHART_STYLES, AXIS_CONFIG } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';
import { axisProps } from './config/axisConfig';

const { Title, Text } = Typography;

interface PaymentEfficiencyChartProps {
  data: any
}

export const PaymentEfficiencyChart: React.FC<PaymentEfficiencyChartProps> = ({ data }) => {
  const chartData = data.map((item:any) => ({
    month: item.month,
    'Utilization Rate': ((item.payableDaysCount / item.totalDays) * 100).toFixed(1),
    'Payment Efficiency': ((item.payableAmount / item.perAmount) * 100).toFixed(1),
    'Daily Rate Impact': (item.perDayAmount * item.payableDaysCount).toFixed(1)
  }));

  return (
    <Card>
      <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 16 }}>
        <Title level={5} style={CHART_STYLES.title}>Payment Efficiency Analysis</Title>
        <Text type="secondary">
          Tracks utilization rates, payment efficiency, and daily rate impact across months
        </Text>
      </Space>
      <ResponsiveContainer {...CHART_STYLES.container}>
        <LineChart data={chartData}>
          <CartesianGrid {...AXIS_CONFIG} />
          <XAxis dataKey="month" {...axisProps}>
            <Label value="Month" position="bottom" offset={0} />
          </XAxis>
          <YAxis yAxisId="left" {...axisProps}>
            <Label value="Percentage (%)" angle={-90} position="insideLeft" offset={8} />
          </YAxis>
          <YAxis yAxisId="right" orientation="right" {...axisProps}>
            <Label value="Amount ($)" angle={90} position="insideRight" offset={8} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Brush dataKey="month" height={30} stroke={CHART_COLORS.primary} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Utilization Rate"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Payment Efficiency"
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Daily Rate Impact"
            stroke={CHART_COLORS.tertiary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};