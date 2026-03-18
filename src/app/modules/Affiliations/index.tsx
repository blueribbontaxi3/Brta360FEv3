import React, { useEffect, useState } from 'react';
import { Button, Card, notification, Popconfirm, Space, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { isPermission } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';

dayjs.extend(utc);
const { Text } = Typography;

const Affiliations = () => {
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
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );

  // Fetch Member Data
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`affiliations`, {
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
    axios.delete(`/affiliations`, {
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

  const groupBy = (data: any) => {
    const groupedData = data.reduce((acc: any, item: any) => {
      const { year, name, costPrice, sellingPrice } = item;

      if (!acc[year]) {
        acc[year] = { year };
      }

      acc[year][name] = { costPrice, sellingPrice };
      return acc;
    }, {});
    return groupedData;
  }
  // Member table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => record.name,
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      render: (_: any, record: any) => {
        // Group prices by year
        const groupedPrices = groupBy(record.prices);

        // Render grouped years with their respective tags
        return Object.entries(groupedPrices).map(([year, items]: any) => (
          <Tag color="green">{year}</Tag>
        ));
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
                isPermission(authPermission, 'Affiliations Update') &&
                <Link to={'/affiliation/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
              }
              {
                isPermission(authPermission, 'Affiliations Delete') &&
                <Popconfirm
                  title="Delete the affiliations"
                  description="Are you sure to delete this affiliation?"
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
        title="Affiliations"
        totalItems={totalItems}
        activeItems={data.filter((item: any) => item.status === "active").length}
        inactiveItems={inactiveItems}
        mostRecentFirstItem={mostRecentFirstItem}
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Affiliations" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={'/affiliation/create'}
        permission={'Affiliations Create'}
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
          handleDateRange={handleDateRange}
          onDelete={isPermission(authPermission, 'Affiliations Delete') ? onDelete : ''}
        />
      </Card>
    </>
  );
};

export default Affiliations;
