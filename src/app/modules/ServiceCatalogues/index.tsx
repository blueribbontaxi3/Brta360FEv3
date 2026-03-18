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
    title: 'Service Catalogue',
  }
];

const getParams = (params: any) => {
  return {
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  };
}

const ServiceCatalogue = (props: any) => {
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
        return <>
              <span>{record?.name}</span>
        </>;
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
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (item: any, record: any) => {
        return (
          <Space direction="vertical">
            <Space wrap>
              {
                isPermission(authPermission,'Service Catalogue Update') &&
                <Button onClick={(e:any) => showModal(record?.id)} type="primary" icon={<EditOutlined />} />
              }
              {
                isPermission(authPermission,'Service Catalogue Delete') &&
                <Popconfirm
                  title="Delete!"
                  description="Are you sure to delete this Service Catalogue?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={(e) => confirm(record?.id)}
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
  const [dataCount, setDataCount] = useState<any>(0);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [id, setId] = useState<any>(null);

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
    }
  });

  const showModal = (id : any = null) => {
    setId(id)
    setIsModalOpen(true);
  };

  const getDataList = () => {
    setLoading(true)

    axios.get(`service-catalogues`, {
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
    axios.delete(`/service-catalogues`, {
      data: {
        ids: dataArray
      }
    }).then((r) => {
      getDataList()

    }).catch((e) => { setLoading(false) });
  };


  return (
    <>
      <Banner breadCrumb={breadCrumbList} permission={'Service Catalogue Create'} title={'Service Catalogue'} count={dataCount} buttonTitle={'Service Catalogue'} buttonUrl={showModal} />
      <Card>
        <AdvanceTable
          data={data}
          loading={loading}
          columns={columns}
          setTableParams={setTableParams}
          tableParams={tableParams}
          handleTableChange={handleTableChange}
          onDelete={isPermission(authPermission,'Service Catalogue Delete') ? onDelete : ''}
          handelDateRange={handelDateRange}
        />
      </Card>
      <CreateOrEdit
        id={id}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        getDataList={getDataList}
      />
    </>
  );
};

export default ServiceCatalogue;
