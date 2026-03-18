import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Col, notification, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { isPermission } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Status from '@atoms/Status';

dayjs.extend(utc);
const { Text } = Typography;

const Corporation = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [affiliations, setAffiliations] = useState([]);

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

  // Fetch Member Data
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`corporations`, {
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
    confirm(value)
  }

  const confirm: any = (item: any) => {
    setLoading(true)
    const dataArray = Array.isArray(item) ? item : [item];
    axios.delete(`/corporations`, {
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
        // pagination: { ...prev.pagination, current: 1 },
      }));
    } else {
      setTableParams((prev: any) => ({
        ...prev,
        date: {},
        // pagination: { ...prev.pagination, current: 1 },
      }));
    }
  };

  const getInitials = (firstName: string, lastName: string): string => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial || lastInitial || 'BR';
  };

  const getRandomColor = (name: string) => {
    const colors = [
      { backgroundColor: '#f56a00', color: '#fff' },
      { backgroundColor: '#7265e6', color: '#fff' },
      { backgroundColor: '#ffbf00', color: '#fff' },
      { backgroundColor: '#00a2ae', color: '#fff' },
      { backgroundColor: '#87d068', color: '#fff' }
    ];

    // Use name string to generate consistent color for same user
    if (!name) {
      return '';
    }
    const index = name?.split('')?.reduce((acc, char) => acc + char?.charCodeAt(0), 0) % colors?.length;
    return colors?.[index];
  };

  // Member table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => {

        return <Space direction="vertical" size={4}>
          <Badge color="lime" count={record?.medallionsCount}>
            <Tag bordered={false} color="blue">{record.corporationName}</Tag>
          </Badge>
          <Tag bordered={false} color="geekblue-inverse">{record?.affiliation?.name}</Tag>
        </Space>

      },
    },
    {
      title: 'Member Name',
      dataIndex: 'member_name',
      key: 'name',
      render: (_: any, record: any) => {
        let member = record?.member;
        const initials = getInitials(member?.firstName, member?.lastName);
        const colorStyle: any = getRandomColor(member?.firstName + member?.middleName + member?.lastName);

        return (
          <div className="flex items-center gap-2">
            {member?.avatarUrl ? (
              <Avatar
                size={32}
                src={member?.avatarUrl}
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
            <span>{'\u00A0'}{member?.firstName} {member?.middleName}  {member?.lastName}</span>
          </div>
        );
      },
    },
    Table.EXPAND_COLUMN,
    {
      title: 'FEDERAL (EIN)	',
      dataIndex: 'federal_ein',
      key: 'federal_ein',
      render: (_: any, record: any) => record.efinNo,
    },
    {
      title: 'Corporation Type',
      dataIndex: 'CorporationType',
      key: 'CorporationType',
      render: (_: any, record: any) => record?.corporation_type?.corpType,
    },
    {
      title: 'File Number',
      dataIndex: 'fileNumber',
      key: 'fileNumber',
      render: (_: any, record: any) => record.fileNumber,
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status: any) => <Status status={status} />,
    // },
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
                isPermission(authPermission, 'Corporations Update') &&
                <Link to={'/corporation/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
              }
              {
                isPermission(authPermission, 'Corporations Delete') &&
                <Popconfirm
                  title="Delete the corporations"
                  description="Are you sure to delete this corporation?"
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

  const RoleTags = ({ officers }: any) => {
    // Optional: Define a color mapping for roles
    const roleColors: { [key: string]: string } = {
      agent: "blue",
      president: "green",
      secretary: "volcano",
      signer: "purple",
    };

    return (
      <div>
        {officers.map((officer: any) => (
          <Tag key={officer.id} color={roleColors[officer.role] || "default"} >
            {officer.role.charAt(0).toUpperCase() + officer.role.slice(1)}:{" "}
            {officer.user.name}
          </Tag>
        ))}
      </div>
    );
  }

  const totalItems = dataCount;
  const activeItems = data.filter((item: any) => item.status === "active")
    .length;
  const inactiveItems = totalItems - activeItems;
  const mostRecentFirstItem = data[0]?.corporationName || "";


  const getAffiliations = async () => {
    axios.get(`/affiliations`).then((r) => {
      setAffiliations(r?.data?.data.items)
    }).catch((e) => { });
  }
  useEffect(() => {
    if (isPermission(authPermission, 'Affiliations List')) {
      getAffiliations()
    }
  }, [])

  const extraFilters = (
    <Col xs={24} sm={12} md={8} lg={5} xl={3}>
      <Select
        options={affiliations.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))}
        placeholder="Select a affiliation"
        allowClear
        loading={affiliations.length === 0}
        style={{ width: '100%' }}
        aria-label="Filter by affiliation"
      />
    </Col>
  );
  return (
    <>
      <Banner
        title="Corporations"
        totalItems={totalItems}
        activeItems={data.filter((item: any) => item.status === "active").length}
        inactiveItems={inactiveItems}
        mostRecentFirstItem={mostRecentFirstItem}
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Corporations" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={'/corporation/create'}
        permission={'Corporations Create'}

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
          //    extraFilters={extraFilters}
          expandable={{
            columnTitle: "Officers",
            expandedRowRender: (record: any) => {
              console.log("record.name", record.officers)
              return <RoleTags officers={record.officers} />
            },
          }}
          onDelete={isPermission(authPermission, 'Corporation Delete') ? onDelete : ''}
        />
      </Card>
    </>
  );
};

export default Corporation;
