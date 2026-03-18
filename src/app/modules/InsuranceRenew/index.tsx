import React, { useEffect, useState } from 'react';
import { Alert, Avatar, Badge, Button, Card, Checkbox, Col, Descriptions, Divider, Flex, Form, message, Modal, notification, Popconfirm, Row, Select, Space, Spin, Statistic, Tag, Typography } from 'antd';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import AdvanceTable from '../../molecules/AdvanceTable';
import { formFieldErrors, isPermission, usdFormat } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { DatePicker } from 'antd';
import getTableColumns from '@modules/Insurance/components/insurance/TableColumns';
import TableColumnsRenew from '@modules/Insurance/components/insurance/TableColumnsRenew';
import InsuranceAddonCheckbox from '@modules/Insurance/components/insurance/InsuranceAddonCheckbox';
import { useForm } from 'react-hook-form';
import HardCardForm from '@modules/Insurance/components/insurance/HardCardForm';
import groupBy from 'lodash/groupBy';
import { DownloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import UserGuideModal from '@modules/Insurance/components/UserGuideModal';

dayjs.extend(utc);
const { Text } = Typography;
const { RangePicker } = DatePicker;

const InsuranceRenew = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData]: any = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [isHardCardFormModalOpen, setIsHardCardFormModalOpen]: any = useState();
  const [statisticsLoading, setStatisticsLoading]: any = useState(false);
  const [dataStatistics, setDataStatistics]: any = useState({});
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [renewInsuranceData, setRenewInsuranceData]: any = useState({});
  const [renewInsuranceModal, setRenewInsuranceModal]: any = useState(false);
  const [renewErrorModal, setRenewErrorModal]: any = useState({ open: false, data: null });
  const [renewPreviewModal, setRenewPreviewModal] = useState({ open: false, data: [] });
  const [excludeInsurancesIds, setExcludeInsurancesIds] = useState<number[]>([]);
  const [isUserGuideModalOpen, setIsUserGuideModalOpen] = useState(false);

  const [tableParams, setTableParams]: any = useState({
    pagination: {
      current: 1, pageSize: 10, pageSizeOptions: [10, 20, 50, 100, 200, 250, 500, 1000],
    },
    filters: {},
    sorter: null,
    date: {},
    status: null,

  });
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );

  // useEffect(() => {
  //   setSelectedInsurancesIds(renewPreviewModal.data.map((item: any) => item.id));
  // }, [renewPreviewModal.data]);

  const toggleExclude = (id: number) => {
    setExcludeInsurancesIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const groupedByNextYear = groupBy(
    renewPreviewModal.data,
    (item: any) => dayjs(item.effectiveDate).add(1, "year").year()
  );

  // Fetch Member Data
  const fetchData = () => {
    setLoading(true);
    axios
      .get(`insurances/renew`, {
        params: {
          pageSize: tableParams.pagination.pageSize,
          current: tableParams.pagination.current,
          //...tableParams.filters,
          sortField: tableParams.sortField,
          sortOrder: tableParams.sortOrder,
          ...tableParams.date,
          status: 'insured', // Explicitly adding 'status'
          search: tableParams.search, // Explicitly adding 'status'
          option: tableParams.option, // Explicitly adding 'status'
          affiliationPrice: true
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
    let search: any = null;
    if (tableParams.search) {
      search = tableParams.search;
    }

    setTableParams((prev: any) => ({
      ...prev,
      pagination,
      filters,
      search,
      sortField: sorter.field || prev.sortField,
      sortOrder: sorter.order ? (sorter.order === "ascend" ? "asc" : "desc") : prev.sortOrder,
    }));
  };

  useEffect(() => {
    if (isHardCardFormModalOpen?.loadNew) {
      fetchData();
    }
  }, [isHardCardFormModalOpen])

  const onChangeDate = (data: any) => {
    console.log("data", data)
  }




  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    mode: 'all',
  });

  const handleRenew = async (data: any) => {
    setLoading(true);
    try {
      const endpoint = `insurances/renew/store`;
      const method = 'post';
      const response = await axios[method](endpoint, {
        ...data,
        status: data.status === true ? 'active' : 'inactive'
      });

      if (response.data.status === 1) {
        fetchData();
        setLoading(false);
        notification.success({
          message: 'Success',
          description: response.data.message,
        });
        setRenewInsuranceModal(false)

      }
    } catch (error) {
      formFieldErrors(error, setError);
      console.error("Error fetching insurance renew data:", error);
    } finally {
      fetchData();
    }
  }

  const fetchSelectedInsurance = async (records: any) => {
    setLoading(true);
    try {
      const endpoint = `insurances/find/ids`;
      const method = 'post';
      const response = await axios[method](endpoint, {
        ids: records,
      });
      if (response.data.status === 1) {
        setRenewPreviewModal({ open: true, data: response.data?.data?.data });

        notification.success({
          message: 'Success',
          description: response.data.message,
        });

      } else if (response.data.isModal) {
        // Show error modal
        setRenewErrorModal({ open: true, data: response.data, message: response.data.message });
      }
    } catch (error) {

      console.log("error", error)
    } finally {

    }
  }

  const renewSelectedRecords = async () => {
    setLoading(true);
    try {
      const allIds = renewPreviewModal?.data.map((item: any) => item.id) || [];
      // const selectedIds = allIds.filter((id) => excludeInsurancesIds.includes(id)); // excluded ko hata diya
      // console.log("selectedIds", selectedIds)
      const endpoint = `insurances/renew/selected/records`;
      const response = await axios.post(endpoint, { ids: allIds });
      fetchData();

      if (response.data.status === 1) {
        notification.success({
          message: "Success",
          description: response.data.message,
        });
        setRenewInsuranceModal(false);
      } else if (response.data.isModal) {
        setRenewErrorModal({ open: true, data: response.data });
      }
    } catch (error: any) {
      console.error("Error renewing selected records:", error);
      if (error?.response?.data?.isModal) {
        setRenewErrorModal({
          open: true,
          data: error?.response?.data?.insurance,
          message: error?.response.data.message,
        });
      }
      fetchData();
      console.log("error", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (selectedRowKeys: any, selectedRows: any, info: { type: any }) => {
    console.log(selectedRowKeys, selectedRows, info)
    // setIsMultipleSelection(true)
  }



  const handleExport = (record?: any) => async () => {
    console.log("record", record)
    setLoading(true);
    try {
      let payload: any = {
        page: 'renew',
        affiliationPrice: true,
      };

      if (record?.id) {
        // Single export
        payload.insuranceIds = [record.id];
      } else if (selectedRowKeys.length > 0) {
        // Bulk export selected
        payload.insuranceIds = selectedRowKeys;
      } else {
        // Export all (with filters)
        payload = {
          ...payload,
          ...tableParams.filters,
          ...tableParams.date,
          status: 'insured',
          search: tableParams.search,
          option: tableParams.option,
          type: 'all'
        };
      }

      const response = await axios.post(
        '/insurances/export',
        payload,
        {
          responseType: 'blob',
          headers: { Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'insurance-export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('File downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      message.error('Failed to download file!');
    } finally {
      setLoading(false);
    }
  };

  const extraFilters = (
    <>
      <Col xs={24} sm={12} md={8} lg={5} xl={4}>
        <DatePicker onChange={onChangeDate} picker="year" style={{ width: '100%' }} />
      </Col>
      <Col xs={24} sm={12} md={8} lg={5} xl={4}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport()}
          style={{ width: '100%' }}
          disabled={selectedRowKeys.length == 0}
        >
          Export All
        </Button>
      </Col>
    </>
  );

  return (
    <>
      <Banner
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Insurance" },
        ]}
      />
      <Card>
        <AdvanceTable
          data={data}
          loading={loading}
          columns={TableColumnsRenew(authPermission, setIsHardCardFormModalOpen, {
            setRenewInsuranceModal: setRenewInsuranceModal,
            renewInsuranceModal: renewInsuranceModal,
            setRenewInsuranceData: setRenewInsuranceData,
            isShowRenewButton: selectedRowKeys.length === 0,
            exportMainDataExport: handleExport
          })}
          tableParams={tableParams}
          setTableParams={setTableParams}
          status={false}
          extraFilters={extraFilters}
          handleTableChange={handleTableChange}
          // handleDateRange={handleDateRange}
          onDelete={isPermission(authPermission, 'Member Delete') ? !loading ? fetchSelectedInsurance : '' : ''}
          deleteText="Renew Insurances"
          isConfirmationShow={false}
          pageSizeOptions={[10, 20, 50, 100, 200, 250, 500, 1000]}
          rawSelectionReset={true}
          setSelectedRowData={setSelectedRowKeys}
        />
        <Modal
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Renew Request for {dayjs(renewInsuranceData?.effectiveDate).year() + 1}</span>
              <Button
                type="primary"
                icon={<QuestionCircleOutlined />}
                onClick={() => setIsUserGuideModalOpen(true)}
                size="small"
                style={{
                  marginRight: '20px'
                }}
              >
                User Guide
              </Button>
            </div>
          }
          open={renewInsuranceModal}
          onCancel={() => setRenewInsuranceModal(false)}
          footer={[
            <Button onClick={handleSubmit(handleRenew)}>
              Save
            </Button>
          ]}
          centered
          width={500}
          loading={loading}
        >

          <InsuranceAddonCheckbox data={renewInsuranceData} renewInsuranceModal={renewInsuranceModal} setValue={setValue} />

        </Modal>
        <Modal
          title="Renew Error"
          open={renewErrorModal.open}
          onCancel={() => {
            setRenewErrorModal({ open: false, data: null })
            setLoading(false)
          }}
          footer={[
            <Button key="close" type="primary" onClick={() => {
              setRenewErrorModal({ open: false, data: null })
              setLoading(false)
            }}>
              Close
            </Button>
          ]}
          centered
          width={'30%'}
        >
          {renewErrorModal.data && (
            <>
              <Alert
                type="error"
                showIcon
                message={renewErrorModal?.message || "Cannot Renew Insurance"}
                description={renewErrorModal.data.message}
                style={{ marginBottom: 16 }}
              />
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="VIN Number">
                  {renewErrorModal.data.vinNumber || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Medallion Number">
                  {renewErrorModal.data.medallion?.medallionNumber || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance ID">
                  {renewErrorModal.data.insuranceId || "-"}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Modal>
        <Modal
          title="Verify Medallions to Renew"
          open={renewPreviewModal.open}
          onCancel={() => {
            setRenewPreviewModal({ open: false, data: [] })
            setLoading(false)
          }}
          footer={[
            <Button key="cancel" onClick={() => {
              setRenewPreviewModal({ open: false, data: [] })
              setLoading(false)
            }}>
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={() => {
                setRenewPreviewModal({ open: false, data: [] });
                renewSelectedRecords();
              }}
            >
              Confirm & Renew
            </Button>
          ]}
          centered
          width={"85%"}
        >
          <Alert
            type="info"
            showIcon
            message="Please verify the following medallions before renewing. 
             Review Next Renew Year and Dates carefully."
            style={{ marginBottom: 16 }}
          />

          {/* <Alert
            message="Disclaimer"
            description="If you check the box next to an insurance record, it will be excluded from the renewal process and will not be renewed."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          /> */}

          {Object.entries(groupedByNextYear).map(([year, items]: [string, any[]]) => (
            <div key={year} style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text strong style={{ fontSize: 18 }}>
                  <Tag color="blue" style={{ fontSize: 16, padding: "4px 12px" }}>
                    Next Renew Year: {year}
                  </Tag>
                </Text>
                <Tag color="purple">Total Medallions: {items.length}</Tag>
              </div>

              <Flex wrap="wrap" gap={16} style={{ marginTop: 12 }}>
                {items.map((item: any) => {
                  const isExcluded = excludeInsurancesIds.includes(item.id);
                  return (
                    <Card
                      key={item.id}
                      size="small"
                      //hoverable
                      style={{
                        border: !isExcluded ? "1px solid #ff4d4f" : "1px solid #e0e0e0",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        position: "relative"
                      }}
                    //onClick={() => toggleExclude(item.id)}
                    >
                      {/* Checkbox top-right */}
                      {/* <Checkbox
                        checked={!isExcluded}
                        onChange={() => toggleExclude(item.id)}
                        style={{ position: "absolute", top: 0, right: 3 }}
                      >
                      </Checkbox> */}

                      <Space direction="vertical" size="small" style={{ width: "100%", marginTop: 8 }}>
                        <Tag color="geekblue" style={{ fontSize: 14, width: "100%", textAlign: "center" }}>
                          <Text strong>Medallion:</Text> {item.medallionNumber}
                        </Tag>

                        <Tag color="green" style={{ width: "100%", textAlign: "center" }}>
                          <Text strong>Effective:</Text>{" "}
                          {dayjs(item.effectiveDate).format("MM-DD-YYYY")}
                        </Tag>

                        <Tag color="gold" style={{ width: "100%", textAlign: "center" }}>
                          <Text strong>Next Renew:</Text>{" "}
                          {dayjs(item.effectiveDate).add(1, "year").startOf("year").format("MM-DD-YYYY")}
                        </Tag>
                      </Space>
                    </Card>
                  );
                })}
              </Flex>
            </div>
          ))}
        </Modal>


        <Modal
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {isHardCardFormModalOpen?.data?.status == "flat_cancel"
                  ? "Request"
                  :
                  isHardCardFormModalOpen?.data?.status == "request"
                    ? "Hard Card"
                    : isHardCardFormModalOpen?.data?.status == "renew"
                      ? "Renew"
                      : "Surrender"}
              </span>
              <Button
                type="primary"
                icon={<QuestionCircleOutlined />}
                onClick={() => setIsUserGuideModalOpen(true)}
                size="small"
              >
                User Guide
              </Button>
            </div>
          }
          open={isHardCardFormModalOpen?.open}
          onCancel={() => setIsHardCardFormModalOpen({ open: false })}
          footer={null}
          width="90%"
          maskClosable={false}
        >
          <HardCardForm
            record={isHardCardFormModalOpen?.data}
            modalProps={setIsHardCardFormModalOpen}
          />
        </Modal>


        <UserGuideModal
          open={isUserGuideModalOpen}
          onClose={() => setIsUserGuideModalOpen(false)}
        />
      </Card>
    </>
  );
};

export default InsuranceRenew;
