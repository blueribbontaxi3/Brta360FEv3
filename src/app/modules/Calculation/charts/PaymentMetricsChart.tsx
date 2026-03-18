import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
import { CHART_COLORS, CHART_STYLES, AXIS_CONFIG } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';
import { axisProps } from './config/axisConfig';

const { Title } = Typography;

interface PaymentMetricsChartProps {
  data: any
}

export const PaymentMetricsChart: React.FC<PaymentMetricsChartProps> = ({ data }) => {
  const chartData = data.map((item:any) => ({
    month: item.month,
    'Total Budget': item.perAmount,
    'Actual Spend': item.payableAmount,
    'Daily Rate': item.perDayAmount,
    'Efficiency Score': ((item.payableAmount / item.perAmount) * (item.payableDaysCount / item.totalDays) * 100).toFixed(1)
  }));

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Advanced Payment Metrics</Title>
      <ResponsiveContainer {...CHART_STYLES.container}>
        <ComposedChart data={chartData}>
          <CartesianGrid {...AXIS_CONFIG} />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis yAxisId="left" {...axisProps} />
          <YAxis yAxisId="right" orientation="right" {...axisProps} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="Total Budget"
            fill={CHART_COLORS.primary}
            opacity={0.8}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="Actual Spend"
            fill={CHART_COLORS.secondary}
            opacity={0.8}
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Efficiency Score"
            stroke={CHART_COLORS.tertiary}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};