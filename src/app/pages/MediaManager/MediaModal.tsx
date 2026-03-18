import React, { useState } from "react";
import {
    Modal,
    Button,
    Input,
    Descriptions,
    Row,
    Col,
    Typography,
    message,
    Flex,
    Space,
    Tooltip,
} from "antd";
import { CloseOutlined, CopyOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";
import prettyBytes from "pretty-bytes";
import { Document, Page, pdfjs } from "react-pdf";

const { Title, Text } = Typography;

const MediaModal = ({ visible, onClose, mediaDetails, items, setSingleItem }: any) => {
    const [altText, setAltText] = useState("");
    const [description, setDescription] = useState("");
    const [numPages, setNumPages] = useState<any>(null);
    const [pageNumber, setPageNumber] = useState<any>(1);
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success("URL copied to clipboard!");
        });
    };

    function getNextItem(currentId: any) {
        const currentIndex = items.findIndex((item: any) => item.id === currentId);
        if (currentIndex !== -1 && currentIndex < items.length - 1) {
            return items[currentIndex + 1];
        }

        return null;
    }

    function getPreviousItem(currentId: any) {
        const currentIndex = items.findIndex((item: any) => item.id === currentId);
        if (currentIndex !== -1 && currentIndex > 0) {
            return items[currentIndex - 1];
        }
        return null;
    }

    function onLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
    }

    const renderMedia = () => {
        const mime = mediaDetails?.mime_type;
        if (mime?.startsWith("image/")) {
            return (
                <img
                    src={mediaDetails?.url}
                    alt={altText || mediaDetails?.name}
                    style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "400px",
                        objectFit: "contain",
                    }}
                />
            );
        } else if (mime?.startsWith("video/")) {
            return (
                <video
                    controls
                    src={mediaDetails?.url}
                    style={{
                        width: "100%",
                        objectFit: "contain",
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            );
        } else if (mime?.startsWith("audio/")) {
            return (
                <audio
                    controls
                    src={mediaDetails?.url}
                    style={{
                        width: "100%",
                    }}
                >
                    Your browser does not support the audio tag.
                </audio>
            );
        } else if (mime?.startsWith("application/pdf")) {
            return (
                <Document file={mediaDetails?.url} onLoadSuccess={onLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                    {numPages > 1 && (
                        <div>
                            <Button
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(pageNumber - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                disabled={pageNumber >= numPages}
                                onClick={() => setPageNumber(pageNumber + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </Document>
            );
        } else {
            return (
                <Text type="warning">Preview not available for this file type.</Text>
            );
        }
    };

    return (
        <Modal
            mask={false}
            title={
                <Flex justify="space-between" align="middle" style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '18px' }}>
                        Media Details
                    </Text>
                    <Space>
                        {/* Tooltip and button for Preview Media */}
                        <Tooltip title="Preview Media">
                            <Button
                                icon={<LeftOutlined />}
                                aria-label="Preview Previous Media"
                                onClick={() => {
                                    const previousItem = getPreviousItem(mediaDetails?.id);
                                    if (previousItem) setSingleItem(previousItem);
                                }}
                                disabled={!getPreviousItem(mediaDetails?.id)} // Disable button if no previous item
                            />
                        </Tooltip>
                        {/* Tooltip and button for Next Media */}
                        <Tooltip title="Next Media">
                            <Button
                                icon={<RightOutlined />}
                                aria-label="Preview Next Media"
                                onClick={() => {
                                    const nextItem = getNextItem(mediaDetails?.id);
                                    if (nextItem) setSingleItem(nextItem);
                                }}
                                disabled={!getNextItem(mediaDetails?.id)} // Disable button if no next item
                            />
                        </Tooltip>
                        {/* Tooltip and button for Close Modal */}
                        <Tooltip title="Close">
                            <Button
                                icon={<CloseOutlined />}
                                onClick={onClose}
                                aria-label="Close Media Details"
                            />
                        </Tooltip>
                    </Space>
                </Flex>
            }
            open={visible}
            // onCancel={onClose}
            closable={false}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
            ]}
            maskClosable={false} // Disable closing when clicking outside
            centered
            width={"95%"}
            styles={{
                mask: {
                    height: "95vh", // Modal body height (excluding header/footer)
                },
                content: {
                    height: "95vh", // Modal body height (excluding header/footer)
                },
                body: {
                    height: "calc(100% - 32px - 24px - 24px)",
                },
            }}
        >
            {/* Ant Design Grid for Layout */}
            <Row gutter={[16, 16]} style={{ height: "100%" }}>
                {/* Left Side: Image Preview */}
                <Col xs={24} sm={24} md={18} lg={16}>
                    <Flex
                        style={{
                            height: "100%",
                        }}
                        justify={"center"}
                        align={"center"}
                    >
                        {renderMedia()}
                    </Flex>
                </Col>

                {/* Right Side: Details */}
                <Col
                    xs={24}
                    sm={24}
                    md={18}
                    lg={8}
                    style={{
                        height: "100%",
                        overflowY: "auto",
                        paddingRight: 8,
                    }}
                >
                    <div style={{ width: "40%", margin: "0 auto" }}>{renderMedia()}</div>
                    <Descriptions
                        title="Details"
                        bordered
                        size="small"
                        column={1}
                        labelStyle={{ fontWeight: "bold" }}
                    >
                        <Descriptions.Item label="Title">
                            {mediaDetails?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="File Name">
                            {mediaDetails?.file_name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Size">
                            {prettyBytes(mediaDetails?.size ?? 0)}
                        </Descriptions.Item>
                        <Descriptions.Item label="MIME Type">
                            {mediaDetails?.mime_type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Created At">
                            {moment(mediaDetails?.createdAt).format("MMMM Do YYYY, h:mm:ss A")}{" "}
                            {/* Formatted Date */}
                            <br />
                            <Text type="secondary">
                                ({moment(mediaDetails?.createdAt).fromNow()})
                            </Text>{" "}
                            {/* Relative Time */}
                        </Descriptions.Item>

                        <Descriptions.Item label="Updated At">
                            {moment(mediaDetails?.updatedAt).format("MMMM Do YYYY, h:mm:ss A")}{" "}
                            {/* Formatted Date */}
                            <br />
                            <Text type="secondary">
                                ({moment(mediaDetails?.updatedAt).fromNow()})
                            </Text>{" "}
                            {/* Relative Time */}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Input Field for URL with Copy Button */}
                    <Row style={{ marginTop: "16px" }} gutter={8} align="middle">
                        <Col span={24}>
                            <Input addonAfter={<CopyOutlined onClick={() => handleCopy(mediaDetails?.url)} twoToneColor={'primary'} />} value={mediaDetails?.url} readOnly />
                            {/* <Input
                                placeholder="Alt Text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                style={{ marginTop: 16 }}
                            />

                            <Input.TextArea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                style={{ marginTop: 16 }}
                            /> */}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Modal>
    );
};

export default MediaModal;
