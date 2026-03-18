import React, { useState, useEffect } from 'react';
import {
    Modal,
    Button,
    Space,
    Spin,
    Typography,
    Tabs,
    Table,
    Card,
    Row,
    Col,
    Statistic,
    Tag,
    message,
    Tooltip,
    Divider,
    Progress,
} from 'antd';
import {
    CalculatorOutlined,
    RiseOutlined,
    FallOutlined,
    ReloadOutlined,
    PrinterOutlined,
    SafetyCertificateOutlined,
    BankOutlined,
    TeamOutlined,
    CarOutlined,
} from '@ant-design/icons';
import { usdFormat } from 'utils/helper';
import axiosService from 'utils/axiosInceptor';

const { Text, Title } = Typography;

interface CalculateBalanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    insuranceId: number;
    medallionNumber?: number;
}

const CalculateBalanceModal: React.FC<CalculateBalanceModalProps> = ({
    isOpen,
    onClose,
    insuranceId,
    medallionNumber,
}) => {
    const [balanceData, setBalanceData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Fetch balance data when modal opens
    useEffect(() => {
        if (isOpen && insuranceId) {
            fetchBalanceData();
        }
    }, [isOpen, insuranceId]);

    const fetchBalanceData = async () => {
        setLoading(true);
        try {
            const response = await axiosService.get(`/insurances/calculate/balance/${insuranceId}`);
            setBalanceData(response.data?.data);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            message.error('Failed to fetch balance data!');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setBalanceData(null);
        onClose();
    };

    const handlePrint = () => {
        window.print();
    };

    // Monthly table columns with enhanced styling
    const monthlyColumns = [
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            width: 120,
            render: (val: string, record: any) => (
                <Text strong={record.payableAmount > 0}>{val}</Text>
            )
        },
        {
            title: '💰 Cost',
            dataIndex: 'costAmount',
            key: 'costAmount',
            align: 'right' as const,
            render: (val: number) => (
                <Text type="danger" >
                    {usdFormat(val)}
                </Text>
            )
        },
        {
            title: '💵 Sell',
            dataIndex: 'sellAmount',
            key: 'sellAmount',
            align: 'right' as const,
            render: (val: number) => (
                <Text type="success" >
                    {usdFormat(val)}
                </Text>
            )
        },
        {
            title: 'Net',
            dataIndex: 'profit',
            key: 'profit',
            align: 'right' as const,
            render: (val: number) => (
                <Tag
                    color={val >= 0 ? 'success' : 'error'}
                    style={{ minWidth: 90, textAlign: 'right' }}
                >
                    {val >= 0 ? '+' : ''}{usdFormat(val)}
                </Tag>
            )
        },
    ];

    // Prepare monthly data for a category
    const prepareMonthlyData = (monthlyCost: any[], monthlySell: any[]) => {
        return monthlyCost.map((cost: any, index: number) => {
            const sell = monthlySell[index];
            return {
                key: cost.key,
                month: cost.month,
                costAmount: cost.payableAmount,
                sellAmount: sell?.payableAmount || 0,
                profit: (sell?.payableAmount || 0) - cost.payableAmount,
            };
        });
    };

    // Calculate totals for monthly data
    const calculateTotals = (monthlyData: any[]) => {
        return monthlyData.reduce((acc, item) => ({
            costAmount: acc.costAmount + item.costAmount,
            sellAmount: acc.sellAmount + item.sellAmount,
            profit: acc.profit + item.profit,
        }), { costAmount: 0, sellAmount: 0, profit: 0 });
    };

    // Calculate profit margin percentage
    const calculateProfitMargin = (sell: number, cost: number) => {
        if (cost === 0) return 0;
        return ((sell - cost) / cost) * 100;
    };

    // Render category tab content
    const renderCategoryTab = (category: any) => {
        if (!category) return <Text type="secondary">No data</Text>;

        const monthlyData = prepareMonthlyData(category.monthlyCost || [], category.monthlySell || []);
        const totals = calculateTotals(monthlyData);
        const profitMargin = calculateProfitMargin(category.sell, category.cost);

        return (
            <>
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Card size="small" hoverable>
                            <Statistic
                                title="Payable"
                                value={category.cost}
                                precision={2}
                                prefix="$"
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" hoverable>
                            <Statistic
                                title="Receivables"
                                value={category.sell}
                                precision={2}
                                prefix="$"
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" hoverable>
                            <Statistic
                                title="Net"
                                value={category.sell - category.cost}
                                precision={2}
                                prefix={category.sell - category.cost >= 0 ? '+$' : '$'}
                                valueStyle={{ color: category.sell - category.cost >= 0 ? '#3f8600' : '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" hoverable>
                            <Statistic
                                title="Net Margin"
                                value={profitMargin}
                                precision={1}
                                suffix="%"
                                prefix={profitMargin >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                valueStyle={{ color: profitMargin >= 0 ? '#3f8600' : '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Table
                    columns={monthlyColumns}
                    dataSource={monthlyData}
                    pagination={false}
                    size="small"
                    bordered
                    rowClassName={(record) => record.costAmount === 0 ? 'inactive-row' : ''}
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row style={{ background: '#fafafa' }}>
                                <Table.Summary.Cell index={0}>
                                    <strong>📊 Total</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">
                                    <Text type="danger" strong >
                                        {usdFormat(totals.costAmount)}
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} align="right">
                                    <Text type="success" strong >
                                        {usdFormat(totals.sellAmount)}
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align="right">
                                    <Tag
                                        color={totals.profit >= 0 ? 'success' : 'error'}
                                    >
                                        {totals.profit >= 0 ? '+' : ''}{usdFormat(totals.profit)}
                                    </Tag>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </>
        );
    };

    // Render Total tab - combines all categories
    const renderTotalTab = (details: any) => {
        if (!details) return <Text type="secondary">No data</Text>;

        const categories = ['affiliation', 'liability', 'workman', 'collision'];
        const categoryLabels: any = {
            affiliation: { label: 'Affiliation', icon: <BankOutlined />, color: '#1890ff' },
            liability: { label: 'Liability', icon: <SafetyCertificateOutlined />, color: '#722ed1' },
            workman: { label: 'Workman Comp', icon: <TeamOutlined />, color: '#fa8c16' },
            collision: { label: 'Collision', icon: <CarOutlined />, color: '#52c41a' },
        };
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        // Combine all monthly data from all categories
        const combinedMonthlyData = months.map((month, index) => {
            let totalCost = 0;
            let totalSell = 0;

            categories.forEach(cat => {
                const category = details[cat];
                if (category?.monthlyCost?.[index]) {
                    totalCost += category.monthlyCost[index].payableAmount || 0;
                }
                if (category?.monthlySell?.[index]) {
                    totalSell += category.monthlySell[index].payableAmount || 0;
                }
            });

            return {
                key: (index + 1).toString(),
                month,
                costAmount: totalCost,
                sellAmount: totalSell,
                profit: totalSell - totalCost,
            };
        });

        const totals = calculateTotals(combinedMonthlyData);

        // Calculate grand totals from all categories
        const grandTotalCost = categories.reduce((sum, cat) => sum + (details[cat]?.cost || 0), 0);
        const grandTotalSell = categories.reduce((sum, cat) => sum + (details[cat]?.sell || 0), 0);
        const grandProfit = grandTotalSell - grandTotalCost;
        const profitMargin = calculateProfitMargin(grandTotalSell, grandTotalCost);

        return (
            <>
                {/* Category Breakdown Summary */}
                <Divider orientation="left">Category Breakdown</Divider>
                <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                    {categories.map(cat => {
                        const category = details[cat];
                        if (!category) return null;
                        const profit = category.sell - category.cost;
                        const catInfo = categoryLabels[cat];

                        return (
                            <Col span={6} key={cat}>
                                <Card
                                    size="small"
                                    hoverable
                                    style={{ borderTop: `3px solid ${catInfo.color}` }}
                                >
                                    <Space direction="vertical" size={0} style={{ width: '100%' }}>
                                        <Text type="secondary">
                                            {catInfo.icon} {catInfo.label}
                                        </Text>
                                        <Row justify="space-between">
                                            <Text type="danger" style={{ fontSize: 12 }}>
                                                Cost: {usdFormat(category.cost)}
                                            </Text>
                                        </Row>
                                        <Row justify="space-between">
                                            <Text type="success" style={{ fontSize: 12 }}>
                                                Sell: {usdFormat(category.sell)}
                                            </Text>
                                        </Row>
                                        <Tag
                                            color={profit >= 0 ? 'success' : 'error'}
                                            style={{ marginTop: 4 }}
                                        >
                                            Net: {profit >= 0 ? '+' : ''}{usdFormat(profit)}
                                        </Tag>
                                    </Space>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {/* Grand Totals */}
                <Divider orientation="left">Grand Totals</Divider>
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Card size="small" style={{ background: '#fff1f0', borderColor: '#ffa39e' }} hoverable>
                            <Statistic
                                title="Grand Payable"
                                value={grandTotalCost}
                                precision={2}
                                prefix="$"
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }} hoverable>
                            <Statistic
                                title="Grand Receivables"
                                value={grandTotalSell}
                                precision={2}
                                prefix="$"
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" style={{
                            background: grandProfit >= 0 ? '#f6ffed' : '#fff1f0',
                            borderColor: grandProfit >= 0 ? '#b7eb8f' : '#ffa39e'
                        }} hoverable>
                            <Statistic
                                title="Grand Net"
                                value={grandProfit}
                                precision={2}
                                prefix={grandProfit >= 0 ? '+$' : '$'}
                                valueStyle={{ color: grandProfit >= 0 ? '#3f8600' : '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small" hoverable>
                            <Statistic
                                title="Net Margin"
                                value={profitMargin}
                                precision={1}
                                suffix="%"
                                prefix={profitMargin >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                valueStyle={{ color: profitMargin >= 0 ? '#3f8600' : '#cf1322' }}
                            />
                            <Progress
                                percent={Math.min(Math.abs(profitMargin), 100)}
                                size="small"
                                status={profitMargin >= 0 ? 'success' : 'exception'}
                                showInfo={false}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Monthly Breakdown Table */}
                <Divider orientation="left">Monthly Breakdown</Divider>
                <Table
                    columns={monthlyColumns}
                    dataSource={combinedMonthlyData}
                    pagination={false}
                    size="small"
                    bordered
                    rowClassName={(record) => record.costAmount === 0 ? 'inactive-row' : ''}
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row style={{ background: '#fafafa' }}>
                                <Table.Summary.Cell index={0}>
                                    <strong>📊 Total</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">
                                    <Text type="danger" strong >
                                        {usdFormat(totals.costAmount)}
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} align="right">
                                    <Text type="success" strong >
                                        {usdFormat(totals.sellAmount)}
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align="right">
                                    <Tag
                                        color={totals.profit >= 0 ? 'success' : 'error'}
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {totals.profit >= 0 ? '+' : ''}{usdFormat(totals.profit)}
                                    </Tag>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </>
        );
    };

    return (
        <Modal
            title={
                <Row justify="space-between" align="middle" style={{ paddingRight: 24 }}>
                    <Space>
                        <span>Balance Calculation</span>
                        <Tag color="blue">Medallion #{balanceData?.medallionNumber || medallionNumber}</Tag>
                    </Space>
                    {/* <Space>
                        <Tooltip title="Refresh Data">
                            <Button
                                icon={<ReloadOutlined spin={loading} />}
                                size="small"
                                onClick={fetchBalanceData}
                                disabled={loading}
                            />
                        </Tooltip>
                        <Tooltip title="Print">
                            <Button
                                icon={<PrinterOutlined />}
                                size="small"
                                onClick={handlePrint}
                                disabled={!balanceData}
                            />
                        </Tooltip>
                    </Space> */}
                </Row>
            }
            open={isOpen}
            onCancel={handleClose}
            footer={[
                <Button key="close" onClick={handleClose}>
                    Close
                </Button>
            ]}
            width={1000}
            styles={{ body: { maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' } }}
        >
            <Spin spinning={loading} tip="Calculating balance...">
                {balanceData ? (
                    <>
                        {/* Summary Section */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card size="small" style={{ background: '#fff7e6', borderColor: '#ffd591' }} hoverable>
                                    <Statistic
                                        title="Year"
                                        value={balanceData?.year}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card size="small" style={{ background: '#fff1f0', borderColor: '#ffa39e' }} hoverable>
                                    <Statistic
                                        title="Payable"
                                        value={balanceData?.costPrice}
                                        precision={2}
                                        prefix="$"
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }} hoverable>
                                    <Statistic
                                        title="Receivables"
                                        value={balanceData?.sellPrice}
                                        precision={2}
                                        prefix="$"
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    size="small"
                                    style={{
                                        background: balanceData?.balance >= 0 ? '#f6ffed' : '#fff1f0',
                                        borderColor: balanceData?.balance >= 0 ? '#b7eb8f' : '#ffa39e'
                                    }}
                                    hoverable
                                >
                                    <Statistic
                                        title={balanceData?.balance >= 0 ? 'Net' : 'Loss'}
                                        value={balanceData?.balance}
                                        precision={2}
                                        prefix={balanceData?.balance >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                        suffix="$"
                                        valueStyle={{
                                            color: balanceData?.balance >= 0 ? '#3f8600' : '#cf1322',
                                        }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Category Tabs */}
                        <Tabs
                            defaultActiveKey="total"
                            type="card"
                            items={[
                                {
                                    key: 'total',
                                    label: <span><strong>Total Overview</strong></span>,
                                    children: renderTotalTab(balanceData?.details),
                                },
                                {
                                    key: 'affiliation',
                                    label: <span><BankOutlined /> Affiliation</span>,
                                    children: renderCategoryTab(balanceData?.details?.affiliation),
                                },
                                {
                                    key: 'liability',
                                    label: <span><SafetyCertificateOutlined /> Liability</span>,
                                    children: renderCategoryTab(balanceData?.details?.liability),
                                },
                                {
                                    key: 'workman',
                                    label: <span><TeamOutlined /> Workman</span>,
                                    children: renderCategoryTab(balanceData?.details?.workman),
                                },
                                {
                                    key: 'collision',
                                    label: <span><CarOutlined /> Collision</span>,
                                    children: renderCategoryTab(balanceData?.details?.collision),
                                },
                            ]}
                        />
                    </>
                ) : (
                    !loading && <Text type="secondary">No data available</Text>
                )}
            </Spin>
        </Modal>
    );
};

export default CalculateBalanceModal;
