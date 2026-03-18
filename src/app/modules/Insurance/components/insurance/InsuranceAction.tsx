import { isPermission, usdFormat } from "utils/helper";
import React, { useState } from "react";
import moment from "moment";
import {
    Button,
    Dropdown,
    MenuProps,
    message,
    Popconfirm,
    Space,
    Spin,
    Typography,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PrinterOutlined,
    HistoryOutlined,
    DownOutlined,
    FileOutlined,
    CloudDownloadOutlined,
    CalculatorOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import FilePreviewModal from "@atoms/FilePreviewModal ";
import { InsuranceExportService } from "Services/InsuranceExportService";
import axiosService from 'utils/axiosInceptor';
import CalculateBalanceModal from './CalculateBalanceModal';

const { Text } = Typography;

const InsuranceAction = (props: any) => {
    const {
        record,
        authPermission,
        confirmDelete,
        setIsHardCardFormModalOpen,
        handleModelPreviousHistory,
    } = props;
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

    const handleMainDataExport = async () => {
        setIsLoading(true);
        setLoadingMessage('Preparing main insurance data...');

        try {
            await InsuranceExportService.exportMainData([record]);
            console.log('Export completed successfully!');
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    let attachmentFileUrl = record?.media_relations?.find(
        (item: any) => item.collection == "attachmentFile"
    )?.media?.url;

    // Dropdown Menu Actions
    const menuItems: MenuProps["items"] = [];

    if (
        isPermission(authPermission, "Insurance Update") &&
        record.status !== "surrender" &&
        record.status !== "flat_cancel" &&
        record.status !== "renew"
    ) {
        menuItems.push({
            key: "edit",
            label: <Link to={`/insurance/edit/${record.id}`}>Edit</Link>,
            icon: <EditOutlined />,
        });
    }

    if (isPermission(authPermission, "Insurance Delete")) {
        menuItems.push({
            key: "delete",
            label: (
                <Popconfirm
                    title="Delete Insurance"
                    description="Are you sure you want to delete this insurance?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => confirmDelete(record.id)}
                >
                    <span>Delete</span>
                </Popconfirm>
            ),
            icon: <DeleteOutlined />,
            danger: true,
        });
    }

    if (isPermission(authPermission, "Insurance Hard Card View") && attachmentFileUrl) {
        menuItems.push({
            key: "file",
            label: <span
                onClick={() =>
                    setIsModalOpen(true)
                }
            >
                View PDF
            </span>,
            icon: <FileOutlined />,
        });
    }

    if (record.status !== "flat_cancel" && record.status !== "renew") {
        menuItems.push({
            key: "print",
            label: (
                <span
                    onClick={() =>
                        setIsHardCardFormModalOpen({ data: record, pdfModalOpen: true })
                    }
                >
                    Print Hard Card
                </span>
            ),
            icon: <PrinterOutlined />,
        });
    }

    menuItems.push({
        key: "history",
        label: (
            <span onClick={() => handleModelPreviousHistory(record)}>
                Previous History
            </span>
        ),
        icon: <HistoryOutlined />,
    });

    const exportMainDataExport = (record: any) => async () => {
        setIsLoading(true);
        try {
            const response = await axiosService.post(
                '/insurances/export',
                { insuranceIds: [record.id] },
                {
                    responseType: 'blob',
                    headers: { Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'insurance-export.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success('File downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            message.error('Failed to download file!');
        } finally {
            setIsLoading(false);
        }
    };


    menuItems.push({
        key: "csv_download",
        label: (
            <span onClick={exportMainDataExport(record)}>
                CSV Download
            </span>
        ),
        icon: <CloudDownloadOutlined />,
    });

    const downloadCollisionForm = async () => {
        setIsLoading(true);
        console.log(record);
        try {
            const response = await axiosService.get(
                `/insurances/${record.id}/pdf`,
                {
                    responseType: 'blob',
                    headers: { Accept: 'application/pdf' },
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            console.log(`collision-form-${record.medallionNumber}.pdf`)
            link.setAttribute('download', `collision-form-${record.medallionNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            message.success('Collision Form downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            message.error('Failed to download Collision Form!');
        } finally {
            setIsLoading(false);
        }
    };

    menuItems.push({
        key: "collision_form_download",
        label: (
            <span onClick={downloadCollisionForm}>
                Download Collision Form
            </span>
        ),
        icon: <CloudDownloadOutlined />,
    });

    if (record.status !== 'flat_cancel') {
        menuItems.push({
            key: "calculate_balance",
            label: (
                <span onClick={() => setIsBalanceModalOpen(true)}>
                    Calculate Balance
                </span>
            ),
            icon: <CalculatorOutlined />,
        });

    }

    return (

        <>
            <FilePreviewModal fileUrl={attachmentFileUrl} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
            {
                isLoading ? <Spin /> : <Dropdown menu={{ items: menuItems }} trigger={["click"]} >
                    <Button>
                        Action <DownOutlined />
                    </Button>
                </Dropdown>
            }


            <br />
            <Text>{moment(record?.createdAt).format("MM-DD-YYYY")}</Text>
            <br />
            <Text>{moment(record?.createdAt).format("h:mm:ss a")}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "0.85em" }}>
                {moment(record?.createdAt).fromNow()}
            </Text>

            <CalculateBalanceModal
                isOpen={isBalanceModalOpen}
                onClose={() => setIsBalanceModalOpen(false)}
                insuranceId={record.id}
                medallionNumber={record?.medallion?.medallionNumber}
            />
        </>
    );
};

export default InsuranceAction;
