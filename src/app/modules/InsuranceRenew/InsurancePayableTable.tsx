import React, { useEffect, useState } from "react";
import { Table, Typography, Descriptions, Tag, Progress, Tooltip } from "antd";
import { Pie } from '@ant-design/plots';
import _ from 'lodash';
import { usdFormat } from "utils/helper";
const { Title } = Typography;

const itemColumns = [
    {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (i: any) => {
            return _.capitalize(i);
        },
    },
    {
        title: "Payable Amount",
        dataIndex: "payableAmount",
        key: "payableAmount",
        render: (i: any) => {
            return usdFormat(i);
        },
    },
    {
        title: "Payable Days",
        dataIndex: "payableDaysCount",
        key: "payableDaysCount"
    },
    {
        title: "Per Day Amount",
        dataIndex: "perDayAmount",
        key: "perDayAmount",
        render: (i: any) => {
            return usdFormat(i);
        },
    },
    {
        title: "Payable Start Date",
        dataIndex: "payableStartDate",
        key: "payableStartDate"
    },
    {
        title: "Payable End Date",
        dataIndex: "payableEndDate",
        key: "payableEndDate"
    }
];


const InsurancePayableTable = ({ data, medallionNumber, setSelectedDataRowKeys, isPaidByMonthAndInsurance }: any) => {


    const mainColumns = [
        {
            title: "Month",
            dataIndex: "month",
            key: "month"
        },
        {
            title: "Total Payable",
            key: "totalPayable",
            render: (_: any, record: any) => {
                const total = Object.values(record.typeTotals).reduce((sum: any, v: any) => sum + v, 0);
                return <strong>{usdFormat(total)}</strong>;
            }
        },
        {
            title: "Status",
            key: "status",
            render: (_: any, record: any) => {
                const total = Object.values(record.typeTotals).reduce((sum: any, v: any) => sum + v, 0);
                if (total == 0) {
                    return <Tag color="default">Not Applicable</Tag>; // or "No Charges"
                } else {
                    return isPaidByMonthAndInsurance(record.month, record.medallionNumber) ? <Tag color="green">Paid</Tag> : <Tag color="red">Due</Tag>;

                }

            }
        },
    ];


    const groupByMedallion = (rowKeys: string[]) => {
        return rowKeys.reduce((acc: Record<string, string[]>, key: string) => {
            const [medallionId, ...rest] = key.split("-");
            const month = rest.join("-"); // In case month contains hyphen (e.g. "July-August")

            if (!acc[medallionId]) {
                acc[medallionId] = [];
            }

            acc[medallionId].push(month);
            return acc;
        }, {});
    };



    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

    const [medallionData, setMedallionData]: any = useState([]);
    // Reset selection when data changes
    useEffect(() => {
        const medallionMonths = data.find(
            (item: any) => item.medallionNumber == medallionNumber
        )?.months || [];

        setMedallionData(medallionMonths);

        // // selectedRowKeys update karne ke liye new logic
        // const keys = medallionMonths.map((month: any) => {
        //     return `${medallionNumber}-${month.month}`;
        // });
        // console.log("keys", keys)
        // setSelectedRowKeys(keys);

    }, [data, medallionNumber]);

    useEffect(() => {
        setSelectedDataRowKeys((prev: any) => {

            const updated = { ...prev };


            if (!selectedRowKeys || selectedRowKeys.length === 0) {
                if (medallionNumber && updated[medallionNumber]) {
                    delete updated[medallionNumber];
                }
                return updated;
            }

            const currentMedallionIds = new Set(
                selectedRowKeys.map(key => key.split("-")[0])
            );

            currentMedallionIds.forEach((medallionId) => {
                delete updated[medallionId];
            });

            selectedRowKeys.forEach((key: string) => {
                const [medallionIdStr, ...rest] = key.split("-");
                const medallionId = parseInt(medallionIdStr); // Base 10 parsing
                const month = rest.join("-");

                if (!updated[medallionId]) {
                    updated[medallionId] = { months: [] };
                }

                if (!updated[medallionId].months.includes(month)) {
                    updated[medallionId].months.push(month);
                }
            });

            return updated;
        });
    }, [selectedRowKeys]);



    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: any[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record: any) => {
            const totalPayable = Object.values(record.typeTotals).reduce((sum: number, val: any) => sum + val, 0);

            if (isPaidByMonthAndInsurance(record.month, record.medallionNumber)) {
                return {
                    disabled: true,
                };
            }

            return {
                disabled: totalPayable <= 0,
            };
        }
    };

    return (
        <>
            <Title level={3}>Insurance Payable Overview</Title>
            <Table
                columns={mainColumns}
                dataSource={medallionData}
                expandable={{
                    expandedRowRender: (record) => (
                        <>
                            <Descriptions title="Payable Details" bordered column={5}>
                                {Object.entries(record.typeTotals).map(([type, value]: any) => (
                                    <Descriptions.Item label={_.capitalize(type)} key={type}>
                                        <Tooltip title={`Total amount for ${_.capitalize(type)} payable`}>
                                            <span>{usdFormat(value)}</span>
                                        </Tooltip>
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>

                            <Table
                                columns={itemColumns}
                                dataSource={record.items}
                                pagination={false}
                                rowKey={(r: any) => r.key + r.type}
                                size="small"
                                style={{ marginTop: 16 }}
                            />
                        </>
                    )
                }}
                rowKey={(r: any) => `${r.medallionNumber}-${r.month}`}
                pagination={false}
                rowSelection={rowSelection}
            />
        </>
    );
};

export default InsurancePayableTable;
