import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Tag, Popconfirm, notification, Table, Typography } from 'antd';
import { GoogleOutlined, HomeOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { useSelector } from 'react-redux';
import { isPermission } from '../../../utils/helper';
const { Text } = Typography;

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
    title: 'User',
  }
];

const colors = [
  "processing",
  "success",
  "error",
  "warning",
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

const User = (props: any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (item: any, record: any) => {
        return `${record?.name}`;
      },
    },

    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role_od',
      key: 'role_od',
      render: (item: any, record: any) => {
        return record.roles?.map((item: any) => {
          return <Tag bordered={false} color={getRandomColor()}>
            {item.name}
          </Tag>
        });


      },
    },
    {
      title: 'Register By',
      dataIndex: 'social_accounts',
      key: 'social_accounts',
      render: (_: any, record: any) => {
        // prefer explicit registerSource, fall back to social_accounts field
        const source = record.registerSource ?? record.social_accounts ?? null;

        // If nothing present -> show "Web"
        if (!source) {
          return <Tag color="default">Web</Tag>;
        }

        // Google account -> show icon + label
        if (String(source).toLowerCase() === 'google') {
          return <Tag icon={<GoogleOutlined />} color="processing">Google</Tag>;
        }

        // If social_accounts is an array of providers, render tags
        if (Array.isArray(source) && source.length) {
          return source.map((s: any, idx: number) => (
            <Tag key={idx} bordered={false} color={getRandomColor()}>
              {String(s).charAt(0).toUpperCase() + String(s).slice(1)}
            </Tag>
          ));
        }

        // Fallback: show text label (capitalized)
        return <Tag color="default">{String(source).charAt(0).toUpperCase() + String(source).slice(1)}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (item: any, record: any) => {

        if (item) {
          return <Tag color={item == 'active' ? 'green' : 'red'} key={item}>
            {item?.toUpperCase()}
          </Tag>
        }

      },
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
                isPermission(authPermission, 'Users Update') &&
                <Link to={'/users/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
              }
              {
                record.isAutoGen == false && isPermission(authPermission, 'Users Delete') &&
                <Popconfirm
                  title="Delete the role"
                  description="Are you sure to delete this user?"
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
      .get(`users`, {
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
    axios.delete(`/users`, {
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
        title="Users"
        totalItems={total}
        activeItems={data.filter((item: any) => item.status === "active").length}
        inactiveItems={inactiveItems}
        mostRecentFirstItem={mostRecentFirstItem}
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Users" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={'/users/create'}
        permission={'Users Create'}
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
  )
};

export default User;
