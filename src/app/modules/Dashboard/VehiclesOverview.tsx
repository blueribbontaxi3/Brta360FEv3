import { Card, Statistic, Row, Col } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const VehiclesOverview = () => {
    // Demo data
    const totalVehicles = 120;
    const activeVehicles = 85;
    const inactiveVehicles = 35;

    const wavVehicles = 25;
    const normalVehicles = 95;

    const statusData = [
        { name: "Active", value: activeVehicles },
        { name: "Inactive", value: inactiveVehicles },
    ];

    const wavData = [
        { name: "WAV", value: wavVehicles },
        { name: "Normal", value: normalVehicles },
    ];

    const COLORS = ["#52c41a", "#ff4d4f"]; // Green, Red
    const COLORS2 = ["#1890ff", "#faad14"]; // Blue, Orange

    return (
        <Card title={`Vehicles Overview `} bordered={false} size="small" extra={<span>Total: {totalVehicles}</span>}>
            <Row gutter={16}>
                {/* Active vs Inactive Vehicles */}
                <Col span={12}>
                    <Card size="small"  title="Active vs Inactive">
                        <PieChart width={200} height={220}>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                label
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Card>
                </Col>

                {/* WAV vs Normal Vehicles */}
                <Col span={12}>
                    <Card size="small" title="WAV vs Normal">
                        <PieChart width={200} height={220}>
                            <Pie
                                data={wavData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                label
                            >
                                {wavData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS2[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default VehiclesOverview;
