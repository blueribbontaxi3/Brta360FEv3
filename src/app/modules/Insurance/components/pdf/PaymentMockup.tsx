import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Card,
    Typography,
    List,
    QRCode,
    Space,
    Divider,
    Table,
    Tag,
    Popover
} from "antd";
import { calculateMonthlyData } from 'utils/paymentCalculator';

const { Text, Title } = Typography;

const typeColorMap: any = {
    liability: "blue",
    workmanComp: "green",
    collision: "volcano",
    affiliation: "purple",
    paceProgram: "gold",
};

const typeLabelMap: any = {
    liability: "Liability",
    workmanComp: "Workman Comp",
    collision: "Collision",
    affiliation: "Affiliation",
    paceProgram: "Pace Program",
};

const PaymentCard = ({ calculationSummary, statusBorderColor, insuranceItemPaymentData = [] }: any) => (
    <Table
        columns={[
            {
                title: <Text style={{ color: 'white' }}>Month</Text>,
                dataIndex: "month",
                width: 100,
                align: "center",
                key: "month",
                render: (text: any) => <Text strong>{text}</Text>,
            },
            // ... (your details column, if needed)
            {
                title: <Text style={{ color: 'white' }}>Total</Text>,
                dataIndex: "totalAmounts",
                key: "totalAmounts",
                align: "right",
                width: 100,
                render: (amount: any) => (
                    <Text strong>${Number(amount).toFixed(2)}</Text>
                ),
            },
            {
                title: <Text style={{ color: 'white' }}>Payment Status</Text>,
                dataIndex: "month",
                key: "paymentStatus",
                align: "center",
                width: 120,
                render: (month: string) => {
                    // Check if this month exists in insuranceItemPaymentData
                    const isPaid = insuranceItemPaymentData.some(
                        (item: any) => item.month == month
                    );
                    return isPaid ? (
                        <Tag color="green">Paid</Tag>
                    ) : (
                        <Tag color="red">Due</Tag>
                    );
                },
            },
        ]}
        dataSource={calculationSummary
            .filter((m: any) => Number(m.months.totalAmounts) > 0)
            .map((m: any, idx: number) => ({
                key: idx,
                month: m.months.month,
                items: m.months.items,
                totalAmounts: m.months.totalAmounts,
            }))
        }
        pagination={false}
        size="small"
        bordered
        components={{
            header: {
                cell: (props: any) => (
                    <th {...props} style={{ backgroundColor: statusBorderColor, color: 'white' }} />
                ),
            },
        }}
    />
);

const PaymentInfo = ({ data, statusBorderColor }: any) => {
    // Example dynamic fields, adjust as per your data structure
    const memberId = data?.corporation?.member?.id || '-';
    const dueDate = data?.effectiveDate || '-';
    const amountDue = data?.totalPayableAmount ? `$${Number(data.totalPayableAmount).toLocaleString()}` : '-';
    const amountPaying = data?.totalPayableAmount ? `$${Number(data.totalPayableAmount).toLocaleString()}` : '-';

    return (
        <Card
            bordered
            style={{ borderColor: statusBorderColor, borderRadius: 8 }}
        >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Text>
                    <Text strong>Member ID #: </Text>{memberId}
                </Text>
                <Text>
                    <Text strong>Due Date: </Text>{dueDate}
                </Text>
                <Text>
                    <Text strong>Amount Due by {dueDate}: </Text>{amountDue}
                </Text>
                <Text>
                    <Text strong>Amount I am paying: </Text>{amountPaying}
                </Text>
                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                <Row gutter={[16, 16]} align="middle" wrap={false}>
                    <Col flex="auto">
                        Pay online at <Text underline>epay.br360.com</Text> or scan. We
                        accept Visa, Mastercard, American Express, Discover, Apple Pay, and
                        eCheck.
                    </Col>
                    <Col>
                        <QRCode value="https://epay.br360.com" size={60} style={{ padding: 0 }} />
                    </Col>
                </Row>
            </Space>
        </Card>
    );
};

const PaymentFooter = () => (
    <Space direction="vertical" size={0} align="end" style={{ width: '100%' }}>
        <Text strong>Make check payable to:</Text>
        <Text>Blue Ribbon Services</Text>
        <Text>4020 W. Glenlake Avenue</Text>
        <Text>Chicago, IL 60646-5201</Text>
    </Space>
);

const PaymentMockup = (props: any) => {
    const { insuranceItemPaymentData } = props;
    const [calculationSummary, setCalculationSummary]: any = useState([]);
    const [totalPayableAmount, setTotalPayableAmount]: any = useState(0);

    useEffect(() => {
        const calculate = async () => {
            let allCoverageItems: any[] = props?.data?.insuranceCoverage;
            console.log("allCoverageItems", allCoverageItems)
            if (allCoverageItems.length === 0) return;

            // Step 2: Calculate monthly breakdowns
            const calculations = await Promise.all(
                allCoverageItems.map(async (item: any) => {
                    const monthlyData = await calculateMonthlyData({
                        startDate: item.startDate,
                        endDate: item.endDate,
                        amount: item.totalAmount,
                    });

                    return monthlyData.map((i: any) => ({
                        ...i,
                        type: item?.type,
                    }));
                })
            );
            console.log("calculations", calculations)

            const flattened = calculations.flat();
            const groupedByMedallion: any = {};
            flattened.forEach(item => {
                const month = item.month;
                const typeKey = item.type?.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '') || 'Unknown';
                if (!groupedByMedallion[month]) {
                    groupedByMedallion[month] = {
                        month,
                        items: [],
                        typeTotals: {},
                        totalAmounts: 0,
                    };
                }

                // Add item
                groupedByMedallion[month].items.push(item);

                // Sum payableAmount per type
                if (!groupedByMedallion[month].typeTotals[typeKey]) {
                    groupedByMedallion[month].typeTotals[typeKey] = 0;
                }
                groupedByMedallion[month].typeTotals[typeKey] += item.payableAmount || 0;
                groupedByMedallion[month].totalAmounts += item.payableAmount || 0;


            });

            const result = Object.entries(groupedByMedallion).map(([medallionNumber, months]: any) => ({
                months: months, // convert month objects to array
            }));
            setCalculationSummary(result);
            // Step 5: Total sum
            const totalPayableAmountSum = flattened.reduce(
                (sum, item) => sum + (item.payableAmount || 0),
                0
            );

            setTotalPayableAmount(totalPayableAmountSum);
        };

        calculate();
    }, [props?.data]);

    return (
        <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Row gutter={24}>
                <Col xs={12} md={12}>
                    <PaymentCard calculationSummary={calculationSummary} statusBorderColor={props?.statusBorderColor} insuranceItemPaymentData={insuranceItemPaymentData} />
                </Col>
                <Col
                    xs={12}
                    md={12}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        minHeight: "508px",
                    }}
                >
                    <PaymentInfo data={props?.data} statusBorderColor={props?.statusBorderColor} />
                    <PaymentFooter />
                </Col>
            </Row>
        </Space>
    );
};
export default PaymentMockup;
