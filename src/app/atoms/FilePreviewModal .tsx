import { useEffect, useState } from "react";
import { Modal, Button, Tooltip, Input, Space, message } from "antd";
import { Document, Page } from "react-pdf";
import {
    DownloadOutlined,
    FileTextOutlined,
    LeftOutlined,
    RightOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from "@ant-design/icons";

const FilePreviewModal = (props: any) => {
    const { fileUrl, setIsModalOpen, isModalOpen }: any = props;
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);

    // const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const handlePageInputChange = (e: any) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= numPages) {
            setPageNumber(value);
        }
    };

    const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.4));
    const resetZoom = () => setScale(1.2);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) return;
            if (e.key === "ArrowLeft") goToPrevPage();
            if (e.key === "ArrowRight") goToNextPage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen, pageNumber]);

    return (
        <>


            <Modal
                title="PDF Preview"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={<div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
                    <Space>
                        <Button onClick={goToPrevPage} disabled={pageNumber <= 1} icon={<LeftOutlined />} />
                        <Input
                            style={{ width: 60 }}
                            value={pageNumber}
                            onChange={handlePageInputChange}
                            min={1}
                            max={numPages}
                        />
                        <span>of {numPages}</span>
                        <Button onClick={goToNextPage} disabled={pageNumber >= numPages} icon={<RightOutlined />} />
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button type="link" color="geekblue" variant="solid" icon={<DownloadOutlined />}>Download</Button>
                        </a>
                    </Space>
                    <Space>
                        <Button icon={<ZoomOutOutlined />} onClick={zoomOut} disabled={scale <= 0.5}>
                            Zoom Out
                        </Button>
                        <Button onClick={resetZoom}>Reset</Button>
                        <Button icon={<ZoomInOutlined />} onClick={zoomIn} disabled={scale >= 3}>
                            Zoom In
                        </Button>
                    </Space>
                </div>}
                width="90%"
                style={{ top: 20, overflow: 'auto' }}
                styles={{
                    body: {
                        height: '80vh', overflow: 'auto', padding: 0
                    }
                }}
                centered
            >
                {!fileUrl && <p style={{ color: "red" }}>PDF file not found</p>}

                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading="Loading PDF..."
                    onLoadError={(err) => {
                        console.error("PDF Load Error:", err);
                        message.error("Failed to load PDF.");
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Page pageNumber={1} width={Math.min(window.innerWidth * 0.8, 700)} />
                    </div>
                </Document>


            </Modal>
        </>
    );
};

export default FilePreviewModal;
