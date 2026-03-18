import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Tag, Popconfirm, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';

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
    title: 'Newsletter',
  }
];

const getParams = (params: any) => {
  return {
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  };
}

const Newsletter = (props: any) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (item: any, record: any) => {
        return `${record?.name}`;
      },
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (item: any, record: any) => {

    //     if (item) {
    //       return <Tag color={item == 'active' ? 'green' : 'red'} key={item}>
    //         {item?.toUpperCase()}
    //       </Tag>
    //     }

    //   },
    // },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (item: any, record: any) => {

        return moment(record.created_at).format('MMMM Do YYYY, h:mm:ss a');

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

    axios.get(`newsletters`, {
      params: getParams(tableParams)
    }).then((r) => {
      setData(r?.data?.data?.data)
      setDataCount(r?.data?.data?.total)
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: r.data.data.total,
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

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={'Newsletter'} count={dataCount}/>
      <Card>
        <AdvanceTable
          data={data}
          loading={loading}
          columns={columns}
          setTableParams={setTableParams}
          tableParams={tableParams}
          handleTableChange={handleTableChange}
          handelDateRange={handelDateRange}
        />
      </Card>
    </>
  );
};

export default Newsletter;
