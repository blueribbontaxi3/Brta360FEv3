import React from 'react';
import { Tabs } from 'antd';
import { CumulativePaymentChart } from './charts/CumulativePaymentChart';
import { DailyDistributionChart } from './charts/DailyDistributionChart';
import { DaysDistributionChart } from './charts/DaysDistributionChart';
import { MonthlyAmountChart } from './charts/MonthlyAmountChart';
import { MonthlyDistributionChart } from './charts/MonthlyDistributionChart';
import { PaymentComparisonChart } from './charts/PaymentComparisonChart';
import { PaymentDistributionChart } from './charts/PaymentDistributionChart';
import { PaymentDistributionComparisonChart } from './charts/PaymentDistributionComparisonChart';
import { PaymentEfficiencyChart } from './charts/PaymentEfficiencyChart';
import { PaymentForecastChart } from './charts/PaymentForecastChart';
import { PaymentHeatmap } from './charts/PaymentHeatmap';
import { PaymentKPIChart } from './charts/PaymentKPIChart';
import { PaymentMetricsChart } from './charts/PaymentMetricsChart';
import { PaymentProgressChart } from './charts/PaymentProgressChart';
import { PaymentSummaryChart } from './charts/PaymentSummaryChart';
import { PaymentTrendsChart } from './charts/PaymentTrendsChart';
import { TotalAmountsChart } from './charts/TotalAmountsChart';

export const PaymentCharts: React.FC<any> = ({ data }) => {
  const { TabPane } = Tabs;

  return (
    <div style={{ marginTop: 16 }}>
      <Tabs defaultActiveKey="1" type="card">
        {/* KPI Dashboard */}
        <TabPane tab="KPI Dashboard" key="1">
          <PaymentKPIChart data={data} />
        </TabPane>

        {/* Forecast and Efficiency */}
        <TabPane tab="Forecast & Efficiency" key="2">
          <PaymentForecastChart data={data} />
          <PaymentEfficiencyChart data={data} />
        </TabPane>

        {/* Distribution Analysis */}
        <TabPane tab="Distribution Analysis" key="3">
          <PaymentDistributionComparisonChart data={data} />
          <PaymentDistributionChart data={data} />
          <DaysDistributionChart data={data} />
        </TabPane>

        {/* Trends and Progress */}
        <TabPane tab="Trends & Progress" key="4">
          <PaymentTrendsChart data={data} />
          <CumulativePaymentChart data={data} />
          <PaymentProgressChart data={data} />
        </TabPane>

        {/* Daily and Monthly Analysis */}
        <TabPane tab="Daily & Monthly Analysis" key="5">
          <DailyDistributionChart data={data} />
          <MonthlyAmountChart data={data} />
          <MonthlyDistributionChart data={data} />
        </TabPane>

        {/* Metrics and Summary */}
        <TabPane tab="Metrics & Summary" key="6">
          <PaymentMetricsChart data={data} />
          <TotalAmountsChart data={data} />
          <PaymentSummaryChart data={data} />
        </TabPane>

        {/* Heatmaps and Comparisons */}
        <TabPane tab="Heatmaps & Comparisons" key="7">
          <PaymentHeatmap data={data} />
          <PaymentComparisonChart data={data} />
        </TabPane>
      </Tabs>
    </div>
  );
};
