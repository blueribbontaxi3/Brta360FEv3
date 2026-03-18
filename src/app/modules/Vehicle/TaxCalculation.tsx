import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Flex, Modal, Popover, Select, Table, Tag, Typography, Form, DatePicker, notification } from 'antd';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import AdvanceTable from '../../molecules/AdvanceTable';
import { usdFormat } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import MedallionNumberTag from '@atoms/MedallionNumberTag';
import { EyeFilled } from '@ant-design/icons';
import GroundTaxMedallion from './GroundTaxMedallion';

dayjs.extend(utc);
const { Text } = Typography;

const PaymentModal = ({
    open,
    onCancel,
    data,
    refreshData
}: {
    open: boolean;
    onCancel: () => void;
    data: any;
    refreshData?: () => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                month: data.month,
                paidDate: values.date.format("YYYY-MM-DD"),
                medallionNumber: data.medallionNumber,
                vinNumber: data.vinNumber,
                wavFee: data.wavFee,
                groundTax: data.groundTax,
                insuranceId: data.insuranceId,
                // Add other necessary fields if required
            };

            const res = await axios.post("/vehicles/pay-ground-tax", payload);
            if (res.data?.status === 1) {
                notification.success({
                    message: "Success",
                    description: res.data?.message || "Payment recorded successfully",
                });
                form.resetFields();
                if (refreshData) refreshData();
                onCancel();
            } else {
                notification.error({
                    message: "Error",
                    description: res.data?.message || "Failed to record payment",
                });
            }
        } catch (error: any) {
            notification.error({
                message: "Error",
                description: error?.response?.data?.message || "An error occurred",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Record Payment"
            open={open}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
            centered
        >
            <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Month">
                    <Tag color="blue">{data?.month}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Medallion">
                    {data?.medallionNumber}
                </Descriptions.Item>
                <Descriptions.Item label="VIN">{data?.vinNumber}</Descriptions.Item>
                <Descriptions.Item label="Insurance Status">
                    <Tag color={data?.insuranceStatus === "insured" ? "green" : "red"} style={{ textTransform: "capitalize" }}>
                        {data?.insuranceStatus || "-"}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ground Tax">
                    {usdFormat(data?.groundTax)}
                </Descriptions.Item>
                <Descriptions.Item label="WAV Fee">
                    {usdFormat(data?.wavFee)}
                </Descriptions.Item>
            </Descriptions>

            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="date"
                    label="Select Date"
                    rules={[{ required: true, message: "Please select a date" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Paid
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const TaxCalculationVehicle = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData]: any = useState([]);

    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);

    const [historyModalOpen, setHistoryModalOpen] = useState(false);

    const [tableParams, setTableParams]: any = useState({
        pagination: { current: 1, pageSize: 10 },
        filters: {},
        sorter: null,
        date: {},
        status: null,
    });

    // Fetch Medallion Data
    const fetchData = () => {
        setLoading(true);
        axios
            .get(`vehicles/tax/compute-insurance`, {
                params: {
                    pageSize: tableParams.pagination.pageSize,
                    current: tableParams.pagination.current,
                    ...tableParams.filters,
                    ...tableParams.sorter,
                    ...tableParams.date,
                    status: tableParams.status,
                    search: tableParams.search,
                    year: tableParams.year,
                    // medallionRequired: tableParams.medallionRequired
                },
            })
            .then((res) => {
                const items = Array.isArray(res?.data?.data)
                    ? res.data.data
                    : Object.values(res?.data?.data || {});
                setData(items);
                // setTableParams((prev: any) => ({
                //     ...prev,
                //     pagination: { ...prev.pagination, total },
                // }));
            })
            .catch(() => {
                // Handle error notification
            })
            .finally(() => setLoading(false));
    };

    // Fetch data on mount or table parameter changes
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    // Handle table change
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        let search = null;
        if (tableParams.search) {
            search = tableParams.search;
        }
        let year = null;
        if (tableParams.year) {
            year = tableParams.year;
        }
        setTableParams({ pagination, filters, sorter, search, year });
    };

    const handleMonthClick = (month: string, record: any) => {
        setPaymentData({
            month,
            medallionNumber: record?.records?.[0]?.medallion?.medallionNumber,
            vinNumber: record?.vehicle?.vinNumber,
            groundTax: record?.monthlyTax, // Assuming monthlyTax logic here, adjust if needed
            wavFee: record?.wavFee,
            insuranceStatus: record?.records?.[0]?.status,
            insuranceId: record?.records?.[0]?.id,
        });
        setPaymentModalOpen(true);
    };

    const RecordCard = ({ rec, color }: { rec: any; color: string }) => {
        const items = [
            {
                label: "Status",
                children: (
                    <Tag color={color} style={{ textTransform: "capitalize" }}>
                        {rec.status}
                    </Tag>
                ),
            },
            {
                label: "Effective",
                children: rec.effectiveDate,
            },
            {
                label: "Surrender",
                children: rec.surrenderDate || "-",
            },
            {
                label: "Vehicle",
                children: `${rec.vehicle?.vehicleMake?.name || ""} ${rec.vehicle?.vehicleModel?.name || ""
                    } (${rec.vehicle?.vehicleYear?.year || ""})`,
            },
            {
                label: "VIN",
                children: rec.vehicle?.vinNumber || "-",
            },
        ];

        return (
            <Card
                key={rec.id}
                size="small"
                style={{ marginBottom: 8, borderLeft: `4px solid ${color}` }}
                styles={
                    {
                        body: {
                            padding: 0
                        }
                    }
                }
            >
                <Descriptions bordered size="small" column={1} items={items} />
            </Card>
        );
    };

    const getVehiclePopover = (data: any) => {

        const content = (
            <Descriptions
                size="small"
                column={1}
                style={{ width: 350 }}
                labelStyle={{ fontWeight: 'bold' }}
            >
                <Descriptions.Item label="Make">
                    <Text>{data?.vehicleMake?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Model">
                    <Text>{data?.vehicleModel?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Type">
                    <Text>{data?.vehicleType?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Year">
                    <Text>{data?.vehicleYear?.year}</Text>
                </Descriptions.Item>
            </Descriptions>
        );

        return <><Tag color="cyan">{data?.vinNumber}</Tag>{content}</>;
    };
    const columns = [
        {
            title: "Medallion Number",
            dataIndex: "medallionNumber",
            key: "medallionNumber",
            render: (medallionNumber: string, record: any) => {
                return <MedallionNumberTag medallion={record?.records?.[0]?.medallion} />;
            },
        },
        {
            title: 'Vin Number',
            dataIndex: 'vinNumber',
            key: 'vinNumber',
            width: "350px",
            render: (item: any, record: any) => getVehiclePopover(record.vehicle),
        },
        {
            title: "Months",
            dataIndex: "uniqueMonths",
            key: "uniqueMonths",
            render: (months: any[], record: any) => {
                return (
                    <Flex wrap="wrap" gap="5px" style={{ maxWidth: 200 }}>
                        {
                            months.map((m) => {
                                const monthStr = typeof m === 'object' ? m.month : m;
                                let isPaid = false;
                                let paidDate = '';

                                if (typeof m === 'object' && m.paidGroundTax) {
                                    isPaid = true;
                                    paidDate = m.paidGroundTax.paidDate;
                                } else {
                                    const monthObj = record.records?.flatMap((r: any) => r.months || [])
                                        .find((mon: any) => mon.month === monthStr);
                                    isPaid = !!monthObj?.paidGroundTax;
                                    paidDate = monthObj?.paidGroundTax?.paidDate;
                                }

                                if (isPaid) {
                                    return (
                                        <Popover key={monthStr} content={`Paid Date: ${paidDate}`}>
                                            <Tag color="green" style={{ width: '40px', textAlign: 'center', cursor: 'default' }}>
                                                {dayjs(monthStr).format('MMM')}
                                            </Tag>
                                        </Popover>
                                    );
                                }

                                return (
                                    <span key={monthStr} onClick={() => handleMonthClick(monthStr, record)} style={{ cursor: "pointer" }}>
                                        <Tag style={{ width: '40px', textAlign: 'center', cursor: 'pointer' }} color='gold'>
                                            {dayjs(monthStr).format('MMM')}
                                        </Tag>
                                    </span>
                                )
                            })
                        }
                    </Flex>
                )
            }

        },
        {
            title: "Tax Rate",
            dataIndex: "monthlyTax",
            key: "monthlyTax",
            render: (monthlyTax: number) => <>{usdFormat(monthlyTax)}</>,
        },
        {
            title: "Wav Fee",
            dataIndex: "wavFee",
            key: "wavFee",
            render: (wavFee: number) => <>{usdFormat(wavFee)}</>,
        },
        {
            title: "Total Tax",
            dataIndex: "totalTax",
            key: "totalTax",
            render: (totalTax: number) => <>{usdFormat(totalTax)}</>,
        },
        {
            title: "Payment Summary",
            key: "paymentSummary",
            render: (_: any, record: any) => {
                const uniqueMonths = record.uniqueMonths || [];
                const monthlyTax = parseFloat(record.monthlyTax) || 0;
                const wavFee = parseFloat(record.wavFee) || 0;
                const totalTax = parseFloat(record.totalTax) || 0;

                const paidMonthsCount = uniqueMonths.reduce((count: number, m: any) => {
                    let isPaid = false;
                    const monthStr = typeof m === 'object' ? m.month : m;

                    if (typeof m === 'object' && m.paidGroundTax) {
                        isPaid = true;
                    } else {
                        const monthObj = record.records?.flatMap((r: any) => r.months || [])
                            .find((mon: any) => mon.month === monthStr);
                        isPaid = !!monthObj?.paidGroundTax;
                    }

                    return count + (isPaid ? 1 : 0);
                }, 0);

                const totalPaid = paidMonthsCount * (monthlyTax + wavFee);
                const balance = totalTax - totalPaid;

                return (
                    <Flex vertical>
                        <Tag color="blue">Paid: {usdFormat(totalPaid)}</Tag>
                        <Tag color="volcano" style={{ marginTop: 4 }}>
                            Balance: {usdFormat(balance)}
                        </Tag>
                    </Flex>
                );
            },
        },
        {
            title: "Records",
            dataIndex: "records",
            key: "records",
            render: (_: any, records: any) => {
                return <>
                    <Button icon={<EyeFilled />} onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedData(records)
                        setOpen(true)
                    }} />
                    {/* <Popover
                        placement="right"
                        title="Records"
                        content={
                            <div style={{ maxHeight: 400, overflowY: "auto" }}>
                                {records?.records?.map((rec: any) => {
                                    const color =
                                        rec.status === "insured"
                                            ? "green"
                                            : rec.status === "surrender"
                                                ? "red"
                                                : "blue";

                                    return (<RecordCard rec={rec} color={color} />);
                                })}
                            </div>
                        }
                        trigger="click"
                    >
                        <Tag color="blue" style={{ cursor: "pointer" }}>
                            View Records ({records?.records?.length})
                        </Tag>
                    </Popover> */}
                </>
            },
        },
    ];

    const extraFilters = (
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Select
                options={Array.from(
                    { length: dayjs().year() - 2024 + 1 },
                    (_, i) => {
                        const year = 2024 + i;
                        return { label: year.toString(), value: year };
                    }
                ).reverse()}
                onChange={(value) => {
                    setTableParams((prev: any) => ({
                        ...prev,
                        year: value,
                        pagination: { ...prev.pagination, current: 1 },
                    }));
                }}
                placeholder="Select a year"
                allowClear
                style={{ width: '100%' }}
                showSearch
                aria-label="Filter by year"
            />
        </Col>
    )

    return (
        <>
            <Banner
                title="Ground Tax"
                breadCrumb={[
                    { title: "Home", path: "/" },
                    { title: "Ground Tax" },
                ]}
            />
            <Card>
                <AdvanceTable
                    data={data}
                    loading={loading}
                    columns={columns}
                    tableParams={tableParams}
                    setTableParams={setTableParams}
                    handleTableChange={handleTableChange}
                    // handleDateRange={handleDateRange}
                    //  expandable={{ expandedRowRender }}
                    rowKey="medallionNumber"
                    status={false}
                    extraFilters={extraFilters}
                />
            </Card>
            {selectedData && (<GroundTaxMedallion data={selectedData} open={open} setOpen={setOpen} />)}
            {paymentData && (
                <PaymentModal
                    open={paymentModalOpen}
                    onCancel={() => setPaymentModalOpen(false)}
                    data={paymentData}
                    refreshData={() => fetchData()}
                />
            )}
        </>
    );
};

export default TaxCalculationVehicle;
