import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface DaysDistributionChartProps {
  data: any
}

export const DaysDistributionChart: React.FC<DaysDistributionChartProps> = ({ data }) => (
  <Card>
    <Title level={5}>Days Distribution</Title>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalDays" name="Total Days" stroke="#8884d8" />
        <Line type="monotone" dataKey="payableDaysCount" name="Payable Days" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);