import React, { useEffect, useState } from "react";
import { Card, Button, Popconfirm, Row, Col, Empty, Typography, ConfigProvider, Modal, Image, Space, Input } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
    CloseOutlined,
    EyeOutlined,
    ZoomOutOutlined,
    ZoomInOutlined,
    DownloadOutlined,
    RightOutlined,
    LeftOutlined,
} from "@ant-design/icons";
import { useMediaModal } from "./MediaManagerProvider";
import { FilePreview } from "./FilePreview";
import { Document, Page } from "react-pdf";
const { Meta } = Card;

const MediaCard: React.FC<any> = ({
    multiple = false,
    maxItems = 1,
    name,
    onChange,
    buttonText,
    previewSize = "200px",
    media_relations,
}) => {
    const { openModal } = useMediaModal();
    const [media, setMedia] = useState<any>([]);
    const [singleFile, setSingleFile] = useState<any>({});
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);



    useEffect(() => {
        // console.log("media_relations",media_relations?.filter((relation: any) => {
        //     return relation.collection === name;
        // }))
        if (typeof media_relations == 'string') {
            setMedia([]);
            return;
        }
        const formatMedia =
            media_relations
                ?.filter((relation: any) => relation.collection === name)
                ?.map((relation: any) => ({
                    id: relation.media?.id,
                    name: relation.media?.name,
                    mime_type: relation.media?.mime_type,
                    url: relation.media?.url,
                })) || [];
        setMedia(formatMedia);
        if (multiple === false) {
            onChange(formatMedia?.[0]?.id); // 🔹 Pass selected media to parent component
        }
    }, [media_relations]);

    const handleOpenModal = () => {
        openModal({
            title: "Media Manager",
            multiple,
            require: true,
            allowedTypes: ["image/jpeg", "image/png"],
            maxItems,
            mediaItemDetail: "side",
            defaultSelected: media,
            onSelected: (selectedItems: any) => {
                console.log("name", name);
                setMedia(selectedItems);
                if (onChange) {
                    if (multiple === false) {
                        onChange(selectedItems?.[0]?.id); // 🔹 Pass selected media to parent component
                    }
                }
            },
        });
    };

    const onRemove = (index: number) => {
        setMedia(media.filter((_: any, i: any) => i !== index));
        if (onChange) {
            onChange(media.filter((_: any, i: any) => i !== index));
        }
    };

    const handlePreviewOpenModal = () => {
        setSingleFile(media?.[0])
        if (media?.[0]) {
            setIsPreviewModalOpen(true)

        }
    }

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


    if (!multiple) {
        return (
            <>
                <ConfigProvider
                    theme={{
                        components: {
                            Card: {
                                actionsLiMargin: '2px'
                            },
                        },
                    }}
                >
                    <Card
                        styles={{
                            body: {
                                padding: 0,
                                position: media.length > 0 ? "absolute" : "inherit",
                                right: 0,
                                top: 0,
                            },
                        }}
                        className={"image-card-body" + (media.length === 0 ? "1" : "")}
                        style={{
                            width: previewSize,
                            boxShadow: "0px 0px 6px 1px rgb(0 0 0 / 37%)",
                        }}
                        cover={
                            media.length > 0 ? (
                                <FilePreview
                                    file={media[0]}
                                    style={{ width: previewSize, height: previewSize }}
                                />
                            ) : null
                        }
                        actions={media.length > 0 ? [buttonText] : undefined}

                    >
                        {media.length === 0
                            ? [
                                <Button
                                    type="primary"
                                    key="add"
                                    onClick={handleOpenModal}
                                    block={media.length === 0 ? true : false}
                                >
                                    {buttonText ? buttonText : "Select Media"}
                                </Button>,
                            ]
                            : [
                                <Button
                                    type="primary"
                                    size="small"
                                    shape="circle"
                                    icon={<EyeOutlined />}
                                    key="view"
                                    onClick={handlePreviewOpenModal}
                                    color="gold"
                                    variant="solid"
                                />,
                                <Button
                                    type="primary"
                                    size="small"
                                    shape="circle"
                                    icon={<EditOutlined />}
                                    key="edit"
                                    onClick={handleOpenModal}
                                />,
                                <Popconfirm
                                    title="Remove media?"
                                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                                    onConfirm={() => {
                                        if (onChange) {
                                            onChange(null);
                                        }
                                        setMedia([]);
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        danger
                                        size="small"
                                        shape="circle"
                                        icon={<CloseOutlined />}
                                        key="remove"
                                    />
                                    ,
                                </Popconfirm>,
                            ]}
                        <Modal
                            open={isPreviewModalOpen}
                            onCancel={() => setIsPreviewModalOpen(false)}
                            title={singleFile?.name || "File Preview"}
                            centered
                            width="90%"
                            style={{ top: 20, overflow: 'auto' }}
                            styles={{
                                body: {
                                    height: '80vh', overflow: 'auto', padding: 0
                                }
                            }}

                            footer={
                                singleFile?.mime_type?.includes('pdf') &&
                                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
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
                                        <a href={singleFile.url} target="_blank" rel="noopener noreferrer" download>
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

                        >
                            {singleFile?.mime_type?.includes('pdf') ? (

                                <Document
                                    file={singleFile.url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading="Loading PDF..."
                                    onLoadError={(err) => {
                                        console.error("PDF Load Error:", err);
                                        // message.error("Failed to load PDF.");
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Page pageNumber={1} width={Math.min(window.innerWidth * 0.8, 700)} />
                                    </div>
                                </Document>

                            ) : singleFile?.mime_type?.includes('video') ? (
                                <video controls style={{ width: '100%' }}>
                                    <source src={singleFile.url} type={singleFile.mime_type} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : singleFile?.mime_type?.startsWith('image/') ? (
                                <Image
                                    alt={singleFile.name}
                                    src={singleFile.url}
                                    preview={false}
                                    style={{ objectFit: 'contain', width: '100%', maxHeight: '600px' }}
                                />
                            ) : (
                                <p>Preview not available for this file type.</p>
                            )}
                        </Modal>

                    </Card>
                </ConfigProvider>
            </>
        );
    }

    return (
        <Card style={{ width: "800px" }}>
            <Row gutter={[16, 16]}>
                {media.map((item: any, index: any) => (
                    <Col span={6} key={item.id}>
                        <Card
                            style={{ height: 150 }}
                            cover={<FilePreview file={item} style={{ height: 100 }} />}
                            actions={[
                                <EditOutlined key="edit" onClick={handleOpenModal} />,
                                <Popconfirm
                                    title="Remove media?"
                                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                                    onConfirm={() => onRemove(index)}
                                >
                                    <DeleteOutlined key="delete" style={{ color: "red" }} />
                                </Popconfirm>,
                            ]}
                        />
                    </Col>
                ))}
                {media.length === 0 && (
                    <Col span={24} style={{ textAlign: "center" }}>
                        <Empty
                            description={<Typography.Text>No Files Selected</Typography.Text>}
                        >
                            <Button type="primary" onClick={handleOpenModal}>
                                Add
                            </Button>
                        </Empty>
                    </Col>
                )}
            </Row>

        </Card>
    );


};

export default MediaCard;
