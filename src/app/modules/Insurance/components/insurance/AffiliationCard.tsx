import { DollarOutlined } from "@ant-design/icons";
import { Badge, Card, Descriptions, Tag, Spin } from "antd";
import { useState, useEffect } from "react";
import { usdFormat } from "utils/helper";
interface AffiliationCardProps {
    title: string;
    amount: number;
    payableAmount: number;
    daysCount: number;
    medallionNumberSingleData: any;
}

export const AffiliationCard = ({
    title,
    amount,
    payableAmount,
    daysCount,
    medallionNumberSingleData,
}: AffiliationCardProps) => {
    const [loading, setLoading] = useState(false);

    // Trigger loading whenever monitored props change
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500); // Simulate loading delay
        return () => clearTimeout(timer); // Cleanup timeout on unmount or rerender
    }, [amount, payableAmount, daysCount, medallionNumberSingleData]);

    return (
        <Spin spinning={loading} tip="Loading...">
            <Badge.Ribbon text={`Days: ${daysCount}`} color="blue">
                <Card
                    size="small"
                    title={
                        <span>
                            <DollarOutlined /> {title}
                        </span>
                    }
                    className="h-full"
                >
                    <Descriptions column={(medallionNumberSingleData?.corporation?.discount?.amount == 0 || medallionNumberSingleData?.corporation?.discount?.amount == null || medallionNumberSingleData?.corporation?.discount?.amount == undefined) ? 1 : 2} size="small" >
                        <Descriptions.Item label={'Year'}>
                            {usdFormat(amount)}
                        </Descriptions.Item>
                        {medallionNumberSingleData?.corporation?.discount?.amount > 0 && (
                            <Descriptions.Item label={`Discount`}>
                                <Tag color="gold-inverse">
                                    {usdFormat(
                                        medallionNumberSingleData?.corporation?.discount?.amount
                                    )}
                                </Tag>
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label={`Payable`} >
                            <Tag color="success">{usdFormat(payableAmount)}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Badge.Ribbon>
        </Spin>
    );
};
