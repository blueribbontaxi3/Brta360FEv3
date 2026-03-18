import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
import { CHART_COLORS, CHART_STYLES, AXIS_CONFIG } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';
import { axisProps } from './config/axisConfig';

const { Title } = Typography;

interface DailyDistributionChartProps {
  data: any
}

export const DailyDistributionChart: React.FC<DailyDistributionChartProps> = ({ data }) => {
  const chartData = data.map((item:any) => ({
    month: item.month,
    'Daily Rate': item.perDayAmount,
    'Daily Utilization': (item.payableDaysCount / item.totalDays) * 100
  }));

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Daily Payment Distribution</Title>
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
            dataKey="Daily Rate" 
            stroke={CHART_COLORS.primary} 
            activeDot={{ r: 8 }} 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="Daily Utilization" 
            stroke={CHART_COLORS.secondary} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};