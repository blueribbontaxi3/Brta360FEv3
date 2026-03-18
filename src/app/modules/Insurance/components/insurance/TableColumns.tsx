import Icon, { CarOutlined, CloseCircleOutlined, CreditCardOutlined, DeleteOutlined, EditOutlined, ExclamationCircleFilled, EyeOutlined, HistoryOutlined, PrinterOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Col, Descriptions, Divider, Modal, Popconfirm, Popover, Row, Space, Tag, Tooltip, Typography } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { isPermission, usdFormat } from "utils/helper";
import Status from "@atoms/Status";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';
import FilePreviewModal from "@atoms/FilePreviewModal ";
import SurrenderIconCustomIcon from '../../../../../assets/surrender.svg?react';
import type { GetProps } from 'antd';
import MedallionNumberTag from "@atoms/MedallionNumberTag";
import InsuranceAction from "./InsuranceAction";

type CustomIconComponentProps = GetProps<typeof Icon>;

dayjs.extend(utc);
const { Text } = Typography;

const SurrenderIcon = (props: Partial<CustomIconComponentProps>) => {
    return <Icon component={SurrenderIconCustomIcon} {...props} />
}


const getTableColumns = (authPermission: any, confirmDelete: (id: string) => void, setIsHardCardFormModalOpen: any, handleModelPreviousHistory: any, dateColumn: string) => [

    {
        title: "Corporation",
        dataIndex: "corporation",
        key: "corporation",
        render: (_: any, record: any) => {
            const { corporation, fullName } = record;
            const corporationName = corporation?.corporationName || "N/A";
            const medallionNumberCount = corporation?.corpMedallion?.length || 0;
            const member = corporation?.member;
            const memberFullName = member?.fullName || "N/A";
            const discountName = corporation?.discount?.name || "N/A";
            const affiliationName = corporation?.affiliation?.name || "N/A";
            const corporationLogo = corporation?.media_relations?.find((item: any) => item?.collection == 'corporationLogo')?.media?.url;

            // Medallions list content
            const medallionsContent = (
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

            // Member popover content
            const memberPopoverContent = member ? (
                <div style={{ minWidth: 280 }}>
                    <Descriptions column={1} size="small" bordered>
                        <Descriptions.Item label="Full Name">
                            {member.fullName || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim()}
                        </Descriptions.Item>
                        <Descriptions.Item label="First Name">{member.firstName}</Descriptions.Item>
                        <Descriptions.Item label="Middle Name">{member.middleName || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Last Name">{member.lastName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{member.emailAddress}</Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: 12, textAlign: 'right' }}>
                        <Link to={`/member/edit/${member.id}`}>
                            <Button type="primary" size="small" icon={<UserOutlined />}>
                                Go to Member
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <Text type="secondary">No member data available</Text>
            );

            return (
                <>
                    <Row gutter={12} align="middle">
                        <Col>
                            <Avatar size={32} src={corporationLogo} icon={<UserOutlined />} alt="Corporation Avatar" />
                        </Col>
                        <Col flex="auto">
                            <Space size="small" direction="vertical">
                                <Popover content={medallionsContent} title="Medallions">
                                    <Badge color="blue" count={medallionNumberCount}>
                                        <Tag bordered={false} color="blue" style={{ cursor: 'pointer' }}>{corporationName}</Tag>
                                    </Badge>
                                </Popover>

                                <Popover
                                    content={memberPopoverContent}
                                    title="Member Information"
                                    trigger="hover"
                                    placement="right"
                                >
                                    <Tag bordered={false} color="cyan" style={{ cursor: 'pointer' }}>{memberFullName}</Tag>
                                </Popover>

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
    {
        title: "Addons",
        dataIndex: "Addons",
        key: "addons",
        width: 350,
        render: (
            _: any,
            {
                liabilityPayableAmount,
                affiliationPayableAmount,
                workmanPayableAmount,
                collisionPayableAmount,
                paceProgramPayableAmount,
                totalPayableAmount,
                insuranceCoverage,
                collision,
                workmanComp,
                paceProgram
            }: any
        ) => {
            const items = [
                {
                    key: "1",
                    label: "Liability",
                    children: getPopover("liability", liabilityPayableAmount, insuranceCoverage)
                },
                {
                    key: "2",
                    label: "Affiliation",
                    children: getPopover("affiliation", affiliationPayableAmount, insuranceCoverage)
                },
                {
                    key: "3",
                    label: "Workman",
                    children: getPopover("workmanComp", workmanPayableAmount, insuranceCoverage, {
                        workmanComp
                    })
                },
                {
                    key: "4",
                    label: "Collision",
                    children: getPopover("collision", collisionPayableAmount, insuranceCoverage, {
                        collision,
                    })
                },
                {
                    key: "5",
                    label: "Pace Program",
                    children: getPopover("paceProgram", paceProgramPayableAmount, insuranceCoverage, {
                        paceProgram
                    })
                },
                {
                    key: "6",
                    label: "Total Amount",
                    children: (
                        <Tag color="geekblue" bordered={false}>
                            {usdFormat(totalPayableAmount)}
                        </Tag>
                    )
                }
            ];
            return (
                <Descriptions
                    style={{ width: "350px" }}
                    column={2}
                    size="small"
                    items={items}
                />
            );
        }
    },
    {
        title: "Policy #",
        dataIndex: "policy",
        key: "policy",
        width: 110,
        render: (_: any, { policyNumberLiability, policyNumberWorkmanComp, policyNumberCollision }: any) => {
            const items = [
                { key: "1", label: "L", children: policyNumberLiability },
                { key: "2", label: "W", children: policyNumberWorkmanComp },
                { key: "3", label: "C", children: policyNumberCollision },
            ];
            return <Descriptions style={{ width: "110px" }} column={1} size="small" items={items} />;
        },
    },
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
                    { key: "3", label: "Surrender Date", children: <Tag color="red">{surrenderDate ? moment(surrenderDate).format('MM-DD-YYYY') : 'N/A'}</Tag> },
                ];
                return <Descriptions style={{ width: "180px" }} column={1} size="small" items={items} />;
            }
        },
        sorter: true,
        filters: [
            // { text: 'Create Date', value: 'createdAt' },
            // { text: 'Updated Date', value: 'updatedAt' },
            { text: 'Request Date', value: 'requestDate' },
            { text: 'Effective Date', value: 'effectiveDate' },
            { text: 'Surrender Date', value: 'surrenderDate' },
        ],
        filteredValue: [dateColumn || 'created_at'],
        filterMultiple: false,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: any, record: any) => {
            if (status == 'surrender') {
                return <Link to={`/insurance/create?insurance_id=${record.id}&medallion_id=${record?.medallion?.id}&medallion_number=${record?.medallionNumber}&page=renew_insurance`}>
                    <SurrenderIcon style={{ fontSize: 70 }} />
                    {/* <Tag color={'red'} style={{ cursor: "pointer" }} >

                    <CloseCircleOutlined style={{ marginRight: 5 }} />
                    {status?.toUpperCase()}

                </Tag>  */}
                </Link>
            }
            return (
                <Status
                    status={status}
                    authPermissions={authPermission}
                    onClick={() => setIsHardCardFormModalOpen({ data: record, open: true })}
                />
            );
        },
        sorter: true, // Server-side sorting enable
    },
    {
        title: "Action",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_: any, record: any) => {

            return <InsuranceAction record={record} confirmDelete={confirmDelete} setIsHardCardFormModalOpen={setIsHardCardFormModalOpen} handleModelPreviousHistory={handleModelPreviousHistory} authPermission={authPermission} />
            let attachmentFileUrl = record?.media_relations?.find((item: any) => item.collection == 'attachmentFile')?.media?.url;
            return <>
                {record.status !== 'renew' && (
                    <>
                        <Space.Compact block>
                            {isPermission(authPermission, "Insurance Update") && record.status !== 'surrender' && record.status !== 'flat_cancel' && (
                                <Tooltip title="Edit">
                                    <Link to={`/insurance/edit/${record.id}`}>
                                        <Button type="primary" icon={<EditOutlined />} />
                                    </Link>
                                </Tooltip>
                            )}
                            {isPermission(authPermission, "Insurance Delete") && (
                                <Tooltip title="Delete">
                                    <Popconfirm
                                        title="Delete Insurance"
                                        description="Are you sure you want to delete this insurance?"
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => confirmDelete(record.id)}
                                    >
                                        <Button type="primary" icon={<DeleteOutlined />} danger />
                                    </Popconfirm>
                                </Tooltip>
                            )}
                            {
                                isPermission(authPermission, "Insurance Hard Card View") && attachmentFileUrl &&
                                <FilePreviewModal fileUrl={attachmentFileUrl} />
                            }
                            {
                                record.status !== 'flat_cancel' && <Button onClick={() => setIsHardCardFormModalOpen({ data: record, pdfModalOpen: true })} icon={<PrinterOutlined />} color="gold" variant="solid" />
                            }
                            <Tooltip title="Previous History">
                                <Button icon={<HistoryOutlined />} onClick={() => handleModelPreviousHistory(record)} variant="filled" color="magenta" />
                            </Tooltip>

                        </Space.Compact>
                        <Text>{moment(record?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '0.85em' }}>
                            {moment(record?.createdAt).fromNow()}
                        </Text>
                    </>
                )}

                {record.status == 'renew' && isPermission(authPermission, "Insurance Delete") && (
                    <>
                        <Tooltip title="Delete">
                            <Popconfirm
                                title="Delete Insurance"
                                description="Are you sure you want to delete this insurance?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => confirmDelete(record.id)}
                            >
                                <Button type="primary" icon={<DeleteOutlined />} danger />
                            </Popconfirm>
                        </Tooltip> <br />
                        <Text>{moment(record?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '0.85em' }}>
                            {moment(record?.createdAt).fromNow()}
                        </Text>
                    </>
                )}
            </>
        },
        sorter: true, // Server-side sorting enable
    },
];

const getPopover = (type: string, amount: number, insuranceCoverage: any, record: any = {}) => {
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

    // if (record?.collision == 'Added') {
    //     return (
    //         <Popover content={content}>
    //             <Button color="magenta" size="middle" variant="filled">
    //                 {usdFormat(amount)}
    //             </Button>
    //         </Popover>
    //     );
    // }


    const isCollisionAdded = type == 'collision' && record?.collision === 'Added';
    const isWorkmanCompAdded = type == 'workmanComp' && record?.workmanComp === 'Added';
    const isLiabilityAffiliation = type == 'liability' || type == 'affiliation';

    if (isCollisionAdded || isLiabilityAffiliation || isWorkmanCompAdded) {
        return <Popover content={content}>
            <Badge count={`${data.noOfDays}`} overflowCount={400} >
                <Button color="magenta" size="middle" variant="filled">
                    {usdFormat(amount)}
                </Button>
            </Badge>
        </Popover>
    } else {
        return usdFormat(amount);
    }

};

const getVehiclePopover = (data: any) => {
    const vehicle = data?.vehicle;

    if (!vehicle) {
        return <Tag color="warning">No Vehicle Assigned</Tag>;
    }

    const content = (
        <div style={{ minWidth: 280 }}>
            <Descriptions
                size="small"
                column={1}
                bordered
                labelStyle={{ fontWeight: 'bold' }}
            >
                <Descriptions.Item label="VIN Number">
                    <Tag color="cyan">{vehicle?.vinNumber}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Make">
                    <Text>{vehicle?.vehicleMake?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Model">
                    <Text>{vehicle?.vehicleModel?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Type">
                    <Text>{vehicle?.vehicleType?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Year">
                    <Text>{vehicle?.vehicleYear?.year}</Text>
                </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
                <Link to={`/vehicle/edit/${vehicle.id || data?.vehicleId}`}>
                    <Button type="primary" size="small" icon={<CarOutlined />}>
                        Go to Vehicle
                    </Button>
                </Link>
            </div>
        </div>
    );

    return (
        <Popover content={content} title="Vehicle Information" trigger="hover" placement="top">
            <div style={{ cursor: 'pointer' }}>
                <Tag color="cyan">{vehicle?.vinNumber}</Tag>
                {/* <br />
                <Text type="secondary" style={{ fontSize: '0.85em' }}>
                    {vehicle?.vehicleType?.name}, {vehicle?.vehicleYear?.year} {vehicle?.vehicleMake?.name} {vehicle?.vehicleModel?.name}
                </Text> */}
            </div>
        </Popover>
    );
};

export default getTableColumns;
