import React, { useState } from "react";
import { Column, DualAxes } from "@ant-design/charts";
import { Select, Card } from "antd";
import { usdFormat } from "utils/helper";

const { Option } = Select;

const ChartComponent: React.FC<any> = ({ data }) => {
    const config = {
        data: data[2025],
        xField: 'month',
        yField: 'Total',
        columnWidthRatio: 0.5,
        color: '#1890ff',
    };

    return (
        <Column {...config} />
    );
};

export default ChartComponent;
