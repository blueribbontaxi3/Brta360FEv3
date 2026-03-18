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
    title: 'Unit',
  }
];

const getParams = (params: any) => {
  return {
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  };
}

const Unit = (props: any) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );
  const columns = [
    {
      title: 'Unit ID',
      dataIndex: 'unitId',
      key: 'unitId',
      render: (item: any, record: any) => {
        return `${record?.unitId}`;
      },
    },
    {
      title: 'Owner ID',
      dataIndex: 'ownerId',
      key: 'ownerId',
      render: (item: any, record: any) => {
        return `${record?.ownerId}`;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (item: any, record: any) => {
        return `${record?.name}`;
      },
    },
  
  
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
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
                isPermission(authPermission,'Unit Update') &&
                <Link to={'/units/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
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

  const getDataList = () => {
    setLoading(true)

    axios.get(`units`, {
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
      const startDate = moment(new Date(value[0])).utc().startOf('day').format('MM-DD-YYYY HH:mm:ss');
      const endDate = moment(new Date(value[1])).utc().endOf('day').format('MM-DD-YYYY HH:mm:ss');
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
  // const onDelete = (value: any) => {
  //   confirm(value)
  // }

  const confirm: any = (item: any) => {
    setLoading(true)
    const dataArray = Array.isArray(item) ? item : [item];
    axios.delete(`/units`, {
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
      <Banner breadCrumb={breadCrumbList} title={'Unit'} count={dataCount} buttonTitle={'Unit'}  />
      <Card>
        <AdvanceTable
          data={data}
          loading={loading}
          columns={columns}
          setTableParams={setTableParams}
          tableParams={tableParams}
          handleTableChange={handleTableChange}
          // onDelete={onDelete}
          handelDateRange={handelDateRange}
        />
      </Card>
    </>
  );
};

export default Unit;
