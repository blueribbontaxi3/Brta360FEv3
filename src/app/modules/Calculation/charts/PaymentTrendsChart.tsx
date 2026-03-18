import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
import { CHART_COLORS, CHART_STYLES, AXIS_CONFIG } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';
import { axisProps } from './config/axisConfig';

const { Title } = Typography;

interface PaymentTrendsChartProps {
  data: any
}

export const PaymentTrendsChart: React.FC<PaymentTrendsChartProps> = ({ data }) => {
  const chartData = data.map((item:any) => ({
    month: item.month,
    'Total Amount': item.perAmount,
    'Actual Payment': item.payableAmount,
    'Efficiency': ((item.payableAmount / item.perAmount) * 100).toFixed(1)
  }));

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Payment Trends Analysis</Title>
      <ResponsiveContainer {...CHART_STYLES.container}>
        <LineChart data={chartData}>
          <CartesianGrid {...AXIS_CONFIG} />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis yAxisId="left" {...axisProps} />
          <YAxis yAxisId="right" orientation="right" {...axisProps} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Total Amount"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Actual Payment"
            stroke={CHART_COLORS.secondary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Efficiency"
            stroke={CHART_COLORS.tertiary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};