import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

export const FinancialSummary = ({ totalAmount, totalPayable }: any) => (
  <Card size="small" title={<span><DollarOutlined /> Summary</span>}>
    <Row gutter={[8, 8]}>
      <Col span={12}>
        <Statistic
          title="Amount of the Year"
          value={totalAmount}
          prefix="$"
          precision={2}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title="Total Payable"
          value={totalPayable}
          prefix="$"
          precision={2}
        />
      </Col>
    </Row>
  </Card>
);