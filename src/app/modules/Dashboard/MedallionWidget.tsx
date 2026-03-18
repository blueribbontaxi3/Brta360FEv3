import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, Row, Col, Statistic } from "antd";

const MedallionWidget = () => {
  const data = [
    { name: "Assigned", value: 120 },
    { name: "Unassigned", value: 30 },
    { name: "WAV Enabled", value: 15 },
  ];

  const COLORS = ["#1890ff", "#ff4d4f", "#52c41a"]; // Ant Design color palette

  const total = data.reduce((a, b) => a + b.value, 0);

  return (
    <Card title="Medallions Overview" size="small">
      <Row gutter={16}>
        <Col span={12}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ value }) => value}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Total" value={total} />
            </Col>
            <Col span={12}>
              <Statistic title="Assigned" value={120} />
            </Col>
            <Col span={12}>
              <Statistic title="Unassigned" value={30} />
            </Col>
            <Col span={12}>
              <Statistic title="WAV Enabled" value={15} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default MedallionWidget;
