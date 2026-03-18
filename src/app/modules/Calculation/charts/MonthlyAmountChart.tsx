import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
import { CHART_COLORS, CHART_STYLES, AXIS_CONFIG } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';
import { axisProps } from './config/axisConfig';

const { Title } = Typography;

interface MonthlyAmountChartProps {
  data: any
}

export const MonthlyAmountChart: React.FC<MonthlyAmountChartProps> = ({ data }) => {
  const chartData = data.map((item:any) => ({
    month: item.month,
    amount: item.perAmount,
  }));

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Monthly Amount Distribution</Title>
      <ResponsiveContainer {...CHART_STYLES.container}>
        <BarChart data={chartData}>
          <CartesianGrid {...AXIS_CONFIG} />
          <XAxis dataKey="month" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="amount" 
            name="Monthly Amount" 
            fill={CHART_COLORS.tertiary}
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};