import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Modal, notification, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { isPermission, usdFormat } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Status from '@atoms/Status';
import _ from 'lodash';
import CreateOrEdit from './CreateOrEdit';
import { Popup } from '@atoms/Popup';

dayjs.extend(utc);
const { Text, Title } = Typography;

const TaxRate = () => {
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
  const [open, setOpen]: any = useState(null)
  const [trigger, setTrigger]: any = useState(null)
  const [popupData, setPopupData] = useState({})
  const [onClose, setOnClose] = useState(false);

  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );

  // Fetch Member Data
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`tax-rates`, {
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
        setOpen(false)
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

  useEffect(() => {
    console.log("open?.isNew", open?.isNew)
    if (open?.isNew==true) {
      setPopupData({})
      setTableParams({
        pagination: { current: 1, pageSize: 10 }
      });
    }
  }, [open?.isNew])

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
    axios.delete(`/tax-rates`, {
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
  // Member table columns

  const onCancel = () => {
    setOnClose(true)
    setOpen(false)
  }

  const popup: any = [
    {
      title: ' Add a Tax Rates',
      content: (
        <CreateOrEdit
          setVisible={setOpen}
          onClose={onClose}
          setOnClose={setOnClose}
          editData={popupData}
        />
      )
    }
  ];



  const popupProps: any = {
    closable: true,
    open: open,
    title: popup[trigger]?.title,
    content: popup[trigger]?.content,
    width: popup?.[trigger]?.width && null,
    onCancel: () => {
      setPopupData({})
      onCancel()
    },
  };

  const handleUpdate = (params: any) => {
    setPopupData(params)
    console.log(params)
    setOpen(true);
    setTrigger(0);
  }
  const addNew = () => {
    setOpen(true);
    setTrigger(0);
  }

  const columns = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      render: (_: any, record: any) => record.year,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_: any, record: any) => usdFormat(record.amount),
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
                isPermission(authPermission, 'TaxRates Update') &&

                <Button type="primary" icon={<EditOutlined />} onClick={() => handleUpdate(record)} />

              }
              {
                isPermission(authPermission, 'TaxRates Delete') &&
                <Popconfirm
                  title="Delete the pace program"
                  description="Are you sure to delete this pace program?"
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
  const activeItems = data.filter((item: any) => item.status === "active")
    .length;
  const inactiveItems = totalItems - activeItems;
  const mostRecentFirstItem = data[0]?.corporationName || "";

  return (
    <>
      <Banner
        title="Tax Rates"
        totalItems={totalItems}
        activeItems={data.filter((item: any) => item.status === "active").length}
        inactiveItems={inactiveItems}
        mostRecentFirstItem={mostRecentFirstItem}
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Tax Rates" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={addNew}
        // onExport={() => console.log("Export Clicked")}
        permission={'TaxRates Create'}
      />
      <Card>
        <AdvanceTable
          data={data}
          status={false}
          loading={loading}
          columns={columns}
          tableParams={tableParams}
          setTableParams={setTableParams}
          handleTableChange={handleTableChange}
         // handleDateRange={handleDateRange}
          onDelete={isPermission(authPermission, 'Tax Rates Delete') ? onDelete : ''}
        />
        <Popup {...popupProps} />
      </Card>
    </>
  );
};

export default TaxRate;
