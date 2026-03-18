import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Tag, Popconfirm } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import CreateOrEdit from './CreateOrEdit';
import Image from '../../atoms/Image';

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

const CronJobs = (props: any) => {
  const [searchParams, setSearchParams] = useSearchParams();


  function getTimeDuration(startDate: moment.Moment, endDate: moment.Moment): string {
    const duration = moment.duration(endDate.diff(startDate));

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let durationString = '';
    if (days > 0) {
      durationString += `${days} days `;
    }
    if (hours > 0) {
      durationString += `${hours} hours `;
    }
    if (minutes > 0) {
      durationString += `${minutes} minutes `;
    }
    if (seconds > 0) {
      durationString += `${seconds} seconds `;
    }

    return durationString.trim();
  }


  const columns = [
    {
      title: 'JobName',
      dataIndex: 'jobName',
      key: 'jobName',
      // render: (item: any, record: any) => {
      //   return <>
      //     <div className="tr-profile-main">
      //       <Image
      //         src={record?.image}
      //         attributes={
      //           {
      //             className: 'image'
      //           }
      //         }
      //       />
      //       <div className="name-main">
      //         <span>{record?.jobName}</span>
      //       </div>
      //     </div>
      //   </>;
      // },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (item: any, record: any) => {

        let _class = 'blue';
        if (item) {
          // let _class = record.status == 'completed' ? 'green' : 'red';
          if (record.status == 'completed') {
            _class = 'green';
          } else if (record.status == 'failed') {
            _class = 'red';
          }
          return <Tag color={_class} key={item}>
            {item?.toUpperCase()}
          </Tag>
        }

      },
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'date',
      render: (item: any, record: any) => {
        return moment(record.startTime).format('MMMM Do YYYY, h:mm:ss a');
      },
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'date',
      render: (item: any, record: any) => {
        if (record.endTime) {
          return moment(record.endTime).format('MMMM Do YYYY, h:mm:ss a');
        }
        return null;
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'date',
      render: (item: any, record: any) => {
        // return moment.preciseDiff(moment(record.startTime),moment(record.endTime))
        // return moment.duration(moment(record.endTime).diff(record.startTime)).humanize();
        let zero: any = getTimeDuration(moment(record.startTime), moment(record.endTime));
        if (zero) {
          return zero;
        } else {
          return 0;
        }
        return getTimeDuration(moment(record.startTime), moment(record.endTime))
        return record.endTime;
        return record.startTime;
        return moment(record.startTime).diff(record.endTime)
        // return moment(record.endTime).format('MMMM Do YYYY, h:mm:ss a');
      },
    },
  ];



  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [dataCount, setDataCount] = useState<any>(0);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [id, setId] = useState<any>(null);

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
    }
  });

  const showModal = (id: any = null) => {
    setId(id)
    setIsModalOpen(true);
  };

  const getDataList = () => {
    setLoading(true)

    axios.get(`cron-logs`, {
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

      // const startDate = moment(new Date(value[0])).utc().format('YYYY-MM-DD');

      // let endDate: any = moment(new Date(value[1])).utc().format('YYYY-MM-DD')

      const startDate = moment(new Date(value[0])).utc().startOf('day').format('MM-DD-YYYY HH:mm:ss');
      const endDate = moment(new Date(value[1])).utc().endOf('day').format('MM-DD-YYYY HH:mm:ss');
      // console.log(startDate)
      setTableParams((prevState: any) => ({
        ...prevState,
        date: {
          start: startDate,
          end: endDate
        },
        pagination: {
          ...prevState?.pagination,
          current: 1
        }
      }));
    } else {
      setTableParams((prevState: any) => ({
        ...prevState,
        date: {},
        pagination: {
          ...prevState?.pagination,
          current: 1
        }
      }));
    }

  }

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={'Cron Jobs'} count={dataCount} buttonTitle={'Cron Jobs'} />
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
      <CreateOrEdit
        id={id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default CronJobs;
