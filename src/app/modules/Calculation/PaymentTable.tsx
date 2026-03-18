import React from 'react';
import { Table, Card } from 'antd';

interface PaymentTableProps {
    data: any
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ data }) => {
    const columns: any = [
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
            fixed: 'left',
            width: 120,
        },
        {
            title: 'Per Amount',
            dataIndex: 'perAmount',
            key: 'perAmount',
            width: 120,
            render: (value: number) => value,
        },
        {
            title: 'Total Days',
            dataIndex: 'totalDays',
            key: 'totalDays',
            width: 120,
        },
        {
            title: 'Per Day Amount',
            dataIndex: 'perDayAmount',
            key: 'perDayAmount',
            width: 140,
            render: (value: number) => value,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 120,
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 120,
        },
        {
            title: 'Payable Amount',
            dataIndex: 'payableAmount',
            key: 'payableAmount',
            width: 140,
            render: (value: number) => value,
        },
        {
            title: 'Average Monthly Payable',
            dataIndex: 'averageMonthlyPayable',
            key: 'averageMonthlyPayable',
            width: 180,
            render: (value: number) => value,
        },
        {
            title: 'Payable Days Count',
            dataIndex: 'payableDaysCount',
            key: 'payableDaysCount',
            width: 160,
        },
        {
            title: 'Payable Start Date',
            dataIndex: 'payableStartDate',
            key: 'payableStartDate',
            width: 160,
        },
        {
            title: 'Payable End Date',
            dataIndex: 'payableEndDate',
            key: 'payableEndDate',
            width: 160,
        },
    ];

    return (
        <Card>
            <Table
                columns={columns}
                dataSource={data}
                scroll={{ x: 1500 }}
                pagination={false}
                bordered
                summary={(pageData) => {
                    let totalAmount = 0;
                    let payableAmount = 0;
                    pageData.forEach(({ perAmount, payableAmount: pAmount }: any) => {
                        totalAmount += perAmount;
                        payableAmount += pAmount;
                    });

                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={7}>
                                    <strong>Total Amount:</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>{totalAmount}</Table.Summary.Cell>
                                <Table.Summary.Cell index={2} colSpan={3} />
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={7}>
                                    <strong>Payable Amount:</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>{payableAmount}</Table.Summary.Cell>
                                <Table.Summary.Cell index={2} colSpan={3} />
                            </Table.Summary.Row>
                            {/* <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={7}>
                                    <strong>Average Monthly Payable:</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>{averageMonthlyPayable}</Table.Summary.Cell>
                                <Table.Summary.Cell index={2} colSpan={3} />
                            </Table.Summary.Row> */}
                        </>
                    );
                }}
            />
        </Card>
    );
};