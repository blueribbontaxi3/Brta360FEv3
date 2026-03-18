import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Button, Space, Typography, Card, Row, Col, message } from 'antd';
import type { DatePickerProps } from 'antd';
import { calculateMonthlyData } from 'utils/paymentCalculator';
import { isValidDateRange } from 'utils/dateUtils';

interface PaymentCalculatorProps {
    onCalculate: (data: ReturnType<typeof calculateMonthlyData>) => void;
}

export const PaymentCalculator: React.FC<PaymentCalculatorProps> = ({ onCalculate }) => {
    const [amount, setAmount] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleCalculate = () => {
        message.destroy()
        if (!isValidDateRange(startDate, endDate)) {
            message.error('Please select start and end dates from the same year');
            return;
        }

        if (!amount) {
            message.error('Please enter an amount');
            return;
        }

        const input: any = {
            startDate,
            endDate,
            amount: Number(amount),
        };

        const result = calculateMonthlyData(input);
        message.success('Calculation process done');
        onCalculate(result);
    };

    useEffect(() => {
        if (amount) {
            handleCalculate();
        }
    }, [amount])

    const handleStartDateChange: DatePickerProps['onChange'] = (date: any, dateString: any) => {
        setStartDate(dateString);
        handleCalculate()
    };

    const handleEndDateChange: DatePickerProps['onChange'] = (date: any, dateString: any) => {
        setEndDate(dateString);
        handleCalculate()
    };

    return (
        <Card style={{ marginBottom: 24 }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Typography.Text>Start</Typography.Text>
                    <DatePicker
                        style={{ width: '100%', marginTop: 8 }}
                        onChange={handleStartDateChange}
                        placeholder="Select start date"
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Typography.Text>End</Typography.Text>
                    <DatePicker
                        style={{ width: '100%', marginTop: 8 }}
                        onChange={handleEndDateChange}
                        placeholder="Select end date"
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Typography.Text>Amount</Typography.Text>
                    <Space.Compact style={{ width: '100%', marginTop: 8 }}>
                        <Input
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value)

                            }}
                            type="number"
                            onPressEnter={handleCalculate}
                        />
                        <Button type="primary" onClick={handleCalculate}>
                            Calculate
                        </Button>
                    </Space.Compact>
                </Col>
            </Row>
        </Card>
    );
};