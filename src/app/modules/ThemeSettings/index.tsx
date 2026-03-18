import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Tag, Popconfirm, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { useSelector } from 'react-redux';
import { isPermission } from '../../../utils/helper';

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

const getParams = (params: any) => {
  return {
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  };
}

const pageSize = 1
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
        return record.roles?.[0]?.name;
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (item: any, record: any) => {

        return moment(record.created_at).format('MMMM Do YYYY, h:mm:ss a');

      },
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
                isPermission(authPermission,'User Update') &&
                <Link to={'/users/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
              }
              {
                isPermission(authPermission,'User Delete') &&
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
      pageSize: pageSize,
    }
  });

  const getDataList = () => {
    setLoading(true)

    axios.get(`users`, {
      params: getParams(tableParams)
    }).then((r) => {
      setData(r?.data?.data?.data)
      setDataCount(r?.data?.data?.total)
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: r.data.data.total,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      })
      setLoading(false)

    }).catch((e) => { setLoading(false) });
  }

  useEffect(() => {
    if (tableParams?.pagination?.current == 1) {
      getDataList();
    }

  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    if (tableParams?.pagination?.current !== 1) {
      getDataList();
    }
  }, [JSON.stringify(tableParams)]);


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

      // const startDate = moment(new Date(value[0])).utc().format('MM-DD-YYYY');

      // let endDate: any = moment(new Date(value[1])).utc().format('MM-DD-YYYY')

      const startDate = moment(new Date(value[0])).utc().startOf('day').format('MM-DD-YYYY HH:mm:ss');
      const endDate = moment(new Date(value[1])).utc().endOf('day').format('MM-DD-YYYY HH:mm:ss');
      // console.log(startDate)
      console.log({startDate,endDate})
      setTableParams((prevState : any) => ({
        ...prevState,
        date: {
          start: startDate,
          end: endDate
        },
        pagination : {
            ...prevState?.pagination,
            current : 1
        }
      }));
    } else {
      console.log('value',value)
      setTableParams((prevState : any) => ({
        ...prevState,
        date : {},
        pagination : {
            ...prevState?.pagination,
            current : 1
        }
      }));
    }

  }
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
      if (r.data.status === 1) {
        notification.success({
          message: 'Success',
          description: r.data.message,
          duration: 5,
        });
        getDataList()
      }

    }).catch((e) => { setLoading(false) });
  };


  return (
    <>
      <Banner breadCrumb={breadCrumbList} permission={'User Create'} title={'User'} count={dataCount} buttonTitle={'User'} buttonUrl="/users/create" />
      <Card>
        <AdvanceTable
          data={data}
          loading={loading}
          columns={columns}
          setTableParams={setTableParams}
          tableParams={tableParams}
          handleTableChange={handleTableChange}
          onDelete={isPermission(authPermission,'User Delete') ? onDelete : ''}
          handelDateRange={handelDateRange}
        />
      </Card>
    </>
  );
};

export default User;
