import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Tooltip, Divider } from 'antd';
import {
  RiseOutlined,
  DollarOutlined,
  CalendarOutlined,
  AimOutlined,
  WarningOutlined,
  FallOutlined,
  LineChartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { CHART_COLORS } from './config/chartConfig';

const { Title, Paragraph } = Typography;

interface PaymentKPIChartProps {
  data: any;
}

export const PaymentKPIChart: React.FC<PaymentKPIChartProps> = ({ data }) => {
  if (!data.length) return null;

  const totalBudget = data.reduce((sum: any, item: any) => sum + item.perAmount, 0);
  const totalSpent = data.reduce((sum: any, item: any) => sum + item.payableAmount, 0);
  const totalDays = data.reduce((sum: any, item: any) => sum + item.totalDays, 0);
  const usedDays = data.reduce((sum: any, item: any) => sum + item.payableDaysCount, 0);

  // Core KPIs
  const budgetUtilization = (totalSpent / totalBudget) * 100;
  const daysUtilization = (usedDays / totalDays) * 100;
  const averageDailyRate = totalSpent / usedDays;

  // Advanced KPIs
  const efficiencyScore = (budgetUtilization + daysUtilization) / 2;
  const budgetVariance = totalBudget - totalSpent;
  const costPerDay = totalSpent / usedDays;
  const utilizationTrend = data.length > 1
    ? ((data[data.length - 1].payableAmount / data[data.length - 1].perAmount) -
      (data[0].payableAmount / data[0].perAmount)) * 100
    : 0;

  return (
    <Card>
      <Title level={5} style={{ margin: 0 }}>Key Performance Indicators</Title>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        Comprehensive overview of budget utilization, time management, and operational efficiency metrics
      </Paragraph>
      <Divider style={{ margin: 0 }}/>
      <Row gutter={[24, 24]}>
        {/* Time Metrics */}
        <Col xs={24}>
          <Title style={{ margin: 0 }} level={5}>Time Metrics</Title>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Total number of days in the selected period">
            <Card>
              <Statistic
                title="Total Days"
                value={totalDays}
                prefix={<ClockCircleOutlined style={{ color: CHART_COLORS.primary, fontSize: '20px' }} />}
                suffix="days"
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Total calendar days in period
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Number of days utilized for payments">
            <Card>
              <Statistic
                title="Used Days"
                value={usedDays}
                prefix={<CalendarOutlined style={{ color: CHART_COLORS.secondary, fontSize: '20px' }} />}
                suffix="days"
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Days with active payments
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Remaining days in the period">
            <Card>
              <Statistic
                title="Remaining Days"
                value={totalDays - usedDays}
                prefix={<CalendarOutlined style={{ fontSize: '20px' }} />}
                suffix="days"
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Days left in period
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Percentage of days utilized">
            <Card>
              <Statistic
                title="Days Utilization"
                value={daysUtilization}
                precision={1}
                prefix={<CalendarOutlined style={{ color: CHART_COLORS.tertiary, fontSize: '20px' }} />}
                suffix="%"
              />
              <Progress
                percent={daysUtilization}
                strokeColor={CHART_COLORS.tertiary}
                size="small"
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Time utilization rate
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>

        {/* Financial Metrics */}
        <Col xs={24}>
          <Title level={5}>Financial Metrics</Title>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Percentage of allocated budget that has been utilized">
            <Card>
              <Statistic
                title="Budget Utilization"
                value={budgetUtilization}
                precision={1}
                prefix={<DollarOutlined style={{ color: CHART_COLORS.primary, fontSize: '20px' }} />}
                suffix="%"
              />
              <Progress
                percent={budgetUtilization}
                strokeColor={CHART_COLORS.primary}
                size="small"
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Budget usage efficiency
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Combined score of budget and time efficiency">
            <Card>
              <Statistic
                title="Efficiency Score"
                value={efficiencyScore}
                precision={1}
                prefix={<AimOutlined style={{ fontSize: '20px' }} />}
                suffix="%"
              />
              <Progress
                percent={efficiencyScore}
                strokeColor={{
                  '0%': CHART_COLORS.primary,
                  '100%': CHART_COLORS.secondary,
                }}
                size="small"
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Overall performance indicator
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Average amount spent per day">
            <Card>
              <Statistic
                title="Daily Cost Rate"
                value={costPerDay}
                precision={2}
                prefix={<LineChartOutlined style={{ color: CHART_COLORS.tertiary, fontSize: '20px' }} />}
                suffix="$/day"
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Average daily expenditure
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Average daily spending rate">
            <Card>
              <Statistic
                title="Average Daily Rate"
                value={averageDailyRate}
                precision={2}
                prefix={<RiseOutlined style={{ color: CHART_COLORS.tertiary, fontSize: '20px' }} />}
                suffix="$"
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Daily payment trend
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>

        {/* Trend Metrics */}
        <Col xs={24}>
          <Title level={5}>Trend Analysis</Title>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Difference between allocated and spent budget">
            <Card>
              <Statistic
                title="Budget Variance"
                value={budgetVariance}
                precision={2}
                prefix={<WarningOutlined style={{ fontSize: '20px' }} />}
                suffix="$"
                valueStyle={{ color: budgetVariance < 0 ? '#cf1322' : '#3f8600' }}
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Budget deviation analysis
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Tooltip title="Change in utilization rate over time">
            <Card>
              <Statistic
                title="Utilization Trend"
                value={utilizationTrend}
                precision={1}
                prefix={utilizationTrend >= 0 ?
                  <RiseOutlined style={{ fontSize: '20px', color: '#3f8600' }} /> :
                  <FallOutlined style={{ fontSize: '20px', color: '#cf1322' }} />
                }
                suffix="%"
                valueStyle={{ color: utilizationTrend >= 0 ? '#3f8600' : '#cf1322' }}
              />
              <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                Usage pattern analysis
              </Paragraph>
            </Card>
          </Tooltip>
        </Col>
      </Row>
    </Card>
  );
};