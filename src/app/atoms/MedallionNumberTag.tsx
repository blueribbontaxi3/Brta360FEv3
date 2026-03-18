import { Tag, Image } from "antd";
import Icon, { CarOutlined } from "@ant-design/icons";
import type { GetProps } from 'antd';
import WheelChairIconCustomIcon from '../../assets/wheelchair.svg?react';

type CustomIconComponentProps = GetProps<typeof Icon>;

const WheelChairIcon = (props: Partial<CustomIconComponentProps>) => {
    return <Icon component={WheelChairIconCustomIcon} {...props} />
}

const MedallionNumberTag = ({ medallion }: any) => {

    const medallionNumber = medallion?.medallionNumber;
    const isWav = medallion?.isWav;

    return (
        <Tag icon={isWav ? <WheelChairIcon style={{ fontSize: '16px' }} /> : <CarOutlined />} color={isWav ? "blue" : "green"}>{medallionNumber || "N/A"}</Tag>
    );
};

export default MedallionNumberTag;
