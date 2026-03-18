import { DollarOutlined } from "@ant-design/icons";
import { Badge, Card, Descriptions, Tag, Spin } from "antd";
import { useState, useEffect } from "react";
import { usdFormat } from "utils/helper";

interface FinancialCardProps {
    title: string;
    amount: number;
    payableAmount: number;
    daysCount: number;
}

export const FinancialCard = ({
    title,
    amount,
    payableAmount,
    daysCount,
}: FinancialCardProps) => {
    const [loading, setLoading] = useState(false);

    // Trigger loading effect whenever specific props change
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false); // Simulate a delay to hide the loader
        }, 500); // Adjust the delay as needed
        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [amount, payableAmount, daysCount]);

    return (
        <Spin spinning={loading} tip="Loading...">
            <Badge.Ribbon text={`Days: ${daysCount || 0}`} color="blue">
                <Card
                    size="small"
                    title={
                        <span>
                            <DollarOutlined /> {title}
                        </span>
                    }
                    className="h-full"
                >
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label={'For year'}>
                            {usdFormat(amount)}
                        </Descriptions.Item>
                        <Descriptions.Item label={`Payable`}>
                            <Tag color="success">{usdFormat(payableAmount)}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Badge.Ribbon>
        </Spin>
    );
};
