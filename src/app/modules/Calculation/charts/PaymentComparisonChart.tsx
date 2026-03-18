import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
import { CHART_COLORS, CHART_STYLES, AXIS_CONFIG } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';
import { axisProps } from './config/axisConfig';

const { Title } = Typography;

interface PaymentComparisonChartProps {
  data: any
}

export const PaymentComparisonChart: React.FC<PaymentComparisonChartProps> = ({ data }) => {
  const chartData = data.map((item:any) => ({
    month: item.month,
    'Total Amount': item.perAmount,
    'Payable Amount': item.payableAmount,
    'Utilization Rate': ((item.payableAmount / item.perAmount) * 100).toFixed(1) + '%'
  }));

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Payment Utilization Analysis</Title>
      <ResponsiveContainer {...CHART_STYLES.container}>
        <BarChart data={chartData}>
          <CartesianGrid {...AXIS_CONFIG} />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Total Amount" fill={CHART_COLORS.primary} />
          <Bar dataKey="Payable Amount" fill={CHART_COLORS.secondary} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};