import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
import { CHART_COLORS, CHART_STYLES, AXIS_CONFIG } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';
import { axisProps } from './config/axisConfig';

const { Title } = Typography;

interface PaymentDistributionComparisonChartProps {
  data: any
}

export const PaymentDistributionComparisonChart: React.FC<PaymentDistributionComparisonChartProps> = ({ data }) => {
  const chartData = data.map((item:any) => ({
    month: item.month,
    'Allocated Days': item.totalDays,
    'Used Days': item.payableDaysCount,
    'Daily Rate': item.perDayAmount
  }));

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Payment Distribution Analysis</Title>
      <ResponsiveContainer {...CHART_STYLES.container}>
        <BarChart data={chartData}>
          <CartesianGrid {...AXIS_CONFIG} />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis yAxisId="left" {...axisProps} />
          <YAxis yAxisId="right" orientation="right" {...axisProps} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="Allocated Days"
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="Used Days"
            fill={CHART_COLORS.secondary}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="Daily Rate"
            fill={CHART_COLORS.tertiary}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};