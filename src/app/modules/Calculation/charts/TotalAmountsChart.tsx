import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import { CHART_COLORS, CHART_STYLES } from './config/chartConfig';
import { CustomTooltip } from './config/tooltipConfig';

const { Title } = Typography;

interface TotalAmountsChartProps {
  data: any
}

export const TotalAmountsChart: React.FC<TotalAmountsChartProps> = ({ data }) => {
  const totalAmount = data.reduce((sum:any, item:any) => sum + item.perAmount, 0);
  const totalPayable = data.reduce((sum:any, item:any) => sum + item.payableAmount, 0);
  const unusedAmount = totalAmount - totalPayable;

  const chartData = [
    { name: 'Payable Amount', value: totalPayable },
    { name: 'Unused Amount', value: unusedAmount }
  ];

  return (
    <Card>
      <Title level={5} style={CHART_STYLES.title}>Total Payment Distribution</Title>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={12}>
          <ResponsiveContainer {...CHART_STYLES.container}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill={CHART_COLORS.primary} />
                <Cell fill={CHART_COLORS.secondary} />
              </Pie>
              <Tooltip content={CustomTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col xs={24} md={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Statistic
                title="Total Amount"
                value={totalAmount}
                precision={2}
                prefix="$"
              />
            </Col>
            <Col span={24}>
              <Statistic
                title="Total Payable"
                value={totalPayable}
                precision={2}
                prefix="$"
                valueStyle={{ color: CHART_COLORS.primary }}
              />
            </Col>
            <Col span={24}>
              <Statistic
                title="Unused Amount"
                value={unusedAmount}
                precision={2}
                prefix="$"
                valueStyle={{ color: CHART_COLORS.secondary }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};