import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Descriptions, Modal, notification, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import { HomeOutlined, EditOutlined, DeleteOutlined, UserOutlined, RocketOutlined, ExclamationCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { isPermission } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Status from '@atoms/Status';
import MedallionNumberTag from '@atoms/MedallionNumberTag';

dayjs.extend(utc);
const { Text } = Typography;


const Vehicle = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [vehicleData, setVehicleData]: any = useState({});
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseLoading, setReleaseLoading] = useState(false);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);



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

  // Fetch Medallion Data
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`vehicles`, {
        params: {
          pageSize: tableParams.pagination.pageSize,
          current: tableParams.pagination.current,
          ...tableParams.filters,
          ...tableParams.sorter,
          ...tableParams.date,
          status: tableParams.status,
          search: tableParams.search,
          // medallionRequired: tableParams.medallionRequired
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

    console.log("tableParams", tableParams.search)
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

  const handleShowHistory = (record: any) => {
    setHistoryData(record.vehicleReleaseHistories || []);
    setHistoryModalOpen(true);
  };

  const confirm: any = (item: any) => {
    setLoading(true)
    const dataArray = Array.isArray(item) ? item : [item];
    axios.delete(`/vehicles`, {
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

  const handleVehicleRelease = async () => {
    setReleaseLoading(true);
    try {
      const response = await axios.post(`/vehicles/release/${vehicleData?.id}`, vehicleData);
      if (response.data.status === 1) {
        notification.success({
          message: 'Success',
          description: response.data.message,
          duration: 5,
        });
        setReleaseModalOpen(false); // Modal close only on success
        fetchData();
      } else {
        notification.error({
          message: 'Error',
          description: response.data.message,
          duration: 5,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to release the vehicle.',
        duration: 5,
      });
      console.error("Error releasing vehicle:", error);
    } finally {
      setReleaseLoading(false);
    }
  };

  const columns = [
    {
      title: 'Medallion Number',
      dataIndex: 'medallionNumber',
      key: 'medallionNumber',
      render: (medallionNumber: string, record: any) => {
        return <MedallionNumberTag medallion={record?.medallion} />;
      },
    },
    {
      title: 'Corporation',
      dataIndex: 'corporation',
      key: 'corporation',
      render: (item: any, record: any) => record?.medallion?.corporation?.corporationName,
    },
    {
      title: 'Vin Number',
      dataIndex: 'vinNumber',
      key: 'vinNumber',
      width: "350px",
      render: (item: any, record: any) => getVehiclePopover(record),
    },
    {
      title: "Insurance",
      dataIndex: "insurance",
      key: "insurance",
      render: (status: any, record: any) => <Status status={record?.medallion?.insurances?.[0]?.status} />,
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


              {/* {
                isPermission(authPermission, 'Vehicles Update') &&
                <Link to={'/vehicle/edit/' + record.id + ''}><Button type="primary" icon={<EditOutlined />} /></Link>
              } */}
              {
                isPermission(authPermission, 'Vehicle Release') && (record?.insurance?.status == 'surrender' || record?.insurance == null) && record?.medallion?.medallionNumber &&
                <Button
                  type="primary"
                  variant="solid"
                  color="gold"
                  icon={<RocketOutlined />}
                  onClick={() => {
                    setVehicleData(record);
                    setReleaseModalOpen(true);
                  }}
                />
              }
              {isPermission(authPermission, 'Vehicle Release History') && record?.vehicleReleaseHistories?.length > 0 &&
                <Button
                  icon={<HistoryOutlined />}
                  type="default"
                  onClick={() => handleShowHistory(record)}
                >
                  History
                </Button>
              }
              {/* {
                isPermission(authPermission, 'Vehicles Delete') &&
                <Popconfirm
                  title="Delete the vehicle"
                  description="Are you sure to delete this vehicle?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={(e) => confirm(record.id)}
                >
                  <Button type="primary" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              } */}

            </Space>

          </Space>
        )
      },
    },
  ];

  const getVehiclePopover = (data: any) => {

    const content = (
      <Descriptions
        size="small"
        column={1}
        style={{ width: 350 }}
        labelStyle={{ fontWeight: 'bold' }}
      >
        <Descriptions.Item label="Make">
          <Text>{data?.vehicleMake?.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Model">
          <Text>{data?.vehicleModel?.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Text>{data?.vehicleType?.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Year">
          <Text>{data?.vehicleYear?.year}</Text>
        </Descriptions.Item>
      </Descriptions>
    );

    return <><Tag color="cyan">{data?.vinNumber}</Tag>{content}</>;
  };

  const totalItems = dataCount;
  const activeItems = data.filter((medallion: any) => medallion.status === "active")
    .length;
  const inactiveItems = totalItems - activeItems;
  const mostRecentFirstItem = data[0]?.fullName || "";

  const handleAssignVehicleFilter = (value: any) => {
    setTableParams((prev: any) => ({
      ...prev,
      medallionRequired: value,
    }));
  }

  return (
    <>
      <Banner
        title="Vehicles"
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Vehicle" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={'/vehicle/create'}
        permission={'Vehicles Create'}
      />
      <Card>
        <AdvanceTable
          data={data}
          loading={loading}
          columns={columns}
          tableParams={tableParams}
          setTableParams={setTableParams}
          handleTableChange={handleTableChange}
          handleDateRange={handleDateRange}
          status={false}
          onDelete={isPermission(authPermission, 'Vehicle Delete') ? onDelete : ''}
        // extraFilters={extraFilters}
        />
        <Modal
          title="Vehicle Release"
          open={releaseModalOpen}
          onOk={handleVehicleRelease}
          confirmLoading={releaseLoading}
          onCancel={() => setReleaseModalOpen(false)}
          okText="Yes, Release it!"
          okType="danger"
          centered
        >
          <div style={{ marginBottom: 16 }}>
            <Descriptions
              size="small"
              column={1}
              bordered
              labelStyle={{ fontWeight: 'bold', width: 120 }}
            >
              <Descriptions.Item label="Medallion Number">
                <Tag color="cyan">{vehicleData?.medallion?.medallionNumber || '-'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Corporation">
                {vehicleData?.medallion?.corporation?.corporationName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Member">
                {vehicleData?.medallion?.corporation?.member?.fullName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Vehicle">
                {vehicleData?.vehicleMake?.name || '-'} {vehicleData?.vehicleModel?.name || '-'} ({vehicleData?.vehicleYear?.year || '-'})
              </Descriptions.Item>
              <Descriptions.Item label="VIN">
                {vehicleData?.vinNumber || '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 32, marginBottom: 8 }} />
            <br />
            <Text type="danger" strong style={{ fontSize: 16 }}>
              Are you sure you want to release this vehicle from the medallion?
            </Text>
            <br />
            <Text type="secondary">
              You won't be able to revert this!
            </Text>
          </div>
        </Modal>
        <Modal
          title="Vehicle Release History"
          open={historyModalOpen}
          onCancel={() => setHistoryModalOpen(false)}
          footer={null}
          centered
          width={900}
        >
          {historyData.length === 0 ? (
            <Text>No history found.</Text>
          ) : (
            <Table
              dataSource={historyData.map((item, idx) => ({
                key: idx,
                releaseDate: item.releaseDate ? dayjs(item.releaseDate).format('MMMM D, YYYY h:mm A') : '-',
                vinNumber: item.dataJson?.vinNumber || '-',
                medallionNumber: item.dataJson?.medallion?.medallionNumber || '-',
                corporation: item.dataJson?.medallion?.corporation?.corporationName || '-',
                member: item.dataJson?.medallion?.corporation?.member?.fullName || '-',
              }))}
              columns={[
                { title: 'Release Date', dataIndex: 'releaseDate', key: 'releaseDate' },
                { title: 'VIN', dataIndex: 'vinNumber', key: 'vinNumber' },
                { title: 'Medallion Number', dataIndex: 'medallionNumber', key: 'medallionNumber' },
                { title: 'Corporation', dataIndex: 'corporation', key: 'corporation' },
                { title: 'Member', dataIndex: 'member', key: 'member' },
              ]}
              pagination={false}
              size="small"
              bordered
            />
          )}
        </Modal>
      </Card>
    </>
  );
};

export default Vehicle;
