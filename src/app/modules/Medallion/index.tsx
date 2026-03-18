import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Col, Descriptions, Divider, Form, Input, Modal, notification, Popconfirm, Popover, Select, Space, Spin, Switch, Tag, Tooltip, Typography } from 'antd';
import Icon, { HomeOutlined, EditOutlined, DeleteOutlined, UserOutlined, EyeOutlined, RetweetOutlined, CarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { isPermission } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Status from '@atoms/Status';
import EmailLink from '@atoms/EmailLink';
import PhoneLink from '@atoms/PhoneLink';
import Image from '@atoms/Image';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextAreaField } from '@atoms/FormElement';
import MedallionTransferModal from './MedallionTransferModal';
import MedallionNumberTag from '@atoms/MedallionNumberTag';

dayjs.extend(utc);
const { Text } = Typography;


const Medallion = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [isCheckedMap, setIsCheckedMap] = useState<{ [key: number]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null); // Store selected row ID
  const [medallionDataModal, setMedallionDataModal] = useState(false);
  const [medallionData, setMedallionData] = useState({});



  const [tableParams, setTableParams]: any = useState({
    pagination: { current: 1, pageSize: 10 },
    filters: {},
    sorter: null,
    date: {},
    status: null,
    vehicleRequired: false
  });
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );

  // Fetch Medallion Data
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`medallions`, {
        params: {
          pageSize: tableParams.pagination.pageSize,
          current: tableParams.pagination.current,
          ...tableParams.filters,
          ...tableParams.sorter,
          ...tableParams.date,
          status: tableParams.status, // Explicitly adding 'status'
          search: tableParams.search, // Explicitly adding 'status'
          vehicleRequired: tableParams.vehicleRequired
        },
      })
      .then((res) => {
        const { items = [], total = 0 } = res?.data?.data || {};

        const initialCheckedState: { [key: number]: boolean } = {};
        items.forEach((record: any) => {
          initialCheckedState[record.id] = record.workmanAutoApply === true; // Default checked if true
        });
        setIsCheckedMap(initialCheckedState);

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
  }, [JSON.stringify(tableParams), medallionDataModal]);

  // Handle table change
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    let vehicleRequired = tableParams?.vehicleRequired;
    let search = null;
    if (tableParams.search) {
      search = tableParams.search;
    }

    setTableParams({ pagination, filters, sorter, vehicleRequired, search });
  };

  const onDelete = (value: any) => {
    confirm(value)
  }

  const confirm: any = (item: any) => {
    setLoading(true)
    const dataArray = Array.isArray(item) ? item : [item];
    axios.delete(`/medallions`, {
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

  // Medallion table columns
  const columns = [
    {
      title: 'Medallion Number',
      dataIndex: 'medallionNumber',
      key: 'medallionNumber',
      render: (medallionNumber: string, record: any) => {
        return <MedallionNumberTag medallion={record} />;
      },
    },
    {
      title: 'Corporation',
      dataIndex: 'corporation',
      key: 'corporation',
      render: (corporation: any) => {
        const member = corporation?.member;
        const popoverContent = (
          <div style={{ minWidth: 300, maxWidth: 400 }}>
            {/* Corporation Details */}
            {/* <Descriptions column={1} size="small" bordered title="Corporation Details">
              <Descriptions.Item label="Name">{corporation?.corporationName}</Descriptions.Item>
              <Descriptions.Item label="File Number">{corporation?.fileNumber || '-'}</Descriptions.Item>
              <Descriptions.Item label="EFIN No">{corporation?.efinNo || '-'}</Descriptions.Item>
              <Descriptions.Item label="Incorporation Date">{corporation?.incorporationDate ? moment(corporation.incorporationDate).format('MMMM Do YYYY') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Address">{corporation?.address || '-'}</Descriptions.Item>
              <Descriptions.Item label="City">{corporation?.city || '-'}</Descriptions.Item>
              <Descriptions.Item label="State">{corporation?.state || '-'}</Descriptions.Item>
              <Descriptions.Item label="Zip Code">{corporation?.zipCode || '-'}</Descriptions.Item>
              <Descriptions.Item label="Status"><Status status={corporation?.status} /></Descriptions.Item>
              <Descriptions.Item label="Medallions Count"><Tag color="blue">{corporation?.medallionsCount}</Tag></Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '12px 0' }} /> */}

            {/* Member Details */}
            {member ? (
              <>
                <Descriptions column={1} size="small" bordered >
                  <Descriptions.Item label="Full Name">{member.fullName || `${member.firstName || ''} ${member.middleName || ''} ${member.lastName || ''}`.trim()}</Descriptions.Item>
                  <Descriptions.Item label="First Name">{member.firstName}</Descriptions.Item>
                  <Descriptions.Item label="Middle Name">{member.middleName || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Last Name">{member.lastName}</Descriptions.Item>
                  <Descriptions.Item label="Email">{member.emailAddress}</Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 12, textAlign: 'right' }}>
                  <Link to={`/member/edit/${member.id}`}>
                    <Button type="primary" size="small" icon={<UserOutlined />}>
                      Go to Member
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <Text type="secondary">No member data available</Text>
            )}
          </div>
        );

        return (
          <Popover
            content={popoverContent}
            title="Member Information"
            trigger="hover"
            placement="right"
          >
            <Badge count={corporation?.medallionsCount}>
              <Tag style={{ cursor: 'pointer' }}>{corporation?.corporationName}</Tag>
            </Badge>
          </Popover>
        );
      },
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
      width: '200px',
      render: (vehicle: any, record: any) => {
        if (!vehicle) {
          return <Tag color="warning">No Vehicle Assigned</Tag>;
        }

        const vehicleContent = (
          <div style={{ minWidth: 280 }}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="VIN Number"><Tag color="lime">{vehicle?.vinNumber}</Tag></Descriptions.Item>
              <Descriptions.Item label="Type">{vehicle?.vehicleType?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="Year">{vehicle?.vehicleYear?.year || '-'}</Descriptions.Item>
              <Descriptions.Item label="Make">{vehicle?.vehicleMake?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="Model">{vehicle?.vehicleModel?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="Created">{vehicle?.createdAt ? moment(vehicle.createdAt).format('MMMM Do YYYY') : '-'}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <Link to={`/vehicle/edit/${vehicle.id}`}>
                <Button type="primary" size="small" icon={<CarOutlined />}>
                  Go to Vehicle
                </Button>
              </Link>
            </div>
          </div>
        );

        return (
          <Popover
            content={vehicleContent}
            title="Vehicle Information"
            trigger="hover"
            placement="top"
          >
            <div style={{ cursor: 'pointer' }}>
              <Tag color="lime">{vehicle?.vinNumber}</Tag>
              <br />
              <Text type="secondary" style={{ fontSize: '0.85em' }}>
                {vehicle?.vehicleType?.name}, {vehicle?.vehicleYear?.year} {vehicle?.vehicleMake?.name} {vehicle?.vehicleModel?.name}
              </Text>
            </div>
          </Popover>
        );
      }
    },
    {
      title: "Workman`s Comp",
      dataIndex: "workman_comp",
      key: "workman_comp",
      render: (status: any, record: any) => {
        if (record?.corporation?.medallionsCount > 1) {
          if (record?.insurances?.[0]?.status == 'surrender' || record?.insurances?.[0]?.status == 'request' || record?.insurances == 0) {
            // if (record?.workmanAutoApply) {
            //   setIsCheckedMap((prev) => ({ ...prev, [record?.id]: true }));
            // }
            return (
              <Switch
                checked={!!isCheckedMap[record.id]}
                onChange={(checked) => handleSwitchChange(checked, record)}
                size="small"
              />
            );
          }
        }


      },
    },
    {
      title: "Insurance",
      dataIndex: "insurance",
      key: "insurance",
      render: (status: any, record: any) => {
        const insurance = record?.insurances?.[0];

        if (!insurance) {
          return <Tag color="default">No Insurance</Tag>;
        }

        const insuranceContent = (
          <div style={{ minWidth: 250 }}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="ID">{insurance?.id}</Descriptions.Item>
              <Descriptions.Item label="Medallion Number"><Tag color="blue">{insurance?.medallionNumber}</Tag></Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <Link to={`/insurance/edit/${insurance.id}`}>
                <Button type="primary" size="small" icon={<EyeOutlined />}>
                  Go to Insurance
                </Button>
              </Link>
            </div>
          </div>
        );

        return (
          <Popover
            content={insuranceContent}
            title="Insurance Information"
            trigger="hover"
            placement="top"
          >
            <div style={{ cursor: 'pointer' }}>
              <Status status={insurance?.status} />
            </div>
          </Popover>
        );
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

        const canShowTransferButton = isPermission(authPermission, 'Medallions Transfer') &&
          (
            record?.insurances?.[0]?.status === 'surrender' ||
            record?.insurances == 0
          );
        return (
          <Space direction="vertical">
            <Space wrap>
              {
                isPermission(authPermission, 'Medallions Update') &&
                <Link to={'/medallion/edit/' + record.id + ''}><Button type="primary" variant='solid' color='cyan' icon={<EyeOutlined />} /></Link>
              }

              {
                canShowTransferButton && (
                  <Button
                    type="primary"
                    variant="solid"
                    color="gold"
                    icon={<RetweetOutlined />}
                    onClick={(e) => {
                      setMedallionData(record)
                      setMedallionDataModal(true)
                    }}

                  />
                )
              }

              {/* {
                isPermission(authPermission, 'Medallions Delete') &&
                <Popconfirm
                  title="Delete the medallion"
                  description="Are you sure to delete this medallion?"
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

  const handleSwitchChange = (checked: boolean, record: any) => {
    setSelectedId(record.id); // Store clicked row ID

    if (checked) {
      setIsModalOpen(true); // Open textarea modal if switching ON
    } else {
      setIsConfirmOpen(true); // Open confirmation modal if switching OFF
    }
  };

  const onSubmit = (data: any) => {
    setLoading(true)

    data.workmanCompId = selectedId;
    data.workmanAutoApply = true;
    axios.post('medallions/store/workman-comp', data).then((r) => {
      if (r?.data?.status === 1) {
        notification.success({
          message: 'Success',
          description: r.data.message,
          duration: 5,
        });
        if (selectedId !== null) {
          setIsCheckedMap((prev) => ({ ...prev, [selectedId]: true })); // Enable switch
        }
        setIsModalOpen(false); // Close modal
        setComment(""); // Reset textarea
      } else {
        notification.error({
          message: 'Error',
          description: 'Something went wrong',
          duration: 5,
        });
      }
    }).catch((e) => {

    }
    ).finally(() => {
      setLoading(false);
    });



  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close modal without changing switch state
  };

  const handleConfirmUncheck = (data: any) => {

    setLoading(true)

    data.workmanCompId = selectedId;
    data.workmanAutoApply = false;
    axios.post('medallions/store/workman-comp', data).then((r) => {
      if (r?.data?.status === 1) {
        notification.success({
          message: 'Success',
          description: r.data.message,
          duration: 5,
        });
        if (selectedId !== null) {
          setIsCheckedMap((prev) => ({ ...prev, [selectedId]: false })); // Disable switch
        }
        setIsConfirmOpen(false); // Close confirmation modal
        setComment(""); // Reset textarea
      } else {
        notification.error({
          message: 'Error',
          description: 'Something went wrong',
          duration: 5,
        });
      }
    }).catch((e) => {

    }
    ).finally(() => {
      setLoading(false);
    });


  };

  const handleCancelUncheck = () => {
    setIsConfirmOpen(false); // Close confirmation modal without changing state
  };
  const totalItems = dataCount;
  const activeItems = data.filter((medallion: any) => medallion.status === "active")
    .length;
  const inactiveItems = totalItems - activeItems;
  const mostRecentFirstItem = data[0]?.fullName || "";

  const handleAssignVehicleFilter = (value: any) => {
    setTableParams((prev: any) => ({
      ...prev,
      vehicleRequired: value,
    }));
  }

  const extraFilters = (
    <>
      <Col xs={24} sm={12} md={8} lg={4} xl={3}>
        <Select
          onChange={handleAssignVehicleFilter}
          options={[
            { value: null, label: 'All' },
            { value: 1, label: 'Assigned' },
            { value: 'un_assigned', label: 'Un-Assigned' },
          ]}
          placeholder="Select a Vehicle"
          allowClear
          style={{ width: '100%' }}
          showSearch
          aria-label="Filter by Vehicle"
        />
      </Col>
    </>
  )



  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    mode: 'all',
  });


  return (
    <>
      <Banner
        title="Medallions"
        totalItems={totalItems}
        activeItems={data.filter((medallion: any) => medallion.status === "active").length}
        inactiveItems={inactiveItems}
        mostRecentFirstItem={mostRecentFirstItem}
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Medallions" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={'/medallion/create'}
        permission={'Medallions Create'}
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
          onDelete={isPermission(authPermission, 'Medallion Delete') ? onDelete : ''}
          extraFilters={extraFilters}
        />

        <Modal
          maskClosable={false}
          key="workman-comp-modal"
          title="Enter a Comment"
          open={isModalOpen}
          onOk={handleSubmit(onSubmit)}
          onCancel={handleCancel}
          okText={'Save'}
        >
          <Spin spinning={loading} >
            <Form name="validateOnly" layout="vertical" autoComplete="off" >
              <TextAreaField
                label="Comment"
                fieldName="comment"
                control={control}
                initValue=""
                iProps={{
                  placeholder: "comment",
                  size: "large",
                  // prefix: <UserOutlined className="site-form-item-icon" />,
                }}
                errors={errors}
              />
            </Form>
          </Spin>
        </Modal>
        <Modal
          key="confirm-modal"
          title="Are you sure?"
          open={isConfirmOpen}
          onOk={handleSubmit(handleConfirmUncheck)}
          onCancel={handleCancelUncheck}
          okText="Yes, Uncheck"
          cancelText="Cancel"
        >
          <p>Are you sure you want to turn OFF this switch?</p>
        </Modal>

        {/* <Modal
          title={`Medallion Transfer`}
          open={medallionDataModal}
          onCancel={() => setMedallionDataModal(false)}
          footer={[
            <Button onClick={handleSubmit(handleTransfer)}>
              Transfer
            </Button>
          ]}
          centered
          width={500}
          loading={loading}
        >

        </Modal> */}
        <MedallionTransferModal visible={medallionDataModal} setMedallionDataModal={setMedallionDataModal} data={medallionData} />

      </Card>
    </>
  );
};

export default Medallion;
