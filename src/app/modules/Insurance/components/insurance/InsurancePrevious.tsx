import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Space, Typography, Badge, Avatar, Modal, Table, Tag, Popover, Tooltip } from 'antd';
import { BankOutlined, CarOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { isPermission, usdFormat } from 'utils/helper';
import axios from '../../../../../utils/axiosInceptor';
import Status from '@atoms/Status';
import moment from 'moment';
import FilePreviewModal from '@atoms/FilePreviewModal ';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import MedallionNumberTag from '@atoms/MedallionNumberTag';
const { Text } = Typography;



function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const PreviousInsurance = (props: any) => {
    const { isModalPreviousOpen, setIsModalPreviousOpen } = props;
    let query = useQuery();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const fetchData = () => {
        setLoading(true);
        axios
            .get(`insurances/previous`, {
                params: {
                    medallionNumber: props?.insuranceData?.medallionNumber,
                    pageType: query.get('page')
                },
            })
            .then((res) => {
                setData(res?.data?.data?.items)
            })
            .catch(() => {
                // Handle error notification
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (props?.insuranceData?.medallionNumber) {
            fetchData();
        }
    }, [props?.insuranceData?.medallionNumber, isModalPreviousOpen]);
    const authPermission: any = useSelector(
        (state: any) => state?.user_login?.auth_permission
    );

    const columns = [
        {
            title: "Corporation",
            dataIndex: "corporation",
            key: "corporation",
            render: (_: any, record: any) => {
                const { corporation, avatarUrl, fullName } = record;
                const corporationName = corporation?.corporationName || "N/A";
                const medallionNumberCount = corporation?.medallionsCount || 0;
                const memberFullName = corporation?.member?.fullName || "N/A";

                return (
                    <div className="flex items-center gap-3">
                        {avatarUrl ? (
                            <Avatar size={32} src={avatarUrl} icon={<UserOutlined />} alt="Corporation Avatar" />
                        ) : (
                            <Space size="small" direction="vertical">
                                <Badge color="blue" count={medallionNumberCount}>
                                    <Tag bordered={false} color="blue">{corporationName}</Tag>
                                </Badge>
                                <Tag bordered={false} color="cyan">{memberFullName}</Tag>
                            </Space>
                        )}
                        <span className="font-medium">{fullName}</span>
                    </div>
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
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: any, record: any) => <Status status={status} />,
        },
        {
            title: "Action",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (_: any, record: any) => {
                let attachmentFileUrl = record?.media_relations?.find((item: any) => item.collection == 'attachmentFile')?.media?.url;
                return <>
                    {record.status !== 'flat_cancel' &&
                        <Space.Compact block>
                            {
                                attachmentFileUrl &&
                                <FilePreviewModal fileUrl={attachmentFileUrl} />
                            }
                            {
                                isPermission(authPermission, "Insurance Update") &&
                                <Tooltip title="Edit">
                                    <Link to={`/insurance/edit/${record.id}`} onClick={(e) => { setIsModalPreviousOpen(false) }}>
                                        <Button type="primary" icon={<EditOutlined />} />
                                    </Link>
                                </Tooltip>
                            }
                        </Space.Compact >
                    }
                    <Text  > {moment(record?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text >
                    <br />
                    <Text type="secondary" style={{ fontSize: '0.85em' }}>
                        {moment(record?.createdAt).fromNow()}
                    </Text>
                </>


            },
        },
    ]


    return <>

        {/* <Button type="primary" size="large" onClick={() => setIsModalPreviousOpen(true)} color='gold' variant="solid">
            {'Previous Insurance'}
        </Button> */}
        <Modal
            title="Previous Insurance"
            open={isModalPreviousOpen}
            onCancel={() => setIsModalPreviousOpen(false)}
            footer={null}
            width={'70%'}
            loading={loading}
        >
            <Table dataSource={data} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />;
        </Modal>


    </>
}

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


export default PreviousInsurance;
