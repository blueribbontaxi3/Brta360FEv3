import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface PaymentDistributionChartProps {
  data: any
}

export const PaymentDistributionChart: React.FC<PaymentDistributionChartProps> = ({ data }) => {
  const pieData = data
    .map((item: any) => ({
      name: item.month,
      value: item.payableAmount,
    }))
    .filter((item: any) => item.value > 0);

  return (
    <Card>
      <Title level={5}>Payment Distribution by Month</Title>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry: any, index: any) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};