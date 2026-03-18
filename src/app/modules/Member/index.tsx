import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Button, Card, notification, Popconfirm, Space, Typography } from 'antd';
import { HomeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { isMember, isPermission, isRole, isSuperAdmin } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Status from '@atoms/Status';
import EmailLink from '@atoms/EmailLink';
import PhoneLink from '@atoms/PhoneLink';
import Image from '@atoms/Image';

dayjs.extend(utc);
const { Text } = Typography;

const Member = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to parse URL params into tableParams format
  const parseUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const params: any = {
      pagination: {
        current: parseInt(searchParams.get('current') || '1'),
        pageSize: parseInt(searchParams.get('pageSize') || '10')
      },
      filters: {},
      sorter: null,
      date: {},
      status: null,
    };

    // Parse status
    const statusParam = searchParams.get('status');
    if (statusParam) {
      params.status = statusParam;
    }

    // Parse date range
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    if (start && end) {
      params.date = { start, end };
    }

    // Parse search
    const search = searchParams.get('search');
    if (search) {
      params.search = search;
    }

    // Parse sorting
    const sortField = searchParams.get('sortField');
    const sortOrder = searchParams.get('sortOrder');
    if (sortField && sortOrder) {
      params.sorter = {
        field: sortField,
        order: sortOrder === 'asc' ? 'ascend' : 'descend'
      };
    }

    return params;
  };

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
  const authRole: any = useSelector(
    (state: any) => state?.user_login
  );
  // Fetch Member Data
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`member`, {
        params: {
          pageSize: tableParams.pagination.pageSize,
          current: tableParams.pagination.current,
          ...tableParams.filters,
          ...tableParams.sorter,
          ...tableParams.date,
          status: tableParams.status, // Explicitly adding 'status'
          search: tableParams.search, // Explicitly adding 'status'
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

  // Initialize tableParams from URL on mount
  useEffect(() => {
    const urlParams = parseUrlParams();
    setTableParams(urlParams);
    setIsInitialized(true);
  }, []);

  // Sync tableParams to URL whenever they change (after initialization)
  useEffect(() => {
    if (!isInitialized) return; // Skip on initial mount

    const searchParams = new URLSearchParams();

    // Add pagination
    if (tableParams.pagination?.current && tableParams.pagination.current !== 1) {
      searchParams.set('current', tableParams.pagination.current.toString());
    }
    if (tableParams.pagination?.pageSize && tableParams.pagination.pageSize !== 10) {
      searchParams.set('pageSize', tableParams.pagination.pageSize.toString());
    }

    // Add status filter
    if (tableParams.status) {
      searchParams.set('status', tableParams.status);
    }

    // Add date range
    if (tableParams.date?.start && tableParams.date?.end) {
      searchParams.set('start', tableParams.date.start);
      searchParams.set('end', tableParams.date.end);
    }

    // Add search
    if (tableParams.search) {
      searchParams.set('search', tableParams.search);
    }

    // Add sorting
    if (tableParams.sorter?.field) {
      searchParams.set('sortField', tableParams.sorter.field);
      const sortOrder = tableParams.sorter.order === 'ascend' ? 'asc' : 'desc';
      searchParams.set('sortOrder', sortOrder);
    }

    const newSearch = searchParams.toString();
    const currentSearch = location.search.replace('?', '');

    // Only update URL if search params have changed
    if (newSearch !== currentSearch) {
      navigate(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { replace: true });
    }
  }, [JSON.stringify(tableParams), isInitialized]);

  // Fetch data on mount or table parameter changes
  useEffect(() => {
    if (!isInitialized) return; // Skip until initialized from URL
    fetchData();
  }, [JSON.stringify(tableParams), isInitialized]);

  // Handle table change
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    let search = null;
    if (tableParams.search) {
      search = tableParams.search;
    }
    setTableParams({ pagination, filters, sorter, search });
  };

  const onDelete = (value: any) => {
    confirm(value)
  }

  const confirm: any = (item: any) => {
    setLoading(true)
    const dataArray = Array.isArray(item) ? item : [item];
    axios.delete(`/member`, {
      data: {
        ids: dataArray
      }
    }).then((r) => {
      if (r.data.status === 1) {
        notification.success({
          message: 'Success',
          description: r.data.message,
          duration: 5,
        });
        fetchData()
      }

    }).catch((e) => { setLoading(false) });
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

  const getInitials = (firstName: string, lastName: string): string => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial || lastInitial || 'BR';
  };

  const getRandomColor = (name: string): { backgroundColor: string; color: string } => {
    const colors = [
      { backgroundColor: '#f56a00', color: '#fff' },
      { backgroundColor: '#7265e6', color: '#fff' },
      { backgroundColor: '#ffbf00', color: '#fff' },
      { backgroundColor: '#00a2ae', color: '#fff' },
      { backgroundColor: '#87d068', color: '#fff' }
    ];

    // Use name string to generate consistent color for same user
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Member table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => {
        const initials = getInitials(record.firstName, record.lastName);
        const colorStyle = getRandomColor(record.firstName + record.lastName);

        return (
          <div className="flex items-center gap-2">
            {record.avatarUrl ? (
              <Avatar
                size={32}
                src={record.avatarUrl}
                icon={<UserOutlined />} // Fallback icon if image fails to load
              />
            ) : (
              <Avatar
                size={32}
                style={colorStyle}
              >
                {initials}
              </Avatar>
            )}
            <span>{'\u00A0'}{record.fullName}</span>
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'emailAddress',
      key: 'emailAddress',
      render: (email: string) => <EmailLink email={email} />,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone: string) => <PhoneLink phone={phone} />,
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
      render: (item: any, record: any) => {
        return (
          <Space direction="vertical">
            <Space wrap>
              {
                isPermission(authPermission, 'Members Update') &&
                <Link to={'/member/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
              }
              {
                isPermission(authPermission, 'Members Delete') &&
                <Popconfirm
                  title="Delete the member"
                  description="Are you sure you want to delete this member? This action will also delete the associated user and may affect other modules linked to this member."
                  okText="Yes"
                  cancelText="No"
                  onConfirm={(e) => confirm(record.id)}
                >
                  <Button type="primary" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              }

            </Space>
          </Space>
        )
      },
    },
  ];

  const totalItems = dataCount;
  const activeItems = data.filter((member: any) => member.status === "active")
    .length;
  const inactiveItems = totalItems - activeItems;
  const mostRecentFirstItem = data[0]?.fullName || "";

  return (
    <>
      <Banner
        title="Members"
        totalItems={totalItems}
        activeItems={data.filter((member: any) => member.status === "active").length}
        inactiveItems={inactiveItems}
        mostRecentFirstItem={mostRecentFirstItem}
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Members" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={(!isMember() || isSuperAdmin()) && '/member/create'}
        // onExport={() => console.log("Export Clicked")}
        permission={'Members Create'}
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
          onDelete={isPermission(authPermission, 'Member Delete') ? onDelete : ''}
        />
      </Card>
    </>
  );
};

export default Member;
