import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Banner from "../../molecules/Banner";
import axios from "../../../utils/axiosInceptor";
import AdvanceTable from "../../molecules/AdvanceTable";
import { isPermission, usdFormat } from "utils/helper";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import getTableColumns from "./components/insurance/TableColumns";
import HardCardForm from "./components/insurance/HardCardForm";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { DatePicker } from "antd";
import PreviousInsurance from './components/insurance/InsurancePrevious';
import InsuredPdfModal from "./components/pdf/InsuredPdfModal";
import UserGuideModal from "./components/UserGuideModal";

dayjs.extend(utc);
const { Text } = Typography;
const { RangePicker } = DatePicker;

const Insurance = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [isHardCardFormModalOpen, setIsHardCardFormModalOpen]: any = useState();
  const [statisticsLoading, setStatisticsLoading]: any = useState(false);
  const [dataStatistics, setDataStatistics]: any = useState({});
  const [dateRangeStatistics, setDateRangeStatistics]: any = useState([]);
  const [isModalPreviousOpen, setIsModalPreviousOpen] = useState(false);
  const [modalPreviousData, setModalPreviousData] = useState({});
  const [dataDiscountData, setDiscountData]: any = useState([]);
  const [deleteErrorModal, setDeleteErrorModal]: any = useState({ open: false, data: null });
  const [isUserGuideModalOpen, setIsUserGuideModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to parse URL params into tableParams format
  const parseUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const params: any = {
      pagination: {
        current: parseInt(searchParams.get('current') || '1'),
        pageSize: parseInt(searchParams.get('pageSize') || '10')
      },
      filters: {},
      sorter: null,
      date: {},
      status: null,
    };

    // Parse status (comma-separated values)
    const statusParam = searchParams.get('status');
    if (statusParam) {
      params.status = statusParam.split(',').filter(Boolean);
    }

    // Parse option (comma-separated values)
    const optionParam = searchParams.get('option');
    if (optionParam) {
      params.option = optionParam.split(',').filter(Boolean);
    }

    // Parse discount (comma-separated IDs)
    const discountParam = searchParams.get('discount');
    if (discountParam) {
      params.discount = discountParam.split(',').map(id => parseInt(id)).filter(Boolean);
    }

    // Parse date range
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    if (start && end) {
      params.date = { start, end };
    }

    // Parse dateColumn
    const dateColumn = searchParams.get('dateColumn');
    if (dateColumn) {
      params.dateColumn = dateColumn;
    }

    // Parse search
    const search = searchParams.get('search');
    if (search) {
      params.search = search;
    }

    // Parse sorting
    const sortField = searchParams.get('sortField');
    const sortOrder = searchParams.get('sortOrder');
    if (sortField) {
      params.sortField = sortField;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }

    return params;
  };

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

    axios
      .get(`insurances`, {
        params: {
          pageSize: tableParams.pagination.pageSize,
          current: tableParams.pagination.current,
          //...tableParams.filters,
          sortField: tableParams.sortField === 'date' ? (tableParams.dateColumn || 'created_at') : tableParams.sortField,
          sortOrder: tableParams.sortOrder,
          ...tableParams.date,
          status: tableParams.status, // Explicitly adding 'status'
          search: tableParams.search, // Explicitly adding 'status'
          option: tableParams.option, // Explicitly adding 'status'
          discount: tableParams.discount, // Explicitly adding 'status'
          dateColumn: tableParams.dateColumn || "created_at", // Explicitly adding 'status'
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

  const fetchDiscountData = () => {
    axios
      .get(`discounts`)
      .then((res) => {
        const { items = [], total = 0 } = res?.data?.data || {};
        setDiscountData(items);

      })
      .catch(() => {
        // Handle error notification
      })
      ;
  };

  // Initialize tableParams from URL on mount
  useEffect(() => {
    const urlParams = parseUrlParams();
    setTableParams(urlParams);
    setIsInitialized(true);
  }, []);

  // Sync tableParams to URL whenever they change (after initialization)
  useEffect(() => {
    if (!isInitialized) return; // Skip on initial mount

    const searchParams = new URLSearchParams();

    // Add pagination
    if (tableParams.pagination?.current && tableParams.pagination.current !== 1) {
      searchParams.set('current', tableParams.pagination.current.toString());
    }
    if (tableParams.pagination?.pageSize && tableParams.pagination.pageSize !== 10) {
      searchParams.set('pageSize', tableParams.pagination.pageSize.toString());
    }

    // Add status filter
    if (tableParams.status && tableParams.status.length > 0) {
      searchParams.set('status', tableParams.status.join(','));
    }

    // Add option filter
    if (tableParams.option && tableParams.option.length > 0) {
      searchParams.set('option', tableParams.option.join(','));
    }

    // Add discount filter
    if (tableParams.discount && tableParams.discount.length > 0) {
      searchParams.set('discount', tableParams.discount.join(','));
    }

    // Add date range
    if (tableParams.date?.start && tableParams.date?.end) {
      searchParams.set('start', tableParams.date.start);
      searchParams.set('end', tableParams.date.end);
    }

    // Add dateColumn
    if (tableParams.dateColumn && tableParams.dateColumn !== 'created_at') {
      searchParams.set('dateColumn', tableParams.dateColumn);
    }

    // Add search
    if (tableParams.search) {
      searchParams.set('search', tableParams.search);
    }

    // Add sorting
    if (tableParams.sortField) {
      searchParams.set('sortField', tableParams.sortField);
    }
    if (tableParams.sortOrder) {
      searchParams.set('sortOrder', tableParams.sortOrder);
    }

    const newSearch = searchParams.toString();
    const currentSearch = location.search.replace('?', '');

    // Only update URL if search params have changed
    if (newSearch !== currentSearch) {
      navigate(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { replace: true });
    }
  }, [JSON.stringify(tableParams), isInitialized]);

  // Fetch data on mount or table parameter changes
  useEffect(() => {
    if (!isInitialized) return; // Skip until initialized from URL
    setLoading(true);
    fetchData();
  }, [JSON.stringify(tableParams), isInitialized]);

  // Handle table change
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    let search: any = null;
    if (tableParams.search) {
      search = tableParams.search;
    }

    let dateColumn = tableParams.dateColumn;
    if (filters.date && filters.date.length > 0) {
      dateColumn = filters.date[0];
    }


    setTableParams((prev: any) => ({
      ...prev,
      pagination,
      filters,
      search,
      dateColumn,
      sortField: sorter.field || prev.sortField,
      sortOrder: sorter.order
        ? sorter.order === "ascend"
          ? "asc"
          : "desc"
        : prev.sortOrder,
    }));
  };

  const onDelete = (value: any) => {
    confirm(value);
  };

  const confirm: any = (item: any) => {
    setLoading(true);
    const dataArray = Array.isArray(item) ? item : [item];
    axios
      .delete(`/insurances`, {
        data: {
          ids: dataArray,
        },
      })
      .then((r) => {
        if (r.data.status === 1) {
          notification.success({
            message: "Success",
            description: r.data.message,
            duration: 5,
          });
          fetchData();
        }
      })
      .catch((e) => {
        console.log("Delete Error:",);
        setDeleteErrorModal({ open: true, data: e?.response?.data });

        setLoading(false);
      });
  };

  // Handle date range filter
  const handleDateRange = (value: any) => {
    if (value?.length === 2) {
      const startDate = value[0].startOf("day").format("MM-DD-YYYY HH:mm:ss");
      const endDate = value[1].endOf("day").format("MM-DD-YYYY HH:mm:ss");
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

  useEffect(() => {
    if (isHardCardFormModalOpen?.loadNew) {
      fetchData();
    }
  }, [isHardCardFormModalOpen]);



  const handleStatusFilter = (value: any) => {
    setTableParams((prev: any) => ({
      ...prev,
      status: value,
      pagination: { ...prev.pagination, current: 1 },
    }));
  };
  const handleOptionFilter = (value: any) => {
    setTableParams((prev: any) => ({
      ...prev,
      option: value,
    }));
  };

  const handleDiscountFilter = (data: any) => {
    setTableParams((prev: any) => ({
      ...prev,
      discount: data,
    }));

  }

  const extraFilters = (
    <>
      <Col xs={24} sm={12} md={8} lg={5} xl={4}>
        <Select
          mode={"multiple"}
          value={tableParams.option}
          options={[
            {
              value: "workmanComp",
              label: <Tag color="green">Workman Comp</Tag>,
            },
            {
              value: "collision",
              label: <Tag color="gold">Collision</Tag>,
            },
            {
              value: "paceProgram",
              label: <Tag color="blue">Pace Program</Tag>,
            },
          ]}
          placeholder="Select a Option"
          allowClear
          style={{ width: "100%" }}
          aria-label="Filter by Option"
          onChange={handleOptionFilter}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={5} xl={4}>
        <Select
          mode={"multiple"}
          value={tableParams.status}
          options={[
            {
              value: "pre_request",
              label: <Tag color="purple">Pre-Request</Tag>,
            },
            {
              value: "request",
              label: <Tag color="gold">Request</Tag>,
            },
            {
              value: "insured",
              label: <Tag color="green">Insured</Tag>,
            },
            {
              value: "surrender",
              label: <Tag color="error">Surrender</Tag>,
            },
            {
              value: "flat_cancel",
              label: <Tag>Flat Cancel</Tag>,
            },
            {
              value: "renew",
              label: <Tag style={{ color: "rgb(3, 196, 239)", borderColor: 'rgb(3, 196, 239)', backgroundColor: 'rgb(3 196 239 / 8%)' }}>Renew</Tag>,
            },
          ]}
          placeholder="Select a status"
          allowClear
          style={{ width: "100%" }}
          aria-label="Filter by status"
          onChange={handleStatusFilter}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={5} xl={4}>
        <Select
          mode={"multiple"}
          value={tableParams.discount}
          options={
            dataDiscountData.map((item: any) => ({
              value: item.id,
              label: item.name,

            }))}
          placeholder="Select a discounts"
          allowClear
          style={{ width: "100%" }}
          aria-label="Filter by discount"
          onChange={handleDiscountFilter}
        />
      </Col>

    </>
  );


  const presets: any = [
    {
      label: "Today",
      value: [dayjs(), dayjs()],
    },
    {
      label: "Yesterday",
      value: [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")],
    },
    {
      label: "Last 7 Days",
      value: [dayjs().subtract(6, "day"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().subtract(29, "day"), dayjs()],
    },
    {
      label: "This Month",
      value: [dayjs().startOf("month"), dayjs().endOf("month")],
    },
    {
      label: "Last Month",
      value: [
        dayjs().subtract(1, "month").startOf("month"),
        dayjs().subtract(1, "month").endOf("month"),
      ],
    },
  ];

  const fetchBannerData = (param: any = null) => {
    setStatisticsLoading(true);
    axios
      .get(`insurances/summary/statistics`, {
        params: {
          startDate: param?.start,
          endDate: param?.end,
        },
      })
      .then((res) => {
        setDataStatistics(res?.data?.data);
      })
      .catch(() => {
        // Handle error notification
      })
      .finally(() => setStatisticsLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchBannerData();
    fetchDiscountData()
  }, []);

  const handleFetchBannerChange = (value: any) => {
    if (!value) {
      setDateRangeStatistics([]);
      fetchBannerData();
    } else {
      setDateRangeStatistics(value);
      const [startDate, endDate] = value;
      fetchBannerData({
        start: startDate.format("YYYY-MM-DD"),
        end: endDate.format("YYYY-MM-DD"),
      });
    }
  };

  const DashboardStats = () => (
    <>
      <Divider />
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={8} xl={6}>
            <RangePicker
              presets={presets}
              format="MM-DD-YYYY"
              style={{ width: "100%" }}
              onChange={handleFetchBannerChange}
              value={dateRangeStatistics}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Note: Statistics are calculated based on{" "}
              <b style={{ color: "green" }}>effective date</b>.
            </Typography.Text>
          </Col>
        </Row>
        <div style={{ overflowX: "auto", paddingBottom: 10 }}>
          <Row gutter={[8, 8]} wrap={false}>
            <Col xs={24} sm={12} md={12} lg={8} xl={4}>
              <Spin spinning={statisticsLoading}>
                <Card
                  styles={{
                    header: {
                      color: "#fff",
                      backgroundColor: "#0958d9",
                    },
                    body: {
                      backgroundColor: "#e6f4ff",
                    },
                  }}
                  size="small"
                  title="Total"
                  color="red"
                  extra={<Tag color="blue">{dataStatistics?.total?.count}</Tag>}
                >
                  <Statistic
                    value={usdFormat(dataStatistics?.total?.totalPayableAmount)}
                  />
                </Card>
              </Spin>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={4}>
              <Spin spinning={statisticsLoading}>
                <Card
                  styles={{
                    header: {
                      color: "#fff",
                      backgroundColor: "#faad14",
                    },
                    body: {
                      backgroundColor: "#fffbe6",
                    },
                  }}
                  size="small"
                  title="Request"
                  color="red"
                  extra={
                    <Tag color="gold">{dataStatistics?.request?.count}</Tag>
                  }
                >
                  <Statistic
                    value={usdFormat(
                      dataStatistics?.request?.totalPayableAmount
                    )}
                  />
                </Card>
              </Spin>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={4}>
              <Spin spinning={statisticsLoading}>
                <Card
                  styles={{
                    header: {
                      color: "#fff",
                      backgroundColor: "#389e0d",
                    },
                    body: {
                      backgroundColor: "#f6ffed",
                    },
                  }}
                  size="small"
                  title="Insured"
                  color="red"
                  extra={
                    <Tag color="green">{dataStatistics?.insured?.count}</Tag>
                  }
                >
                  <Statistic
                    value={usdFormat(
                      dataStatistics?.insured?.totalPayableAmount
                    )}
                  />
                </Card>
              </Spin>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={4}>
              <Spin spinning={statisticsLoading}>
                <Card
                  styles={{
                    header: {
                      color: "#fff",
                      backgroundColor: "#ff4d4f",
                    },
                    body: {
                      backgroundColor: "#ffccc7",
                    },
                  }}
                  size="small"
                  title="Surrender"
                  color="red"
                  extra={
                    <Tag color="error">{dataStatistics?.surrender?.count}</Tag>
                  }
                >
                  <Statistic
                    value={usdFormat(
                      dataStatistics?.surrender?.totalPayableAmount
                    )}
                  />
                </Card>
              </Spin>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={4}>
              <Spin spinning={statisticsLoading}>
                <Card
                  styles={{
                    header: {
                      color: "#fff",
                      backgroundColor: "rgb(3 196 239)",
                    },
                    body: {
                      backgroundColor: "rgb(3 196 239 / 17%)",
                    },
                  }}
                  size="small"
                  title="Renew"
                  color="red"
                  extra={<Tag>{dataStatistics?.renew?.count || 0}</Tag>}
                >
                  <Statistic
                    value={usdFormat(
                      dataStatistics?.renew?.totalPayableAmount
                    )}
                  />
                </Card>
              </Spin>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={4}>
              <Spin spinning={statisticsLoading}>
                <Card
                  styles={{
                    header: {
                      color: "#fff",
                      backgroundColor: "#8c8c8c",
                    },
                    body: {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                  size="small"
                  title="Flat"
                  color="red"
                  extra={<Tag>{dataStatistics?.flat_cancel?.count || 0}</Tag>}
                >
                  <Statistic
                    value={usdFormat(
                      dataStatistics?.flat_cancel?.totalPayableAmount
                    )}
                  />
                </Card>
              </Spin>
            </Col>
          </Row>
        </div>
      </Space>
    </>
  );

  const handleModelPreviousHistory = (data: any) => {
    setModalPreviousData(data)
    setIsModalPreviousOpen(true)
  }

  const rangePickerRenderExtraFooter = (
    <Select
      style={{ width: '50%' }}
      placeholder="Select Date Column Field"
      value={tableParams.dateColumn || 'created_at'}
      onChange={(value) => {
        setTableParams((prev: any) => ({
          ...prev,
          dateColumn: value,
        }));
      }}
      options={[
        { value: 'created_at', label: 'Create Date' },
        { value: 'updated_at', label: 'Updated Date' },
        { value: 'request_date', label: 'Request Date' },
        { value: 'effective_date', label: 'Effective Date' },
        { value: 'surrender_date', label: 'Surrender Date' },
      ]}
    />
  )

  return (
    <>
      <Banner
        breadCrumb={[{ title: "Home", path: "/" }, { title: "Insurance" }]}
        buttonTitle={"Create"}
        buttonUrl={"/insurance/create"}
        permission={"Insurance Create"}
        extraData={<DashboardStats />}
      />
      <Card>
        <AdvanceTable
          data={data}
          loading={loading}
          columns={getTableColumns(
            authPermission,
            onDelete,
            setIsHardCardFormModalOpen,
            handleModelPreviousHistory,
            tableParams.dateColumn
          )}
          tableParams={tableParams}
          setTableParams={setTableParams}
          status={false}
          extraFilters={extraFilters}
          handleTableChange={handleTableChange}
          handleDateRange={handleDateRange}
          onDelete={
            isPermission(authPermission, "Member Delete") ? onDelete : ""
          }
          rangePickerRenderExtraFooter={rangePickerRenderExtraFooter}
        />
      </Card>
      <Modal

        title={

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {isHardCardFormModalOpen?.data?.status == "flat_cancel"
                ? "Request"
                :
                isHardCardFormModalOpen?.data?.status == "request"
                  ? "Hard Card"
                  : isHardCardFormModalOpen?.data?.status == "renew"
                    ? "Renew" : isHardCardFormModalOpen?.data?.status == "pre_request" ?
                      'Request' : "Surrender"}
            </div>
            <Button
              type="primary"
              icon={<QuestionCircleOutlined />}
              onClick={() => setIsUserGuideModalOpen(true)}
              size="small"
              style={{
                marginRight: '15px'
              }}
            >
              User Guide
            </Button>
          </div>
        }
        open={isHardCardFormModalOpen?.open}
        onCancel={() => {
          setIsHardCardFormModalOpen({ open: false })
        }}
        footer={null}
        width="90%"
        maskClosable={false}
      >
        <HardCardForm
          record={isHardCardFormModalOpen?.data}
          isHardCardFormModalOpen={isHardCardFormModalOpen}
          modalProps={setIsHardCardFormModalOpen}
        />
      </Modal>

      <PreviousInsurance insuranceData={modalPreviousData} isModalPreviousOpen={isModalPreviousOpen} setIsModalPreviousOpen={setIsModalPreviousOpen} />
      <Modal
        title="Delete Insurance Error"
        open={deleteErrorModal.open}
        onCancel={() => setDeleteErrorModal({ open: false, data: null })}
        footer={[
          <Button key="close" type="primary" onClick={() => setDeleteErrorModal({ open: false, data: null })}>
            Close
          </Button>
        ]}
        centered
      >
        {deleteErrorModal.data && (
          <>
            <Alert
              type="error"
              showIcon
              message="Cannot Delete Insurance"
              description={deleteErrorModal.data.message}
              style={{ marginBottom: 16 }}
            />
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="VIN Number">
                {deleteErrorModal.data.vinNumber || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Medallion Number">
                {deleteErrorModal.data.medallion?.medallionNumber || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Insurance ID">
                {deleteErrorModal.data.insuranceId || "-"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>

      <InsuredPdfModal
        data={isHardCardFormModalOpen?.data}
        modalProps={setIsHardCardFormModalOpen}
        pdfModalOpen={isHardCardFormModalOpen?.pdfModalOpen}
      />

      <UserGuideModal
        open={isUserGuideModalOpen}
        onClose={() => setIsUserGuideModalOpen(false)}
      />
    </>
  );
};

export default Insurance;
