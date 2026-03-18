import React, { useEffect, useState } from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts';
import { Card, Typography, Select, Spin } from 'antd';
import axios from '../../../utils/axiosInceptor';
import { usdFormat } from 'utils/helper';
import ChartComponent from './ChartComponent';

const { Title } = Typography;
const { Option } = Select;

const InsuranceChart: React.FC = () => {
    const [data, setData] = useState<any>({});
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/dashboard/insurance-options-data`);
            const insuranceData = response.data.data;

            setData(insuranceData);

            // default: latest year select
            const years = Object.keys(insuranceData).sort();
            setSelectedYear(years[years.length - 1]);
        } catch (error) {
            console.error('Error fetching member data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
    };
    const COLORS = ["#82ca9d", "#ffc658", "#8884d8"];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4}>Total Insurance with Collision Line</Title>
                <Select
                    style={{ width: 120 }}
                    value={selectedYear}
                    onChange={handleYearChange}
                    disabled={loading}
                >
                    {Object.keys(data).map((year) => (
                        <Option key={year} value={year}>
                            {year}
                        </Option>
                    ))}
                </Select>
            </div>

            <div style={{ width: '100%', height: 500 }}>
                {loading ? (
                    <Spin size="large" style={{ display: 'block', margin: '150px auto' }} />
                ) : (
                    <ResponsiveContainer>
                        <ComposedChart
                            data={data[selectedYear] || []}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />

                            {/* Y axis values formatted as USD */}
                            <YAxis tickFormatter={(value) => usdFormat(value, false)} />

                            {/* Single Tooltip with custom formatter */}
                            <Tooltip
                                formatter={(value: number) => usdFormat(value)}
                                labelFormatter={(label) => `Month: ${label}`}
                            />

                            <Legend />

                            <Bar dataKey="Total" fill="#8884d8" />
                            <Bar dataKey="Workmancomp" fill="#82ca9d" />
                            <Bar dataKey="Liability" fill="#ffc658" />
                            <Bar dataKey="Affiliation" fill="#a4de6c" />
                            <Line
                                type="monotone"
                                dataKey="Collision"
                                stroke="#ff7300"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>

                )}
            </div>

            {/* {!loading ? (<>
                <AreaChart
                    width={'100%'}
                    height={400}
                    data={data[selectedYear] || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => usdFormat(value, false)} />
                    <Tooltip formatter={(value: number) => usdFormat(value)} />
                    <Area type="monotone" dataKey="Total" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
            </>
            ) : ''} */}
        </Card>
    );
};

export default InsuranceChart;
