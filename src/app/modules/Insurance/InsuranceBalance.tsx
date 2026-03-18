import React, { useState } from 'react';
import { Card, Button, Space, Typography, message, Row, Col, Form, Spin, Divider, Statistic, Table, Tag, Badge, Modal, Radio, Input, Popover } from 'antd';
import { SearchOutlined, CalculatorOutlined, ArrowUpOutlined, ArrowDownOutlined, WarningOutlined, EyeOutlined } from '@ant-design/icons';
import { useForm } from "react-hook-form";
import MedallionNumberSelect from '@atoms/MedallionNumberSelect';
import { DateField, SelectField, RangePickerField } from '@atoms/FormElement';
import axios from '../../../utils/axiosInceptor';
import dayjs from 'dayjs';
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { usdFormat } from 'utils/helper';
import MedallionNumberTag from '@atoms/MedallionNumberTag';

const { Title, Text } = Typography;

const InsuranceBalance = () => {
    const [loading, setLoading] = useState(false);
    const [medallionNumberData, setMedallionNumberData] = useState<any[]>([]);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [apiErrors, setApiErrors] = useState<any[]>([]);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [reportType, setReportType] = useState<'yearly' | 'monthly'>('yearly');

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        mode: 'all',
    });

    const [items, setItems] = useState<any[]>([]);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedMonthDetails, setSelectedMonthDetails] = useState<any>({ month: '', data: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');

    const handleCalculate = async (data: any) => {
        setAnalyticsData(null);
        setApiErrors([]);
        setItems([]);

        if ((!data.medallionNumberId || data.medallionNumberId.length === 0) && !data.year) {
            message.warning("Please select at least a Medallion OR a Year");
            return;
        }

        setLoading(true);
        try {
            let params: any = {};

            if (reportType === 'monthly' && data.months && data.months.length > 0) {
                // Multi-select months
                params.months = data.months;
                // Year is optional but helps narrow down results
                if (data.year) {
                    params.year = dayjs(data.year).year();
                }
            } else {
                const year = data.year ? dayjs(data.year).year() : null;
                params.year = year;
            }

            if (data.medallionNumberId && data.medallionNumberId.length > 0) {
                params.medallion_ids = data.medallionNumberId;
            }

            if (data.status && data.status.length > 0) {
                params.status = data.status;
            }

            const response = await axios.get(`insurances/calculate/balances`, { params });
            if (response.data.status === 1) {
                // Adjusting for nested data structure based on user provided JSON
                // JSON: { data: { data: { totals: ... } } }
                const responseData = response.data.data?.data ? response.data.data.data : response.data.data;
                const resultData = responseData?.totals ? responseData.totals : responseData;

                // Set Analytics Data
                setAnalyticsData(resultData);

                // Set Items Data
                if (responseData?.items) {
                    setItems(responseData.items);
                }

                // Set Errors if any
                if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
                    setApiErrors(responseData.errors);
                    message.warning(`${responseData.errors.length} issues found. Please check warnings.`);
                }

            } else {
                message.warning(response.data.message || "No data found");
            }

        } catch (error) {
            console.error("Error fetching analytics:", error);
            message.error("Failed to fetch analytics data");
        } finally {
            setLoading(false);
        }
    };

    const handleViewMonth = (record: any) => {
        const monthName = record.month;
        const monthIndex = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ].indexOf(monthName); // 0-based index

        if (monthIndex === -1) return;

        // Filter items for this month
        const monthlyDetails = items.map((item: any) => {
            if (item.error) return null;

            let itemMonthlyCost = 0;
            let itemMonthlySell = 0;
            let itemMonthlyBalance = 0;

            // Calculate totals for this specific month from details
            if (item.details) {
                ['affiliation', 'liability', 'workman', 'collision'].forEach((cat) => {
                    if (item.details[cat]) {
                        // Monthly arrays in details are like [{key: "1", payableAmount: ...}, ...]
                        // key "1" is January.
                        const findMonthData = (arr: any[]) => arr?.find((m: any) => parseInt(m.key) === monthIndex + 1);

                        const costData = findMonthData(item.details[cat].monthlyCost);
                        const sellData = findMonthData(item.details[cat].monthlySell);

                        if (costData) itemMonthlyCost += (costData.payableAmount || 0);
                        if (sellData) itemMonthlySell += (sellData.payableAmount || 0);
                    }
                });
            }

            itemMonthlyBalance = itemMonthlySell - itemMonthlyCost;

            // Only include if there's activity in this month
            if (itemMonthlyCost === 0 && itemMonthlySell === 0) return null;

            let policyNumbers: any = {};
            if (item.details) {
                if (item.details.liability?.policyNumber) policyNumbers.liability = item.details.liability.policyNumber;
                if (item.details.workman?.policyNumber) policyNumbers.workman = item.details.workman.policyNumber;
                if (item.details.collision?.policyNumber) policyNumbers.collision = item.details.collision.policyNumber;
            }

            return {
                medallionNumber: item.medallionNumber,
                status: item.status,
                isWav: item.isWav,
                month: monthName,
                cost: itemMonthlyCost,
                sell: itemMonthlySell,
                balance: itemMonthlyBalance,
                policyNumbers,
                details: item.details,
            };
        }).filter((i: any) => i !== null);

        setSelectedMonthDetails({
            month: monthName,
            data: monthlyDetails
        });
        setCurrentPage(1);
        setSearchText('');
        setViewModalOpen(true);
    };

    const statusColors: any = {
        "pre_request": "purple",
        "request": "gold",
        "insured": "green",
        "surrender": "error",
        "renew": "cyan"
    };

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 10 }}>
                    <CalculatorOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                    <Title level={3}>Insurance Balance Analytics</Title>
                    <Text type="secondary">View financial analytics by Year and Medallion(s)</Text>

                    {apiErrors.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                            <Button type="primary" danger icon={<WarningOutlined />} onClick={() => setIsErrorModalOpen(true)}>
                                Warnings <Badge count={apiErrors.length} style={{ marginLeft: 5, backgroundColor: '#fff', color: '#f5222d', boxShadow: 'none' }} />
                            </Button>
                        </div>
                    )}
                </div>

                <Modal
                    title={<Space><WarningOutlined style={{ color: '#faad14' }} /> Data Issues Found</Space>}
                    open={isErrorModalOpen}
                    onCancel={() => setIsErrorModalOpen(false)}
                    footer={[
                        <Button key="close" onClick={() => setIsErrorModalOpen(false)}>
                            Close
                        </Button>
                    ]}
                    width={700}
                >
                    <Table
                        dataSource={apiErrors}
                        pagination={false}
                        rowKey={(record) => `${record.insuranceId}-${record.medallionNumber}`}
                        columns={[
                            {
                                title: 'Medallion',
                                dataIndex: 'medallionNumber',
                                key: 'medallionNumber',
                                width: 100,
                            },
                            {
                                title: 'Issue Description',
                                dataIndex: 'error',
                                key: 'error',
                                render: (text: string) => <Text type="warning">{text}</Text>
                            }
                        ]}
                    />
                </Modal>

                <Modal
                    title={`Details for ${selectedMonthDetails.month}`}
                    open={viewModalOpen}
                    onCancel={() => setViewModalOpen(false)}
                    footer={null}
                    width={900}
                >
                    <div style={{ marginBottom: 16 }}>
                        <Input.Search
                            placeholder="Search Medallion, Status, or Policy Number"
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>
                    <Table
                        size="small"
                        dataSource={selectedMonthDetails.data.filter((item: any) => {
                            if (!searchText) return true;
                            const search = searchText.toLowerCase();
                            const matchesMedallion = item.medallionNumber?.toString().toLowerCase().includes(search);
                            const matchesStatus = item.status?.toString().toLowerCase().includes(search);
                            const matchesPolicy = Object.values(item.policyNumbers || {}).some((p: any) => p?.toString().toLowerCase().includes(search));
                            return matchesMedallion || matchesStatus || matchesPolicy;
                        })}
                        rowKey="medallionNumber"
                        pagination={{
                            current: currentPage,
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '15', '100'],
                            onChange: (page) => setCurrentPage(page)
                        }}
                        scroll={{ y: 500 }}
                        columns={[
                            {
                                title: 'Medallion',
                                dataIndex: 'medallionNumber',
                                key: 'medallionNumber',
                                render: (_, record: any) => {
                                    return <MedallionNumberTag medallion={record} />
                                }
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                key: 'status',
                                render: (status: string) => (
                                    <Tag color={statusColors[status] || 'default'}>
                                        {status ? status.toUpperCase().replace('_', ' ') : 'N/A'}
                                    </Tag>
                                )
                            },
                            {
                                title: 'Policy Number',
                                key: 'policyNumbers',
                                width: 250,
                                render: (_, record: any) => (
                                    <div style={{ fontSize: '12px' }}>
                                        {record.policyNumbers?.liability && <div><Text type="secondary">Liability:</Text> <strong>{record.policyNumbers.liability}</strong></div>}
                                        {record.policyNumbers?.workman && <div><Text type="secondary">Workman:</Text> <strong>{record.policyNumbers.workman}</strong></div>}
                                        {record.policyNumbers?.collision && <div><Text type="secondary">Collision:</Text> <strong>{record.policyNumbers.collision}</strong></div>}
                                    </div>
                                )
                            },
                            {
                                title: 'Yearly Overview',
                                key: 'yearlyOverview',
                                align: 'center',
                                render: (_, record: any) => {
                                    const content = (
                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            <Table
                                                size="small"
                                                dataSource={Array.from({ length: 12 }, (_, i) => i + 1).map(monthNum => {
                                                    const getAmount = (prop: string) => {
                                                        const item = record.details?.[prop]?.monthlySell?.find((m: any) => parseInt(m.key) === monthNum);
                                                        return item?.payableAmount || 0;
                                                    };
                                                    return {
                                                        month: monthNum,
                                                        affiliation: getAmount('affiliation'),
                                                        liability: getAmount('liability'),
                                                        workman: getAmount('workman'),
                                                        collision: getAmount('collision'),
                                                    };
                                                })}
                                                rowKey="month"
                                                pagination={false}
                                                columns={[
                                                    { title: 'Month', dataIndex: 'month', render: (m) => dayjs().month(m - 1).format('MMM') },
                                                    { title: 'Affiliation', dataIndex: 'affiliation', render: val => usdFormat(val) },
                                                    { title: 'Liability', dataIndex: 'liability', render: val => usdFormat(val) },
                                                    { title: 'Workman', dataIndex: 'workman', render: val => usdFormat(val) },
                                                    { title: 'Collision', dataIndex: 'collision', render: val => usdFormat(val) },
                                                    {
                                                        title: 'Total',
                                                        render: (_, r: any) => <Text strong>{usdFormat(r.affiliation + r.liability + r.workman + r.collision)}</Text>
                                                    }
                                                ]}
                                                summary={(pageData) => {
                                                    let totalAffiliation = 0;
                                                    let totalLiability = 0;
                                                    let totalWorkman = 0;
                                                    let totalCollision = 0;
                                                    pageData.forEach((r: any) => {
                                                        totalAffiliation += r.affiliation;
                                                        totalLiability += r.liability;
                                                        totalWorkman += r.workman;
                                                        totalCollision += r.collision;
                                                    });
                                                    return (
                                                        <Table.Summary fixed>
                                                            <Table.Summary.Row style={{ background: '#fafafa' }}>
                                                                <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
                                                                <Table.Summary.Cell index={1}>{usdFormat(totalAffiliation)}</Table.Summary.Cell>
                                                                <Table.Summary.Cell index={2}>{usdFormat(totalLiability)}</Table.Summary.Cell>
                                                                <Table.Summary.Cell index={3}>{usdFormat(totalWorkman)}</Table.Summary.Cell>
                                                                <Table.Summary.Cell index={4}>{usdFormat(totalCollision)}</Table.Summary.Cell>
                                                                <Table.Summary.Cell index={5}><strong>{usdFormat(totalAffiliation + totalLiability + totalWorkman + totalCollision)}</strong></Table.Summary.Cell>
                                                            </Table.Summary.Row>
                                                        </Table.Summary>
                                                    );
                                                }}
                                            />
                                        </div>
                                    );

                                    return (
                                        <Popover content={content} title={`Yearly Breakdown - ${record.medallionNumber}`} trigger="hover" overlayStyle={{ width: 500 }}>
                                            <Button type="link" icon={<EyeOutlined />} />
                                        </Popover>
                                    );
                                }
                            },
                            {
                                title: 'Payable',
                                dataIndex: 'cost',
                                key: 'cost',
                                render: (val: number) => <Text type="danger">{usdFormat(val)}</Text>
                            },
                            {
                                title: 'Revenue',
                                dataIndex: 'sell',
                                key: 'sell',
                                render: (val: number) => <Text type="success">{usdFormat(val)}</Text>
                            },
                            {
                                title: 'Balance',
                                dataIndex: 'balance',
                                key: 'balance',
                                render: (val: number) => (
                                    <Text style={{ color: val >= 0 ? '#3f8600' : '#cf1322', fontWeight: 'bold' }}>
                                        {usdFormat(val)}
                                    </Text>
                                )
                            }
                        ]}
                        summary={(pageData) => {
                            let totalCost = 0;
                            let totalSell = 0;
                            let totalBalance = 0;

                            pageData.forEach(({ cost, sell, balance }: any) => {
                                totalCost += cost;
                                totalSell += sell;
                                totalBalance += balance;
                            });

                            return (
                                <Table.Summary fixed>
                                    <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 'bold' }}>
                                        <Table.Summary.Cell index={0} colSpan={2}>Total</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text type="danger">{usdFormat(totalCost)}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2}>
                                            <Text type="success">{usdFormat(totalSell)}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={3}>
                                            <Text style={{ color: totalBalance >= 0 ? '#3f8600' : '#cf1322' }}>
                                                {usdFormat(totalBalance)}
                                            </Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            );
                        }}
                    />
                </Modal>

                <Spin spinning={loading}>
                    <Form layout="vertical" onFinish={handleSubmit(handleCalculate)}>
                        <div style={{ padding: 10, borderRadius: 8, background: '#fafafa', border: '1px solid #f0f0f0', marginBottom: 16 }}>
                            <Row gutter={[8, 8]} align="middle" >
                                {/* Medallion Select */}
                                <MedallionNumberSelect
                                    control={control}
                                    errors={errors}
                                    mode={'multiple'}
                                    setMedallionNumberData={setMedallionNumberData}
                                    medallionNumberData={medallionNumberData}
                                    colProps={{ xs: 24, md: 5, lg: 5, xl: 5 }} // Adjusted for single line
                                    medallionWithAssign="yes"
                                />

                                {/* Status Select */}
                                <Col xs={24} md={4} lg={4} xl={4}>
                                    <SelectField
                                        label="Status"
                                        optionFilterProp="children"
                                        fieldName="status"
                                        control={control}
                                        errors={errors}
                                        iProps={{
                                            mode: "multiple",
                                            placeholder: "Status", // Shortened placeholder
                                            allowClear: true,
                                            size: "middle",
                                        }}
                                        options={
                                            [
                                                {
                                                    value: "pre_request",
                                                    label: <Tag color="purple">Pre-Request</Tag>,
                                                },
                                                {
                                                    value: "request",
                                                    label: <Tag color="gold">Request</Tag>,
                                                },
                                                {
                                                    value: "insured",
                                                    label: <Tag color="green">Insured</Tag>,
                                                },
                                                {
                                                    value: "surrender",
                                                    label: <Tag color="error">Surrender</Tag>,
                                                },
                                                {
                                                    value: "renew",
                                                    label: <Tag style={{ color: "rgb(3, 196, 239)", borderColor: 'rgb(3, 196, 239)', backgroundColor: 'rgb(3 196 239 / 8%)' }}>Renew</Tag>,
                                                },
                                            ]
                                        }
                                    />
                                </Col>

                                {/* Radio Toggle */}
                                <Col xs={24} md={3} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Radio.Group
                                        value={reportType}
                                        onChange={(e) => {
                                            setReportType(e.target.value);
                                            setValue('year', null);
                                        }}
                                        buttonStyle="solid"
                                        size="middle"
                                    >
                                        <Radio.Button value="yearly">Year</Radio.Button>
                                        <Radio.Button value="monthly">Month</Radio.Button>
                                    </Radio.Group>
                                </Col>

                                {/* Year Field - Always visible */}
                                <Col xs={24} md={reportType === 'monthly' ? 3 : 5} lg={reportType === 'monthly' ? 3 : 5} xl={reportType === 'monthly' ? 3 : 5}>
                                    <DateField
                                        label="Year"
                                        fieldName="year"
                                        control={control}
                                        errors={errors}
                                        iProps={{
                                            picker: "year",
                                            size: "middle",
                                            placeholder: "Year"
                                        }}
                                    />
                                </Col>

                                {/* Month Field - Only visible when monthly */}
                                {reportType === 'monthly' && (
                                    <Col xs={24} md={5} lg={5} xl={5}>
                                        <SelectField
                                            label="Months"
                                            fieldName="months"
                                            control={control}
                                            errors={errors}
                                            iProps={{
                                                mode: "multiple",
                                                placeholder: "Select Months",
                                                size: "middle",
                                                allowClear: true,
                                            }}
                                            options={[
                                                { value: 1, label: "Jan" },
                                                { value: 2, label: "Feb" },
                                                { value: 3, label: "Mar" },
                                                { value: 4, label: "Apr" },
                                                { value: 5, label: "May" },
                                                { value: 6, label: "Jun" },
                                                { value: 7, label: "Jul" },
                                                { value: 8, label: "Aug" },
                                                { value: 9, label: "Sep" },
                                                { value: 10, label: "Oct" },
                                                { value: 11, label: "Nov" },
                                                { value: 12, label: "Dec" },
                                            ]}
                                        />
                                    </Col>
                                )}

                                {/* Submit Button */}
                                <Col xs={24} md={4} lg={4} xl={4}>
                                    <Button
                                        type="primary"
                                        size="small" // Matched size
                                        icon={<SearchOutlined />}
                                        htmlType="submit"
                                        block
                                        style={{ height: '32px' }} // Align height with inputs
                                    >
                                        Analyze
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                    {analyticsData && (
                        <div style={{ marginTop: 24 }}>
                            {/* Summary Cards */}
                            <Row gutter={[16, 16]}>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Payable"
                                            value={analyticsData.totalCost}
                                            precision={2}
                                            prefix="$"
                                            valueStyle={{ color: '#cf1322' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Receivables"
                                            value={analyticsData.totalSell}
                                            precision={2}
                                            prefix="$"
                                            valueStyle={{ color: '#3f8600' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Total Balance"
                                            value={analyticsData.totalBalance}
                                            precision={2}
                                            prefix="$"
                                            valueStyle={{ color: analyticsData.totalBalance >= 0 ? '#3f8600' : '#cf1322' }}
                                            suffix={analyticsData.totalBalance >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Total Discount"
                                            value={analyticsData.totalDiscount}
                                            precision={2}
                                            prefix="$"
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            {/* Category Breakdown */}
                            <Divider orientation="left">Category Breakdown</Divider>
                            <Row gutter={[16, 16]}>
                                {Object.entries(analyticsData.categories).map(([key, val]: any) => (
                                    <Col span={6} key={key}>
                                        <Card size="small" title={key.toUpperCase()}>
                                            <p>Cost: <Text type="danger">{usdFormat(val.cost)}</Text></p>
                                            <p>Sell: <Text type="success">{usdFormat(val.sell)}</Text></p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {/* Monthly Chart and Pie Chart Row */}
                            {/* <Divider orientation="left">Trends & Distribution</Divider> */}
                            {/* <Row gutter={[16, 16]}>
                                <Col span={16}>
                                    <Card title="Monthly Cost vs Sell vs Balance" bordered={false}>
                                        <div style={{ height: 400 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={analyticsData.monthly}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip formatter={(value) => usdFormat(value)} />
                                                    <Legend />
                                                    <ReferenceLine y={0} stroke="#000" />
                                                    <Bar dataKey="cost" fill="#ff7875" name="Cost" />
                                                    <Bar dataKey="sell" fill="#95de64" name="Sell" />
                                                    <Bar dataKey="balance" fill="#1890ff" name="Balance">
                                                        {
                                                            analyticsData.monthly.map((entry: any, index: any) => (
                                                                <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#1890ff' : '#faad14'} />
                                                            ))
                                                        }
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title="Cost Distribution by Category" bordered={false}>
                                        <div style={{ height: 400 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={Object.entries(analyticsData.categories).map(([key, val]: any) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value: val.cost }))}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {[
                                                            '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'
                                                        ].map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={[
                                                                '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'
                                                            ][index % 5]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => usdFormat(value)} />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>
                                </Col>
                            </Row> */}

                            <Divider orientation="left">Net & Loss Analysis</Divider>
                            <Table
                                dataSource={reportType === 'monthly' ? analyticsData.monthly.filter((item: any) => item.cost > 0 || item.sell > 0 || item.discount > 0) : analyticsData.monthly}
                                rowKey="month"
                                pagination={false}
                                columns={[
                                    {
                                        title: 'Month',
                                        dataIndex: 'month',
                                        key: 'month',
                                    },
                                    {
                                        title: 'Payable',
                                        dataIndex: 'cost',
                                        key: 'cost',
                                        render: (val: number) => <Text type="danger">{usdFormat(val)}</Text>
                                    },
                                    {
                                        title: 'Total Revenue (Sell)',
                                        dataIndex: 'sell',
                                        key: 'sell',
                                        render: (val: number) => <Text type="success">{usdFormat(val)}</Text>
                                    },
                                    {
                                        title: 'Total Discount',
                                        dataIndex: 'discount',
                                        key: 'discount',
                                        render: (val: number) => <Text>{usdFormat(val)}</Text>
                                    },
                                    {
                                        title: 'Net  / (Loss)',
                                        dataIndex: 'balance',
                                        key: 'balance',
                                        render: (val: number) => (
                                            <Space>
                                                <Text style={{ color: val >= 0 ? '#3f8600' : '#cf1322', fontWeight: 'bold' }}>
                                                    {usdFormat(val)}
                                                </Text>
                                                {val >= 0 ? <ArrowUpOutlined style={{ color: '#3f8600' }} /> : <ArrowDownOutlined style={{ color: '#cf1322' }} />}
                                            </Space>
                                        )
                                    },
                                    {
                                        title: 'Margin %',
                                        key: 'margin',
                                        render: (_, record: any) => {
                                            const margin = record.sell ? ((record.balance / record.sell) * 100).toFixed(2) : 0;
                                            return <Tag color={parseFloat(margin.toString()) >= 0 ? 'green' : 'red'}>{margin}%</Tag>
                                        }
                                    },
                                    {
                                        title: 'Action',
                                        key: 'action',
                                        render: (_, record: any) => (
                                            <Button size="small" type="primary" onClick={() => handleViewMonth(record)}>View</Button>
                                        )
                                    }
                                ]}
                                summary={() => (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 'bold' }}>
                                            <Table.Summary.Cell index={0}>Grand Total</Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text type="danger">{usdFormat(analyticsData.totalCost)}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text type="success">{usdFormat(analyticsData.totalSell)}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={3}>
                                                <Text>{usdFormat(analyticsData.totalDiscount)}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={4}>
                                                <Text style={{ color: analyticsData.totalBalance >= 0 ? '#3f8600' : '#cf1322' }}>
                                                    {usdFormat(analyticsData.totalBalance)}
                                                </Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={5}>
                                                {analyticsData.totalSell ? ((analyticsData.totalBalance / analyticsData.totalSell) * 100).toFixed(2) : 0}%
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={6} />
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}
                            />
                        </div>
                    )}
                </Spin>
            </Card>
        </div >
    );
};

export default InsuranceBalance;
