import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import axios from '../../../utils/axiosInceptor';
import MedallionNumberTag from "@atoms/MedallionNumberTag";

const InsuranceActivitiesTable: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchLast7DaysActivities = async (page = 1, limit = 10) => {
        const res = await axios.get(`dashboard/activities/last7days`);
        return res.data?.data;
    };

    const loadData = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const res = await fetchLast7DaysActivities(page, pageSize);
            console.log("res", res)
            setData(res.items);
            setPagination({
                current: page,
                pageSize,
                total: res.total,
            });
        } catch (err) {
            console.error("Error fetching activities:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData(pagination.current, pagination.pageSize);
    }, []);

    const columns = [
        {
            title: "Medallion",
            dataIndex: ["medallion", "medallionNumber"],
            key: "medallionNumber",
            render: (_: any, record: any) => {
                return <MedallionNumberTag medallion={record} />
            }
        },
        // {
        //     title: "Corporation",
        //     dataIndex: ["corporation", "corporationName"],
        //     key: "corporationName",
        // },
        // {
        //     title: "Vehicle VIN",
        //     dataIndex: ["vehicle", "vinNumber"],
        //     key: "vinNumber",
        // },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color: string;

                switch (status?.toLowerCase()) {
                    case "insured":
                        color = "green";
                        break;
                    case "surrender":
                        color = "red"; // danger
                        break;
                    case "renew":
                        color = "blue";
                        break;
                    case "flat_cancel":
                        color = "gray";
                        break;
                    case "request":
                        color = "gold";
                        break;
                    default:
                        color = "default"; // fallback
                }

                return <Tag color={color}>{status?.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) =>
                new Date(date).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                }),
        },
    ];

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={false} // ❌ pagination off
            scroll={{ y: 650 }} // ✅ vertical + horizontal scrollbar
            bordered
            size="middle"
        />
    );
};

export default InsuranceActivitiesTable;
