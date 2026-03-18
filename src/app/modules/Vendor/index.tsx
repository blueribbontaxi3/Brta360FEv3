import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, notification, Popconfirm, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { isMember, isPermission, isSuperAdmin } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Status from '@atoms/Status';
import EmailLink from '@atoms/EmailLink';
import PhoneLink from '@atoms/PhoneLink';

dayjs.extend(utc);
const { Text } = Typography;

const Vendor = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData]: any = useState([]);
    const [dataCount, setDataCount] = useState(0);

    const [tableParams, setTableParams]: any = useState({
        pagination: { current: 1, pageSize: 10 },
        filters: {},
        sorter: null,
        date: {},
        status: null,
    });

    const authPermission: any = useSelector(
        (state: any) => state?.user_login?.auth_permission
    );

    // Fetch Vendors Data
    const fetchData = () => {
        setLoading(true);
        axios
            .get(`vendor`, {
                params: {
                    pageSize: tableParams.pagination.pageSize,
                    current: tableParams.pagination.current,
                    ...tableParams.filters,
                    ...tableParams.sorter,
                    ...tableParams.date,
                    status: tableParams.status,
                    search: tableParams.search,
                },
            })
            .then((res) => {
                const { items = [], total = 0 } = res?.data?.data || {};
                setData(items);
                setDataCount(total);
                setTableParams((prev: any) => ({
                    ...prev,
                    pagination: { ...prev.pagination, total },
                }));
            })
            .catch(() => {
                // Handle error notification
            })
            .finally(() => setLoading(false));
    };

    // Fetch data on mount or table parameter changes
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    // Handle table change
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        let search = null;
        if (tableParams.search) {
            search = tableParams.search;
        }
        setTableParams({ pagination, filters, sorter, search });
    };

    const onDelete = (value: any) => {
        confirm(value);
    };

    const confirm: any = (item: any) => {
        setLoading(true);
        const dataArray = Array.isArray(item) ? item : [item];
        axios
            .delete(`/vendor`, {
                data: {
                    ids: dataArray,
                },
            })
            .then((r) => {
                if (r.data.status === 1) {
                    notification.success({
                        message: 'Success',
                        description: r.data.message,
                        duration: 5,
                    });
                    fetchData();
                }
            })
            .catch(() => {
                setLoading(false);
            });
    };

    // Handle date range filter
    const handleDateRange = (value: any) => {
        if (value?.length === 2) {
            const startDate = value[0].startOf('day').format('MM-DD-YYYY HH:mm:ss');
            const endDate = value[1].endOf('day').format('MM-DD-YYYY HH:mm:ss');
            setTableParams((prev: any) => ({
                ...prev,
                date: { start: startDate, end: endDate },
                pagination: { ...prev.pagination, current: 1 },
            }));
        } else {
            setTableParams((prev: any) => ({
                ...prev,
                date: {},
                pagination: { ...prev.pagination, current: 1 },
            }));
        }
    };

    const getInitials = (name: string): string => {
        const parts = name?.split(' ') || [];
        const firstInitial = parts[0]?.charAt(0)?.toUpperCase() || '';
        const lastInitial = parts[1]?.charAt(0)?.toUpperCase() || '';
        return firstInitial + lastInitial || 'VN';
    };

    const getRandomColor = (name: string): { backgroundColor: string; color: string } => {
        const colors = [
            { backgroundColor: '#f56a00', color: '#fff' },
            { backgroundColor: '#7265e6', color: '#fff' },
            { backgroundColor: '#ffbf00', color: '#fff' },
            { backgroundColor: '#00a2ae', color: '#fff' },
            { backgroundColor: '#87d068', color: '#fff' },
        ];

        const index = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    // Vendor table columns
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: any) => {
                const initials = getInitials(record.name);
                const colorStyle = getRandomColor(record.name);

                return (
                    <div className="flex items-center gap-2">
                        {record.avatarUrl ? (
                            <Avatar
                                size={32}
                                src={record.avatarUrl}
                                icon={<UserOutlined />}
                            />
                        ) : (
                            <Avatar size={32} style={colorStyle}>
                                {initials}
                            </Avatar>
                        )}
                        <span>{'\u00A0'}{record.name}</span>
                    </div>
                );
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email: string) => <EmailLink email={email} />,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone: string) => <PhoneLink phone={phone} />,
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            render: (company: string) => <Text>{company || '-'}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: any) => <Status status={status} />,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: any) => (
                <>
                    <Text>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '0.85em' }}>
                        {moment(createdAt).fromNow()}
                    </Text>
                </>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => {
                return (
                    <Space direction="vertical">
                        <Space wrap>
                            {isPermission(authPermission, 'Vendors Update') && (
                                <Link to={'/vendor/edit/' + record.id}>
                                    <Button type="primary" icon={<EditOutlined />} />
                                </Link>
                            )}
                            {isPermission(authPermission, 'Vendors Delete') && (
                                <Popconfirm
                                    title="Delete the vendor"
                                    description="Are you sure you want to delete this vendor?"
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={() => confirm(record.id)}
                                >
                                    <Button type="primary" icon={<DeleteOutlined />} danger />
                                </Popconfirm>
                            )}
                        </Space>
                    </Space>
                );
            },
        },
    ];

    const totalItems = dataCount;
    const activeItems = data.filter((vendor: any) => vendor.status === 'active').length;
    const inactiveItems = totalItems - activeItems;
    const mostRecentFirstItem = data[0]?.name || '';

    return (
        <>
            <Banner
                title="Vendors"
                totalItems={totalItems}
                activeItems={activeItems}
                inactiveItems={inactiveItems}
                mostRecentFirstItem={mostRecentFirstItem}
                breadCrumb={[
                    { title: 'Home', path: '/' },
                    { title: 'Vendors' },
                ]}
                buttonTitle={'Create'}
                buttonUrl={(!isMember() || isSuperAdmin()) && '/vendor/create'}
                permission={'Vendors Create'}
            />
            <Card>
                <AdvanceTable
                    data={data}
                    loading={loading}
                    columns={columns}
                    tableParams={tableParams}
                    setTableParams={setTableParams}
                    handleTableChange={handleTableChange}
                    handleDateRange={handleDateRange}
                    onDelete={isPermission(authPermission, 'Vendors Delete') ? onDelete : ''}
                />
            </Card>
        </>
    );
};

export default Vendor;
