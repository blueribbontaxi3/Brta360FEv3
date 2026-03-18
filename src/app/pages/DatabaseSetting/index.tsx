import { useState } from "react";
import {
    Card,
    Upload,
    Button,
    Dropdown,
    notification,
    message,
    Typography,
    Space,
    Row,
    Col,
    Progress,
    Modal,
    Spin,
} from "antd";
import {
    UploadOutlined,
    DownloadOutlined,
    InboxOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import axiosService from "utils/axiosInceptor";

const { Dragger } = Upload;
const { Text } = Typography;
const { confirm } = Modal;

export default function DatabaseImportExport() {
    const [fileList, setFileList]: any = useState([]);
    const [previewData, setPreviewData]: any = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const handleUpload = async (file: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('sqlFile', file);

            await axiosService.post('/auth/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            message.success(`${file.name} imported successfully!`);
        } catch (error) {
            console.error(error);
            message.error('Database import failed!');
        } finally {
            setLoading(false);
        }
        return false; // prevent default upload behavior
    };

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await axiosService.post('/auth/export', {}, {
                responseType: 'blob', // Correct placement
                headers: {
                    'Accept': 'application/sql',
                },
                // Optional: Progress tracking
                onDownloadProgress: (progressEvent: any) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setDownloadProgress(percentCompleted);
                }
            });

            // Create download link
            const blob = new Blob([response.data], { type: 'application/sql' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `database_${new Date().toISOString().split('T')[0]}.sql`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            message.success('Database downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            message.error('Failed to download database!');
        } finally {
            setLoading(false);
            setDownloadProgress(0);
        }
    };

    const handleDropTables = async () => {
        confirm({
            title: "Are you sure you want to DROP all tables?",
            icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
            content:
                "⚠️ This will permanently delete all tables and data from the database. This action cannot be undone!",
            okText: "Yes, Drop All",
            okType: "danger",
            cancelText: "Cancel",
            async onOk() {
                try {
                    const res = await axiosService.delete("/auth/drop-tables"); // <- Laravel API endpoint
                    if (res.data.status === 1) {
                        notification.success({
                            message: "All Tables Dropped",
                            description: res.data.message,
                        });
                    } else {
                        notification.error({
                            message: "Error",
                            description: res.data.message,
                        });
                    }
                } catch (err) {
                    notification.error({
                        message: "Request Failed",
                        description: "Could not drop tables. Check server logs.",
                    });
                }
            },
        });
    };

    return (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Spin spinning={loading}>
                {/* Import Section */}
                <Card title="Import Database">
                    <Dragger
                        accept=".sql"
                        beforeUpload={handleUpload}
                        showUploadList={false}
                        multiple={false}
                        maxCount={1}
                        disabled={loading}
                    >
                        <Space direction="vertical" align="center" style={{ width: "100%" }}>
                            <InboxOutlined style={{ fontSize: 40, color: "#1677ff" }} />
                            <Text strong>Click or drag file to this area to import</Text>
                            <Text type="secondary">Supports SQL files</Text>
                        </Space>
                    </Dragger>
                </Card>

                {/* Export Section */}
                <Card title="Export Database">
                    <Row justify="start">
                        <Col>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handleExport}
                            >
                                Export Database (.sql)
                            </Button>
                        </Col>
                        <Col>
                            <Button danger onClick={handleDropTables}>
                                Data Clean
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {loading && downloadProgress > 0 && (
                    <div style={{ marginTop: 16, width: 300 }}>
                        <Progress percent={downloadProgress} />
                    </div>
                )}
            </Spin>
        </Space>
    );
}
