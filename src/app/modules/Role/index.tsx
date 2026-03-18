import React, { useEffect, useState } from 'react';
import Banner from '../../molecules/Banner';
import AdvanceTable from '../../molecules/AdvanceTable';
import { Button, Card, Space, Tag, Popconfirm, notification, Table, Avatar, Tooltip, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import { getParams, isPermission } from '../../../utils/helper';
import { useSelector } from 'react-redux';
import Status from '@atoms/Status';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ImportOutlined,
  ExportOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
const { Text } = Typography;

export const getActionIcon = (action: string) => {
  if (action.toLowerCase() === 'create') {
    return <PlusOutlined />;
  } else if (action.toLowerCase() === 'edit' || action.toLowerCase() === 'update') {
    return <EditOutlined />;
  } else if (action.toLowerCase() === 'delete') {
    return <DeleteOutlined />;
  } else if (action.toLowerCase() === 'view') {
    return <EyeOutlined />;
  } else if (action.toLowerCase() === 'import') {
    return <ImportOutlined />;
  } else if (action.toLowerCase() === 'export') {
    return <ExportOutlined />;
  } else if (action.toLowerCase() === 'list') {
    return <UnorderedListOutlined />;
  }
};

const breadCrumbList: any = [
  {
    title: (
      <>
        <Link to="/">
          <HomeOutlined />
          <span>Dashboard</span>
        </Link>
      </>
    ),
  },
  {
    title: 'Roles',
  }
];


const getRandomColor = (name: string) => {
  const colors = [
    '#f56a00', // Orange
    '#87d068', // Green
    '#1677ff', // Blue
    '#ff4d4f', // Red
    '#faad14', // Yellow
    '#722ed1', // Purple
    '#13c2c2', // Cyan
    '#2f54eb', // Deep Blue
    '#eb2f96', // Magenta
    '#52c41a', // Light Green
    '#fa541c', // Reddish Orange
    '#a0d911', // Lime Green
    '#1890ff', // Light Blue
    '#13c2c2', // Teal
    '#ffec3d', // Bright Yellow
    '#b37feb', // Lavender
    '#73d13d', // Spring Green
    '#ff7a45', // Coral
    '#ffa940', // Light Orange
    '#d3adf7', // Light Purple
  ];
  return colors[name.length % colors.length];
};


const Role = (props: any) => {
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );
  const columns = [
    {
      title: 'Role',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Permission',
      dataIndex: 'permission',
      key: 'permission',
      width: 500,
      render: (item: any, record: any) => {
        return <Space size={[8, 5]} wrap align="center">
          {
            record?.permissions?.map((item: any) => {
              return item && <Tag bordered={false} icon={getActionIcon(item?.name.split(' ')[1])} color={item?.name?.includes('Delete') ? 'error' : 'green'} key={item}>
                {item?.name?.toUpperCase()}
              </Tag>
            })
          }
        </Space>
      }
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (users: any[], record: any) => {
        return (
          <Avatar.Group
            size="large"
            max={{
              popover: { trigger: 'click' },
              count: 2,
              style: { color: '#f56a00', backgroundColor: '#fde3cf' },
            }}
          >
            {users.map((user) => (
              <Tooltip title={user.name} key={user.id}>
                <Avatar style={{ backgroundColor: getRandomColor(user.name) }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        );
      },
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (item: any, record: any) => {

    //     return <Status status={item} />
    //   }

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
                isPermission(authPermission, 'Roles Update') &&
                <Link to={'/roles/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
              }
              {
                isPermission(authPermission, 'Roles Delete') &&
                <Popconfirm
                  title="Delete the role"
                  description="Are you sure to delete this role?"
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


  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [dataCount, setDataCount] = useState(0);

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
    }
  });


  const fetchData = () => {
    setLoading(true);
    axios
      .get(`roles`, {
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

  const handelDateRange = (value: any) => {

    if (value && value.length > 0) {
      const { first_record, last_record } = data;

      const startDate = moment(moment(new Date(value[0])).utc().format('MM-DD-YYYY')).utc().format('MM-DD-YYYY') + ' ' + moment(last_record).utc().format('HH:mm:ss');

      let endDate: any = moment(new Date(value[1]))

      if (endDate.isSame(endDate.clone().endOf('month'), 'day')) {
        endDate = endDate.endOf('day').format('MM-DD-YYYY') + ' ' + moment(first_record).utc().format('HH:mm:ss')
      } else {
        endDate = moment(endDate).utc().format('MM-DD-YYYY')
      }

      setTableParams(
        {
          pagination: {
            current: 1,
            pageSize: 2,
          },
          date: {
            start: startDate,
            end: endDate
          }
        }
      );
    } else {
      setTableParams(
        {
          pagination: {
            current: 1,
            pageSize: 2,
          },
        }
      );
    }

  }

  const onDelete = (value: any) => {
    confirm(value)
  }

  const confirm: any = (item: any) => {
    setLoading(true)
    const dataArray = Array.isArray(item) ? item : [item];
    axios.delete(`/roles`, {
      data: {
        ids: dataArray
      }
    }).then((r) => {
      notification.success({
        message: 'Success',
        description: r.data.message,
        duration: 5,
      });
      fetchData()

    }).catch((e) => { setLoading(false) });
  };

  const total = dataCount;
  const active = data.filter((member: any) => member.status === "active")
    .length;
  const inactiveItems = total - active;
  const mostRecentFirstItem = data[0]?.name || "";

  return (
    <>
      <Banner
        title="Roles"
        totalItems={total}
        activeItems={data.filter((item: any) => item.status === "active").length}
        inactiveItems={inactiveItems}
        mostRecentFirstItem={mostRecentFirstItem}
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Roles" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={'/roles/create'}
        permission={'Roles Create'}
      />
      <Card>
        <AdvanceTable
          data={data}
          loading={loading}
          columns={columns}
          tableParams={tableParams}
          setTableParams={setTableParams}
          handleTableChange={handleTableChange}
          onDelete={isPermission(authPermission, 'Role Delete') ? onDelete : undefined}
        />
      </Card>
    </>
  );
}

export default Role;
