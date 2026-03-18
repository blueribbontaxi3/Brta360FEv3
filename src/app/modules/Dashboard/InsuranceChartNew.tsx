import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const InsuranceChartNew = () => {
  // Sample data - replace with your actual data
  const yearWiseData = [
    { year: '2019', insured: 120, surrender: 15, renew: 105, flat_cancel: 8, affiliation: 4500, liability: 3200, collision: 2800, pace: 1800, workman: 2200 },
    { year: '2020', insured: 135, surrender: 18, renew: 117, flat_cancel: 10, affiliation: 4800, liability: 3500, collision: 3000, pace: 2000, workman: 2400 },
    { year: '2021', insured: 150, surrender: 20, renew: 130, flat_cancel: 12, affiliation: 5200, liability: 3800, collision: 3200, pace: 2200, workman: 2600 },
    { year: '2022', insured: 170, surrender: 22, renew: 148, flat_cancel: 15, affiliation: 5500, liability: 4000, collision: 3500, pace: 2500, workman: 2800 },
    { year: '2023', insured: 190, surrender: 25, renew: 165, flat_cancel: 18, affiliation: 5800, liability: 4200, collision: 3800, pace: 2700, workman: 3000 },
  ];

  const statusData = [
    { status: 'Pending', value: 15 },
    { status: 'Approved', value: 65 },
    { status: 'Rejected', value: 10 },
    { status: 'Under Review', value: 10 },
  ];

  const currentYearData = yearWiseData[yearWiseData.length - 1];

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px', color: '#1890ff' }}>Insurance Statistics Dashboard</h1>
      
      {/* Status Request Summary */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="Status Request Overview" bordered={false}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic title="Total Requests" value={100} />
              </Col>
              <Col span={6}>
                <div>
                  <span>Pending: 15%</span>
                  <Progress percent={15} size="small" status="active" />
                </div>
              </Col>
              <Col span={6}>
                <div>
                  <span>Approved: 65%</span>
                  <Progress percent={65} size="small" status="success" />
                </div>
              </Col>
              <Col span={6}>
                <div>
                  <span>Rejected: 10%</span>
                  <Progress percent={10} size="small" status="exception" />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Main Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Insured"
              value={currentYearData.insured}
              valueStyle={{ color: '#3f8600' }}
              suffix="policies"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Surrender"
              value={currentYearData.surrender}
              valueStyle={{ color: '#cf1322' }}
              suffix="policies"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Renew"
              value={currentYearData.renew}
              valueStyle={{ color: '#3f8600' }}
              suffix="policies"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Flat Cancel"
              value={currentYearData.flat_cancel}
              valueStyle={{ color: '#cf1322' }}
              suffix="policies"
            />
          </Card>
        </Col>
      </Row>

      {/* Price Metrics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Price Metrics (Current Year)" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Affiliation Price" value={currentYearData.affiliation} prefix="₹" />
              </Col>
              <Col span={12}>
                <Statistic title="Liability Price" value={currentYearData.liability} prefix="₹" />
              </Col>
              <Col span={12}>
                <Statistic title="Collision Price" value={currentYearData.collision} prefix="₹" />
              </Col>
              <Col span={12}>
                <Statistic title="PACE Program Price" value={currentYearData.pace} prefix="₹" />
              </Col>
              <Col span={12}>
                <Statistic title="Workman Price" value={currentYearData.workman} prefix="₹" />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Status Distribution" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Year-wise Charts */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Policy Statistics by Year" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="insured" fill="#8884d8" />
                <Bar dataKey="surrender" fill="#82ca9d" />
                <Bar dataKey="renew" fill="#ffc658" />
                <Bar dataKey="flat_cancel" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Price Trends by Year" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="affiliation" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="liability" stroke="#82ca9d" />
                <Line type="monotone" dataKey="collision" stroke="#ffc658" />
                <Line type="monotone" dataKey="pace" stroke="#ff8042" />
                <Line type="monotone" dataKey="workman" stroke="#0088FE" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InsuranceChartNew;