import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface CumulativePaymentChartProps {
  data: any
}

export const CumulativePaymentChart: React.FC<CumulativePaymentChartProps> = ({ data }) => (
  <Card>
    <Title level={5}>Cumulative Payment Distribution</Title>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="payableAmount" 
          name="Payable Amount" 
          stackId="1" 
          fill="#8884d8" 
          stroke="#8884d8"
        />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);