import React, { useEffect, useState } from 'react';
import { Button, Card, Col, notification, Popconfirm, Select, Space, Row, Tag, Typography, Statistic, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, DollarOutlined, CarOutlined, CalendarOutlined } from '@ant-design/icons';
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
const { Text, Title } = Typography;

// Collision Rate Card Component for beautiful display
const CollisionRateCard = ({ rate, colorScheme }: { rate: any; colorScheme: { gradient: string; shadow: string; icon: string } }) => {
  return (
    <Card
      style={{
        // background: colorScheme.gradient,
        borderRadius: '16px',
        border: 'none',
        //boxShadow: `0 8px 24px ${colorScheme.shadow}`,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      size='small'
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <DollarOutlined style={{ fontSize: '28px', marginRight: '8px' }} />
        <Title level={3} style={{ margin: 0, display: 'inline' }}>
          ${rate.collisionType} Deductible
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            size="small"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              border: 'none',
              textAlign: 'center'
            }}
          >
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>DEDUCTIBLE AMB</Text>
            <Statistic
              value={rate.deductibleAmbRate}
              prefix="$"
              valueStyle={{ color: '#1890ff', fontSize: '20px', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            size="small"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              border: 'none',
              textAlign: 'center'
            }}
          >
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>DEDUCTIBLE WAV</Text>
            <Statistic
              value={rate.deductibleWavRate}
              prefix="$"
              valueStyle={{ color: '#52c41a', fontSize: '20px', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            size="small"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              border: 'none',
              textAlign: 'center'
            }}
          >
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>COST AMB</Text>
            <Statistic
              value={rate.costAmbRate}
              prefix="$"
              valueStyle={{ color: '#722ed1', fontSize: '20px', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            size="small"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              border: 'none',
              textAlign: 'center'
            }}
          >
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>COST WAV</Text>
            <Statistic
              value={rate.costWavRate}
              prefix="$"
              valueStyle={{ color: '#fa541c', fontSize: '20px', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

// Color schemes for different collision types
const getColorScheme = (collisionType: string) => {
  switch (collisionType) {
    case '500':
      return {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        shadow: 'rgba(102, 126, 234, 0.4)',
        icon: '#667eea'
      };
    case '1000':
      return {
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        shadow: 'rgba(240, 147, 251, 0.4)',
        icon: '#f093fb'
      };
    case '5000':
      return {
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        shadow: 'rgba(79, 172, 254, 0.4)',
        icon: '#4facfe'
      };
    default:
      return {
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        shadow: 'rgba(168, 237, 234, 0.4)',
        icon: '#a8edea'
      };
  }
};

const CollisionRates = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [vehicleYearOptions, setVehicleYearOptions] = useState<any[]>([]);
  const [forYearOptions, setForYearOptions] = useState<any[]>([]);
  const [tableParams, setTableParams]: any = useState({
    pagination: { current: 1, pageSize: 10 },
    filters: {},
    sorter: null,
    date: {},
    status: null,
    vehicleYear: null,
    forYear: null,
  });
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );

  // Fetch Collision Rates Data
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`collision-rates`, {
        params: {
          pageSize: tableParams.pagination.pageSize,
          current: tableParams.pagination.current,
          ...tableParams.filters,
          sortField: tableParams.sortField,
          sortOrder: tableParams.sortOrder,
          ...tableParams.date,
          status: tableParams.status,
          search: tableParams.search,
          vehicleYear: tableParams.vehicleYear,
          forYear: tableParams.forYear,
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

        // Extract unique years for filters
        const uniqueVehicleYears = [...new Set(items.map((item: any) => item.vehicleYear))].filter(Boolean).sort((a: any, b: any) => b - a);
        const uniqueForYears = [...new Set(items.map((item: any) => item.forYear))].filter(Boolean).sort((a: any, b: any) => b - a);

        setVehicleYearOptions(uniqueVehicleYears.map((year: any) => ({ value: year, label: year.toString() })));
        setForYearOptions(uniqueForYears.map((year: any) => ({ value: year, label: year.toString() })));
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
    let search: string | null = null;
    if (tableParams.search) {
      search = tableParams.search;
    }
    setTableParams((prev: any) => ({
      ...prev,
      pagination,
      filters,
      search,
      sortField: sorter.field || prev.sortField,
      sortOrder: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : prev.sortOrder,
    }));
  };

  const onDelete = (value: any) => {
    confirm(value)
  }

  const confirm: any = (item: any) => {
    setLoading(true)
    const dataArray = Array.isArray(item) ? item : [item];
    axios.delete(`/collision-rates`, {
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

  // Handle Vehicle Year filter
  const handleVehicleYearFilter = (date: any, dateString: string | string[]) => {
    const value = Array.isArray(dateString) ? dateString[0] : dateString;
    setTableParams((prev: any) => ({
      ...prev,
      vehicleYear: value || null,
      pagination: { ...prev.pagination, current: 1 },
    }));
  };

  // Handle For Year filter
  const handleForYearFilter = (date: any, dateString: string | string[]) => {
    const value = Array.isArray(dateString) ? dateString[0] : dateString;
    setTableParams((prev: any) => ({
      ...prev,
      forYear: value || null,
      pagination: { ...prev.pagination, current: 1 },
    }));
  };

  // Extra filters for AdvanceTable
  const extraFilters = (
    <>
      <Col xs={24} sm={12} md={8} lg={4} xl={3}>
        <DatePicker
          onChange={handleVehicleYearFilter}
          placeholder="Vehicle Year"
          allowClear
          picker="year"
          style={{ width: '100%' }}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={4} xl={3}>
        <DatePicker
          onChange={handleForYearFilter}
          placeholder="For Year"
          allowClear
          picker="year"
          style={{ width: '100%' }}
        />
      </Col>
    </>
  );

  // Expandable row configuration
  const expandable = {
    expandedRowRender: (record: any) => (
      <div style={{ padding: '20px', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={24}>
            <Space size="large" wrap>
              <Tag icon={<CarOutlined />} color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                Vehicle Year: {record.vehicleYear}
              </Tag>
              <Tag icon={<CalendarOutlined />} color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                For Year: {record.forYear}
              </Tag>
            </Space>
          </Col>
        </Row>
        <Row gutter={[20, 20]}>
          {record.collisionRates?.map((rate: any) => (
            <Col xs={24} md={8} key={rate.id}>
              <CollisionRateCard rate={rate} colorScheme={getColorScheme(rate.collisionType)} />
            </Col>
          ))}
        </Row>
      </div>
    ),
    rowExpandable: (record: any) => record.collisionRates && record.collisionRates.length > 0,
  };

  // Member table columns
  const columns = [
    {
      title: 'Vehicle Year',
      dataIndex: 'vehicleYear',
      key: 'vehicleYear',
      sorter: true,
      render: (_: any, record: any) => (
        <Tag icon={<CarOutlined />} color="blue" style={{ fontSize: '14px' }}>
          {record.vehicleYear}
        </Tag>
      ),
    },
    {
      title: 'For Year',
      dataIndex: 'forYear',
      key: 'forYear',
      sorter: true,
      render: (_: any, record: any) => (
        <Tag icon={<CalendarOutlined />} color="green" style={{ fontSize: '14px' }}>
          {record.forYear}
        </Tag>
      ),
    },
    {
      title: 'Collision Types',
      dataIndex: 'collisionRates',
      key: 'collisionRates',
      render: (collisionRates: any) => (
        <Space>
          {collisionRates?.map((rate: any) => (
            <Tag key={rate.id} color="purple" style={{ fontSize: '12px' }}>
              ${rate.collisionType}
            </Tag>
          ))}
        </Space>
      ),
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
                isPermission(authPermission, 'CollisionRates Update') &&
                <Link to={'/collision-rates/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
              }
              {
                isPermission(authPermission, 'CollisionRates Delete') &&
                <Popconfirm
                  title="Delete the affiliations"
                  description="Are you sure to delete this collision rates?"
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
        title="Collision Rates"
        totalItems={totalItems}
        activeItems={data.filter((item: any) => item.status === "active").length}
        inactiveItems={inactiveItems}
        mostRecentFirstItem={mostRecentFirstItem}
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Collision Rates" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={'/collision-rates/create'}
        permission={'CollisionRates Create'}
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
          searchFilter={false}
          // handleDateRange={handleDateRange}
          onDelete={isPermission(authPermission, 'Collision Rates Delete') ? onDelete : ''}
          extraFilters={extraFilters}
          expandable={expandable}
        />
      </Card>
    </>
  );
};

export default CollisionRates;

