import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Progress, Spin, Flex } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import axios from '../../../utils/axiosInceptor';
import dayjs from 'dayjs';
import { usdFormat } from 'utils/helper';

const { Title, Text } = Typography;

export const DashboardWorkmanCompTotal: any = (props: any) => {
  const { type, cardTitle, strokeColor } = props;
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/dashboard/business-metrics-coverage?type=${type}`);
      const insuranceData = response.data.data; // adapt path to API
      setData(insuranceData);
    } catch (error) {
      console.error('Error fetching business-metrics-workman-comp data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = data?.currentPeriod
    ? usdFormat(data.currentPeriod.totalCoverageAmount)
    : '-';

  const retention = data?.metrics?.retentionRatePercent
    ? Math.round(data.metrics.retentionRatePercent)
    : 0;

  const growth = data?.metrics?.growthPercent || 0;

  const trend = growth >= 0 ? 'up' : 'down';
  const trendValue = `${growth.toFixed(2)}%`;

  return (
    <Card size="small" title={cardTitle} extra={dayjs().subtract(1, 'year').format('YYYY') + ' / ' + dayjs().format('YYYY')}>
      <Spin spinning={loading} tip="Loading...">
        <Row justify="space-between" align="top">
          <Col>
            <Title level={3} style={{ marginTop: 0, marginBottom: 16 }}>
              {value}
            </Title>
            <Flex wrap={true}>
              {trend === 'up' ? (
                <ArrowUpOutlined style={{ color: 'green', fontSize: 16 }} />
              ) : (
                <ArrowDownOutlined style={{ color: 'red', fontSize: 16 }} />
              )}
              <Text style={{ color: trend === 'up' ? 'green' : 'red', marginLeft: 8 }}>
                {trendValue}
              </Text>
              {/* <br />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                From prev. period
              </Text> */}
            </Flex>
          </Col>

          <Col>
            <Progress
              type="circle"
              percent={retention}
              width={80}
              strokeColor={strokeColor}
              trailColor="#E8EDF3"
              strokeWidth={10}
              format={() => `${retention}%`}
            />
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};
