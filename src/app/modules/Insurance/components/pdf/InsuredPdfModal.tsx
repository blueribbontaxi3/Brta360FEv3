import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Modal, Button, Typography, Divider, Col, Card, Tag, Row } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import Logo from '../../../../../assets/logo.png';
import CMG from '../../../../../assets/cmg.svg';
import BalanceSummaryCard from './BalanceSummaryCard';
import StatementOfService from './StatementOfService';
import PaymentMockup from './PaymentMockup';
import { calculateMonthlyData } from 'utils/paymentCalculator';
import ReactToPrint, { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import axios from "../../../../../utils/axiosInceptor";

const { Title, Paragraph } = Typography;

// Status color mapping
const statusColorMap: any = {
  insured: 'success',
  surrender: 'error',
  request: 'gold',
};

const statusLabelMap: any = {
  insured: 'Insured',
  surrender: 'Surrender',
  request: 'Request',
};

const statusBorderColorMap: any = {
  insured: '#4caf50',
  surrender: '#ff4d4f',
  request: '#faad14',
};

const InsuredPdfModal = (props: any) => {
  const { data, pdfModalOpen }: any = props;
  const [loading, setLoading] = useState(false);
  const [insuranceItemPaymentData, setInsuranceItemPaymentData] = useState([]);
  const isCmg = data?.corporation?.isCmg || false;
  const componentRef: any = useRef<HTMLDivElement>(null);

  const fetchInsurancePaymentItem = () => {

    setLoading(true);
    axios
      .get(`insurances/payment-items/${data?.id}`)
      .then((res: any) => {
        const data = res?.data?.data?.items || [];
        console.log("Insurance Payment Data:", data);
        setInsuranceItemPaymentData(data);
      })
      .catch(() => {
        // Handle error notification
      })
      .finally(() => setLoading(false));
  };



  const handlePrint = useReactToPrint({
    contentRef: componentRef, // use `contentRef` instead of `content`
    documentTitle: "Payment Info",
  });
  // Status color and label
  const status = data?.status || 'insured';
  const statusColor = statusColorMap[status] || 'default';
  const statusLabel = statusLabelMap[status] || status;
  const statusBorderColor = statusBorderColorMap[status] || '#4caf50';

  const today = dayjs();
  let nextMonthDue = 0;
  let nextMonthLabel = '-'

  useEffect(() => {
    if (data?.id) {
      fetchInsurancePaymentItem();
    }
  }, [data]);

  // Calculation logic (useMemo for performance)
  const { calculationSummary, totalPayable, lessCurrentMonth, balanceOwed } = useMemo(() => {

    let allCoverageItems: any[] = data?.insuranceCoverage || [];
    if (!allCoverageItems.length) {
      return {
        calculationSummary: [],
        totalPayable: 0,
        lessCurrentMonth: 0,
        balanceOwed: 0,
      };
    }

    // Step 2: Calculate monthly breakdowns
    // NOTE: calculateMonthlyData must be a synchronous function or you need to handle async with useEffect+state
    const calculations = allCoverageItems.map((item: any) => {
      const monthlyData = calculateMonthlyData({
        startDate: item.startDate,
        endDate: item.endDate,
        amount: item.totalAmount,
      });

      return monthlyData.map((i: any) => ({
        ...i,
        type: item?.type,
        payableAmount: i.payableAmount,
      }));
    });

    const flattened = calculations.flat();
    const groupedByMonth: any = {};
    flattened.forEach(item => {
      const month = item.month;
      const typeKey = item.type?.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '') || 'Unknown';
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = {
          month,
          items: [],
          typeTotals: {},
          totalAmounts: 0,
        };
      }

      // Add item
      groupedByMonth[month].items.push(item);

      // Sum payableAmount per type
      if (!groupedByMonth[month].typeTotals[typeKey]) {
        groupedByMonth[month].typeTotals[typeKey] = 0;
      }
      groupedByMonth[month].typeTotals[typeKey] += item.payableAmount || 0;
      groupedByMonth[month].totalAmounts += item.payableAmount || 0;
    });

    const result = Object.entries(groupedByMonth).map(([month, months]: any) => ({
      months: months,
    }));

    // Only months with totalAmounts > 0
    const filteredResult = result.filter((m: any) => Number(m.months.totalAmounts) > 0);

    const totalPayable = filteredResult.reduce((sum, m) => sum + Number(m.months.totalAmounts || 0), 0);
    const lessCurrentMonth = filteredResult[0]?.months?.totalAmounts || 0;
    const balanceOwed = totalPayable - lessCurrentMonth;

    return {
      calculationSummary: filteredResult,
      totalPayable,
      lessCurrentMonth,
      balanceOwed,
    };
  }, [data]);

  if (calculationSummary.length > 0) {
    // Find the first month after today
    const nextMonthObj = calculationSummary.find((m: any) => {
      // m.months.items[0]?.startDate format: "YYYY-MM-DD" or "MM-DD-YYYY"
      const item = m.months.items[0];
      if (!item) return false;
      // Try both formats
      const start = dayjs(item.startDate, ["YYYY-MM-DD", "MM-DD-YYYY"]);
      return start.isAfter(today, "month");
    });

    if (nextMonthObj) {
      nextMonthDue = nextMonthObj.months.totalAmounts || 0;
      nextMonthLabel = nextMonthObj.months.month || '-';
    }
  }

  return (
    <>

      <Modal
        open={pdfModalOpen}
        onCancel={() => props?.modalProps({ pdfModalOpen: false, data: null })}
        footer={<Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print Payment Info
        </Button>}
        centered
        closable={true}
        width="60vw"
        style={{
          top: 0,
          padding: 0,
          height: '99vh',
        }}
        styles={{
          body: {
            height: '93vh',
            overflow: 'auto',
          }
        }}
      >

        <div
          ref={componentRef}
          className="print-area"
          style={{
            background: '#fff',
            padding: 15,
            margin: '15px',
            border: `10px solid ${statusBorderColor}`,
            borderRadius: 10,
          }}
        >
          <Row align="middle" justify="space-between">
            <img src={Logo} style={{ width: 80 }} />
            <div>
              <Title level={2} style={{ color: statusBorderColor, margin: 0 }}>
                <Tag color={statusColor} style={{ fontSize: 16, marginRight: 8 }}>
                  {statusLabel}
                </Tag>
                {data?.medallionNumber ? `Medallion #${data.medallionNumber}` : ''}
              </Title>
            </div>
            <div />
            {
              isCmg && <img src={CMG} style={{ width: 80 }} />
            }

          </Row>

          <Divider style={{ marginTop: 5, marginBottom: 15 }} />
          <Row gutter={24}>
            <Col span={12}>
              <BalanceSummaryCard
                data={data}
                lessCurrentMonth={lessCurrentMonth}
                balanceOwed={balanceOwed}
                totalPayable={totalPayable}
                nextMonthDue={nextMonthDue}
                nextMonthLabel={nextMonthLabel}
              />
            </Col>
            <Col span={12}>
              <StatementOfService statusBorderColor={statusBorderColor} />
            </Col>
          </Row>

          <Row gutter={24} style={{ marginTop: 10 }}>
            <Col span={24}>
              <Card
                size="small"
                bordered
                style={{ borderColor: statusBorderColor, borderRadius: 8 }}
                styles={{
                  body: {
                    padding: 5
                  }
                }}
              >
                <Typography>
                  <Title level={4} style={{ margin: 0 }}>Important information</Title>
                  <Paragraph style={{ marginTop: 8, marginBottom: 0 }} >
                    Thank you for choosing Blue Ribbon for your service needs. The amount due reflects current member responsibility as of the statement date and does not include any service that are still pending with the affiliation or its related entities.
                  </Paragraph>
                </Typography>
              </Card>
            </Col>
          </Row>

          <Divider variant='dashed' dashed style={{
            borderWidth: 1,
            borderColor: 'black',
          }} />

          <PaymentMockup
            data={data}
            calculationSummary={calculationSummary}
            statusBorderColor={statusBorderColor}
            insuranceItemPaymentData={insuranceItemPaymentData}
          />
        </div>
      </Modal>
    </>
  );
};

export default InsuredPdfModal;
