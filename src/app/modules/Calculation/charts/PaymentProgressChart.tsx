import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
import { CHART_COLORS, CHART_STYLES } from './config/chartConfig';

const { Title, Text } = Typography;

interface PaymentProgressChartProps {
  data: any
}

export const PaymentProgressChart: React.FC<PaymentProgressChartProps> = ({ data }) => {
  const totalAmount = data.reduce((sum:any, item:any) => sum + item.perAmount, 0);
  const totalPayable = data.reduce((sum:any, item:any) => sum + item.payableAmount, 0);
  const completionRate = (totalPayable / totalAmount) * 100;

  const chartData = [{
    name: 'Completion',
    value: completionRate,
    fill: CHART_COLORS.primary
  }];

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Payment Completion Progress</Title>
      <ResponsiveContainer {...CHART_STYLES.container}>
        <RadialBarChart 
          innerRadius="60%" 
          outerRadius="80%" 
          data={chartData} 
          startAngle={180} 
          endAngle={0}
        >
          <RadialBar
            dataKey="value"
            isAnimationActive={false}
            cornerRadius={10}
            fill={CHART_COLORS.primary}
            background={{ fill: CHART_COLORS.background }}
          />
          <Legend 
            iconSize={10} 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <Text strong style={{ display: 'block', textAlign: 'center' }}>
        {completionRate.toFixed(1)}% Complete
      </Text>
    </Card>
  );
};