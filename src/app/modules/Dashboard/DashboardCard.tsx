import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Progress, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import axios from '../../../utils/axiosInceptor';
import { usdFormat } from 'utils/helper';

const { Title, Text } = Typography;


export const DashboardCard: React.FC<any> = ({
  title,
  value,
  percentage,
  trend,
  trendValue,
  color,
}) => {

  const [loading, setLoading] = useState(false);


  return (
    <Card size='small' title={title} >
      <Spin spinning={loading} tip="Loading...">
        <Row justify="space-between" align="top">
          <Col>
            <Title level={3} style={{ marginTop: 0, marginBottom: 16 }}>
              {value}
            </Title>
            {trend && <Row align="middle">
              {trend === 'up' ? (
                <ArrowUpOutlined style={{ color: 'green', fontSize: 16 }} />
              ) : (
                <ArrowDownOutlined style={{ color: 'red', fontSize: 16 }} />
              )}
              <Text style={{ color: trend === 'up' ? 'green' : 'red', marginLeft: 8 }}>
                {trendValue}
              </Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                From previous period
              </Text>
            </Row>}

          </Col>

          {
            percentage && <Col>
              <Progress
                type="circle"
                percent={percentage}
                width={80}
                strokeColor={color}
                trailColor="#E8EDF3"
                strokeWidth={10}
                format={() => `${percentage}%`}
              />
            </Col>
          }
        </Row>
      </Spin>

    </Card>
  );
};
