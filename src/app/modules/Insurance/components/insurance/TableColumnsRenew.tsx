import { Avatar, Badge, Button, Col, Descriptions, Popover, Row, Space, Tag, Tooltip, Typography } from "antd";
import { isPermission, usdFormat } from "utils/helper";
import React from "react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';
import FilePreviewModal from "@atoms/FilePreviewModal ";
import MedallionNumberTag from "@atoms/MedallionNumberTag";
import { FlagOutlined, RedoOutlined, UserOutlined, DownloadOutlined } from "@ant-design/icons";


dayjs.extend(utc);
const { Text } = Typography;

const TableColumnsRenew = (authPermission: any, setIsHardCardFormModalOpen: any, extraParameter: any) => [

    {
        title: "Corporation",
        dataIndex: "corporation",
        key: "corporation",
        render: (_: any, record: any) => {
            const { corporation, fullName } = record;
            const corporationName = corporation?.corporationName || "N/A";
            const medallionNumberCount = corporation?.corpMedallion?.length || 0;
            const memberFullName = corporation?.member?.fullName || "N/A";
            const discountName = corporation?.discount?.name || "N/A";
            const affiliationName = corporation?.affiliation?.name || "N/A";
            const corporationLogo = corporation?.media_relations?.find((item: any) => item?.collection == 'corporationLogo')?.media?.url
            const content = (
                <Descriptions
                    size="small"
                    column={1}
                    style={{ width: 200 }}
                    labelStyle={{ fontWeight: 'bold' }}
                >
                    {corporation?.corpMedallion?.map((item: any, index: number) => (
                        <Descriptions.Item key={index}>
                            <MedallionNumberTag medallion={item} />
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            );

            return (
                <>

                    <Row gutter={12} align="middle">
                        <Col>
                            <Avatar size={32} src={corporationLogo} icon={<UserOutlined />} alt="Corporation Avatar" />
                        </Col>
                        <Col flex="auto">
                            <Space size="small" direction="vertical">
                                <Popover content={content} title="Medallions">
                                    <Badge color="blue" count={medallionNumberCount}>
                                        <Tag bordered={false} color="blue">{corporationName}</Tag>
                                    </Badge>
                                </Popover>

                                <Tag bordered={false} color="cyan">{memberFullName}</Tag>

                                <Tag bordered={false} color="geekblue-inverse">{affiliationName}</Tag>

                                <Tag bordered={false} color={discountName === 'CMG' ? 'gold-inverse' : 'lime'}>
                                    {discountName}
                                </Tag>
                            </Space>
                        </Col>
                    </Row>

                    <span className="font-medium">{fullName}</span>
                </>
            );
        },
    },

    {
        title: "Medallion",
        dataIndex: "medallionNumber",
        key: "medallionNumber",
        width: 100,
        render: (medallionNumber: string, record: any) => {
            return <MedallionNumberTag medallion={record?.medallion} />;
        },
        sorter: true, // Server-side sorting enable
    },
    {
        title: "Vehicle",
        dataIndex: "vehicle",
        key: "vehicle",
        render: (_: any, record: any) => (getVehiclePopover(record)),
    },
    // {
    //     title: "Addons",
    //     dataIndex: "Addons",
    //     key: "addons",
    //     width: 350,
    //     render: (
    //         _: any,
    //         record: any
    //     ) => {

    //         return <InsuranceAddonCheckbox data={record} key={record.id} setRenewInsuranceData={extraParameter?.setRenewInsuranceData} />
    //     }
    // },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (_: any, { requestDate, effectiveDate, surrenderDate, flatCancelDate }: any) => {
            if (flatCancelDate) {
                const items = [
                    { key: "3", label: "Flat Cancel Date", children: <Tag color="rgba(0,0,0,0.25)">{flatCancelDate || 'N/A'}</Tag> },
                ];
                return <Descriptions style={{ width: "180px" }} column={1} size="small" items={items} />;
            } else {
                const items = [
                    { key: "1", label: "Request Date", children: <Tag color="gold">{moment(requestDate).format('MM-DD-YYYY')}</Tag> },
                    { key: "2", label: "Effective Date", children: <Tag color="green">{effectiveDate ? moment(effectiveDate).format('MM-DD-YYYY') : 'N/A'}</Tag> },
                ];
                return <Descriptions style={{ width: "180px" }} column={1} size="small" items={items} />;
            }
        },
    },
    {
        title: "Action",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_: any, record: any) => {
            let attachmentFileUrl = record?.media_relations?.find((item: any) => item.collection == 'attachmentFile')?.media?.url;
            return <>
                <Space.Compact block>
                    {
                        extraParameter?.isShowRenewButton && <Tooltip title="Renew Insurance">
                            <Button type="primary" icon={<RedoOutlined />} variant={'solid'} size="large" color="green" onClick={(e: any) => {
                                extraParameter?.setRenewInsuranceData(record)
                                extraParameter?.setRenewInsuranceModal(true)
                            }} />
                        </Tooltip>
                    }
                    {
                        extraParameter?.exportMainDataExport && <Tooltip title="Export Insurance">
                            <Button type="primary" icon={<DownloadOutlined />} variant={'solid'} size="large" color="blue" onClick={extraParameter.exportMainDataExport(record)} />
                        </Tooltip>
                    }
                    {
                        isPermission(authPermission, "Insurance Hard Card View") && attachmentFileUrl &&
                        <FilePreviewModal fileUrl={attachmentFileUrl} size="large" />
                    }
                    {
                        extraParameter?.isShowRenewButton && <Tooltip title="Insurance Surrender">
                            <Button type="primary" icon={<FlagOutlined />} variant={'solid'} size="large" color="danger" onClick={() => setIsHardCardFormModalOpen({ data: record, open: true })} />
                        </Tooltip>
                    }
                </Space.Compact>
                <Text>
                    {moment(record?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '0.85em' }}>
                    {moment(record?.createdAt).fromNow()}
                </Text>
            </>
        },
        sorter: true, // Server-side sorting enable
    },
];

const getPopover = (type: string, amount: number, insuranceCoverage: any) => {
    const data = insuranceCoverage.find((item: any) => item.type === type);

    if (!data) return usdFormat(amount);

    const typeName: any = {
        'affiliation': "Affiliation",
        'liability': "Liability",
        'workmanComp': "Workman Comp",
        'paceProgram': "Pace Program",
        'collision': "Collision",
    }

    const content = (
        <Descriptions
            size="small"
            bordered
            column={1}
            style={{ width: 280 }}
            labelStyle={{ fontWeight: 'bold' }}
        >
            <Descriptions.Item label="Type">
                <Text>{typeName?.[data.type]}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
                <Text>{moment(data.startDate).format('MM-DD-YYYY')}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
                <Text>{moment(data.endDate).format('MM-DD-YYYY')}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
                <Text>{usdFormat(data.totalAmount)}</Text>
            </Descriptions.Item>
            {
                data.rate && <Descriptions.Item label="Deductible Price">
                    <Text>{usdFormat(data.rate)}</Text>
                </Descriptions.Item>
            }

            <Descriptions.Item label="No of Days">
                <Text>{data.noOfDays}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Payable Amount">
                <Tag color="green">{usdFormat(data.payableAmount)}</Tag>
            </Descriptions.Item>
        </Descriptions>
    );

    return <Popover content={content}>  <Button color="magenta" size="small" variant="filled">
        {usdFormat(amount)}
    </Button></Popover>;
};

const getVehiclePopover = (data: any) => {

    const content = (
        <Descriptions
            size="small"
            column={1}
            style={{ width: 200 }}
            labelStyle={{ fontWeight: 'bold' }}
        >
            <Descriptions.Item label="Make">
                <Text>{data?.vehicle?.vehicleMake?.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Model">
                <Text>{data?.vehicle?.vehicleModel?.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
                <Text>{data?.vehicle?.vehicleType?.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Year">
                <Text>{data?.vehicle?.vehicleYear?.year}</Text>
            </Descriptions.Item>
        </Descriptions>
    );

    return <><Tag color="cyan">{data?.vehicle?.vinNumber}</Tag>{content}</>;
    return <Popover content={content}>  <Button color="cyan" size="small" variant="filled">
        {data?.vehicle?.vinNumber}
    </Button></Popover>;
};

export default TableColumnsRenew;
