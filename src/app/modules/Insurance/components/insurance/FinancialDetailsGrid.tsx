import React from 'react';
import { Col, Row } from 'antd';
import { FinancialCard } from './FinancialCard';
import { DiscountInfo } from './Discount';
import { AffiliationCard } from './AffiliationCard';




interface FinancialDetailsGridProps {
  affiliationPrices: any;
  affiliationCalculationPrices: any[];
  liabilityCalculationPrices: any[];
  workmanCalculation: any,
  collisionCalculation: any,
  medallionNumberSingleData: any,
  paceProgramCalculation: any
}

export const FinancialDetailsGrid = ({
  affiliationPrices,
  affiliationCalculationPrices = [],
  liabilityCalculationPrices = [],
  workmanCalculation = {},
  collisionCalculation = {},
  paceProgramCalculation = {},
  medallionNumberSingleData = {}
}: FinancialDetailsGridProps) => {
  const daysCount = affiliationCalculationPrices?.reduce((sum, item) => sum + item.payableDaysCount, 0) || 0;
  const getPayableAmount = (prices: any[]) => prices?.reduce((sum, item) => sum + item.payableAmount, 0) || 0;

  return (
    <Row gutter={[8, 8]} justify={'space-around'}>
      <Col xs={24} sm={12} md={8} lg={8} xl={4}>
        <DiscountInfo data={medallionNumberSingleData} />
      </Col>
      <Col xs={24} sm={12} md={8} lg={8} xl={4}>
        <FinancialCard
          title="Liability"
          amount={affiliationPrices?.liability?.sellingPrice || 0}
          payableAmount={getPayableAmount(liabilityCalculationPrices)}
          daysCount={daysCount}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={8} xl={4}>
        <AffiliationCard
          title="Affiliation"
          amount={affiliationPrices?.affiliation?.sellingPrice || 0}
          payableAmount={getPayableAmount(affiliationCalculationPrices)}
          daysCount={daysCount}
          medallionNumberSingleData={medallionNumberSingleData}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={8} xl={4}>
        <FinancialCard
          title="Workman Comp"
          amount={workmanCalculation?.totalAmount || 0}
          payableAmount={workmanCalculation?.totalPayableAmount}
          daysCount={workmanCalculation?.daysCount || 0}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={8} xl={4}>
        <FinancialCard
          title="Collision"
          amount={collisionCalculation?.totalAmount || 0}
          payableAmount={collisionCalculation?.totalPayableAmount}
          daysCount={collisionCalculation?.daysCount || 0}
        />
      </Col>
      {medallionNumberSingleData?.corporation?.isCmg == false && <Col xs={24} sm={12} md={8} lg={8} xl={4}>
        <FinancialCard
          title="Pace Program"
          amount={paceProgramCalculation?.totalAmount || 0}
          payableAmount={paceProgramCalculation?.totalPayableAmount}
          daysCount={paceProgramCalculation?.daysCount || 0}
        />
      </Col>}

    </Row>
  );
};