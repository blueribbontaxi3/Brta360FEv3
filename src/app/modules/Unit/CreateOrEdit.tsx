import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification, Image } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InputField, InputPassword, SelectField } from '../../atoms/FormElement';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { capitalizeFirstWord, formFieldErrors, getStatuses } from '../../../utils/helper';

const CreateOrEdit = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true)
      axios.get('/units/' + id).then((e: any) => {
        const projectDetail = e?.data?.data;
        if (projectDetail) {
          //setValue('projectId', projectDetail?.projectId)
          Object.keys(projectDetail).map(function(key) {
              setValue(key, projectDetail[key])
        });

        }
        setLoading(false)

      }).catch(() => { })
    }
 
  }, [id])



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
      title: (<Link to="/units">Projects</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  const schema = yup
    .object()
    .shape({
      name: yup.string().required('First name  is a required field'),
    
    })
    .required();

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError , getValues  }: any = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    if (id) {
      data.user_id = id;
      axios.patch(`units/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/units');
        }
      }).catch((e) => {
        formFieldErrors(e,setError)
        setLoading(false)
      });
    } else {
      axios.post('units', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/units');
        } else {
          notification.error({
            message: 'Error',
            description: 'Something went wrong',
            duration: 5,
          });
        }
      }).catch((e) => {
        formFieldErrors(e,setError)
      }
      ).finally(() => {
        setLoading(false);
      });
    }

  }

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Project' : "Create Project"} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
         
          <Col span={24}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                  <Col span={6}>
                    <InputField
                      label="Unit ID"
                      fieldName="unitId"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Unit ID",
                        size: "large",
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="Owner ID"
                      fieldName="ownerId"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Owner ID",
                        size: "large",
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="is Deleted"
                      fieldName="isDeleted"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "is Deleted",
                        size: "large",
                        autoComplete: "isDeleted"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="Name"
                      fieldName="name"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Place Of Issuance C",
                        size: "large",
                        autoComplete: "Name"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="currencyIsoCode"
                      fieldName="currencyIsoCode"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "currencyIsoCode",
                        size: "large",
                        autoComplete: "currencyIsoCode"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="unitCreatedDate"
                      fieldName="unitCreatedDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "unitCreatedDate",
                        size: "large",
                        autoComplete: "unitCreatedDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="unitCreatedById"
                      fieldName="unitCreatedById"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "unitCreatedById",
                        size: "large",
                        autoComplete: "unitCreatedById"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="unitLastModifiedDate"
                      fieldName="unitLastModifiedDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "unitLastModifiedDate",
                        size: "large",
                        autoComplete: "unitLastModifiedDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="unitLastModifiedById"
                      fieldName="unitLastModifiedById"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "unitLastModifiedById",
                        size: "large",
                        autoComplete: "unitLastModifiedById"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="systemModstamp"
                      fieldName="systemModstamp"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "systemModstamp",
                        size: "large",
                        autoComplete: "systemModstamp"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="lastViewedDate"
                      fieldName="lastViewedDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "lastViewedDate",
                        size: "large",
                        autoComplete: "lastViewedDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="lastReferencedDate"
                      fieldName="lastReferencedDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "lastReferencedDate",
                        size: "large",
                        autoComplete: "lastReferencedDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="buildingSectionName"
                      fieldName="buildingSectionName"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "buildingSectionName",
                        size: "large",
                        autoComplete: "buildingSectionName"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="project"
                      fieldName="project"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "project",
                        size: "large",
                        autoComplete: "project"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="customerName"
                      fieldName="customerName"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "customerName",
                        size: "large",
                        autoComplete: "customerName"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  
                  <Col span={6}>
                    {/* <InputField
                      label="status"
                      fieldName="status"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "status",
                        size: "large",
                        autoComplete: "status"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    /> */}
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="unitModel"
                      fieldName="unitModel"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "unitModel",
                        size: "large",
                        autoComplete: "unitModel"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="unitType"
                      fieldName="unitType"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "unitType",
                        size: "large",
                        autoComplete: "unitType"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="onlineReservationFee"
                      fieldName="onlineReservationFee"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "onlineReservationFee",
                        size: "large",
                        autoComplete: "onlineReservationFee"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="hasValidSalesorder"
                      fieldName="hasValidSalesorder"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "hasValidSalesorder",
                        size: "large",
                        autoComplete: "hasValidSalesorder"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="sapBuildingNo"
                      fieldName="sapBuildingNo"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "sapBuildingNo",
                        size: "large",
                        autoComplete: "sapBuildingNo"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="Project Last Modified Date"
                      fieldName="sapBuildingNo"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Project Last Modified Date",
                        size: "large",
                        autoComplete: "sapBuildingNo"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="Project Last Modified Date"
                      fieldName="activeSalesOrder"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Project Last Modified Date",
                        size: "large",
                        autoComplete: "activeSalesOrder"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="sapFloorNumber"
                      fieldName="sapFloorNumber"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "sapFloorNumber",
                        size: "large",
                        autoComplete: "sapFloorNumber"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="sapUsageType"
                      fieldName="sapUsageType"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "sapUsageType",
                        size: "large",
                        autoComplete: "sapUsageType"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="aspectView"
                      fieldName="aspectView"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "aspectView",
                        size: "large",
                        autoComplete: "aspectView"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="directIndirect"
                      fieldName="directIndirect"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "directIndirect",
                        size: "large",
                        autoComplete: "directIndirect"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="soDirectIndirect"
                      fieldName="soDirectIndirect"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "soDirectIndirect",
                        size: "large",
                        autoComplete: "soDirectIndirect"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="customerNationality"
                      fieldName="customerNationality"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "customerNationality",
                        size: "large",
                        autoComplete: "customerNationality"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="accountName"
                      fieldName="accountName"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "accountName",
                        size: "large",
                        autoComplete: "accountName"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderStatus"
                      fieldName="salesOrderStatus"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderStatus",
                        size: "large",
                        autoComplete: "salesOrderStatus"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderPaymentPlan"
                      fieldName="salesOrderPaymentPlan"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderPaymentPlan",
                        size: "large",
                        autoComplete: "salesOrderPaymentPlan"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderNetAmount"
                      fieldName="salesOrderNetAmount"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderNetAmount",
                        size: "large",
                        autoComplete: "salesOrderNetAmount"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="discount"
                      fieldName="discount"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "discount",
                        size: "large",
                        autoComplete: "discount"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col span={6}>
                    <InputField
                      label="customerType"
                      fieldName="customerType"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "customerType",
                        size: "large",
                        autoComplete: "customerType"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="customerSubType"
                      fieldName="customerSubType"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "customerSubType",
                        size: "large",
                        autoComplete: "customerSubType"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="rebatePercentage"
                      fieldName="rebatePercentage"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "rebatePercentage",
                        size: "large",
                        autoComplete: "rebatePercentage"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderOffer"
                      fieldName="salesOrderOffer"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderOffer",
                        size: "large",
                        autoComplete: "salesOrderOffer"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderDiscountPercentage"
                      fieldName="salesOrderDiscountPercentage"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderDiscountPercentage",
                        size: "large",
                        autoComplete: "salesOrderDiscountPercentage"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderBrokerAgency"
                      fieldName="salesOrderBrokerAgency"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderBrokerAgency",
                        size: "large",
                        autoComplete: "salesOrderBrokerAgency"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderSalesManager"
                      fieldName="salesOrderSalesManager"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderSalesManager",
                        size: "large",
                        autoComplete: "salesOrderSalesManager"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="inProgressPriorStatus"
                      fieldName="inProgressPriorStatus"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "inProgressPriorStatus",
                        size: "large",
                        autoComplete: "inProgressPriorStatus"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderSubstatus"
                      fieldName="salesOrderSubstatus"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderSubstatus",
                        size: "large",
                        autoComplete: "salesOrderSubstatus"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="sapContractNo"
                      fieldName="sapContractNo"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "sapContractNo",
                        size: "large",
                        autoComplete: "sapContractNo"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="sapMbBp"
                      fieldName="sapMbBp"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "sapMbBp",
                        size: "large",
                        autoComplete: "sapMbBp"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="sapBrokerBp"
                      fieldName="sapBrokerBp"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "sapBrokerBp",
                        size: "large",
                        autoComplete: "sapBrokerBp"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="totalOutstanding"
                      fieldName="totalOutstanding"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "totalOutstanding",
                        size: "large",
                        autoComplete: "totalOutstanding"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderDpReceived"
                      fieldName="salesOrderDpReceived"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderDpReceived",
                        size: "large",
                        autoComplete: "salesOrderDpReceived"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderDueAmount"
                      fieldName="salesOrderDueAmount"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderDueAmount",
                        size: "large",
                        autoComplete: "salesOrderDueAmount"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderReceivedAmount"
                      fieldName="salesOrderReceivedAmount"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderReceivedAmount",
                        size: "large",
                        autoComplete: "salesOrderReceivedAmount"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderSapContractNum"
                      fieldName="salesOrderSapContractNum"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderSapContractNum",
                        size: "large",
                        autoComplete: "salesOrderSapContractNum"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderSendToSap"
                      fieldName="salesOrderSendToSap"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderSendToSap",
                        size: "large",
                        autoComplete: "salesOrderSendToSap"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="buildingPhaseName"
                      fieldName="buildingPhaseName"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "buildingPhaseName",
                        size: "large",
                        autoComplete: "buildingPhaseName"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="netAmountSellingPrice"
                      fieldName="netAmountSellingPrice"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "netAmountSellingPrice",
                        size: "large",
                        autoComplete: "netAmountSellingPrice"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderAdmFeeWaivedAmount"
                      fieldName="salesOrderAdmFeeWaivedAmount"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderAdmFeeWaivedAmount",
                        size: "large",
                        autoComplete: "salesOrderAdmFeeWaivedAmount"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderAllOffers"
                      fieldName="salesOrderAllOffers"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderAllOffers",
                        size: "large",
                        autoComplete: "salesOrderAllOffers"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="sendToSap"
                      fieldName="sendToSap"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "sendToSap",
                        size: "large",
                        autoComplete: "sendToSap"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                
                  <Col span={6}>
                    <InputField
                      label="currentYearGeneralFundServiceCharge"
                      fieldName="currentYearGeneralFundServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "currentYearGeneralFundServiceCharge",
                        size: "large",
                        autoComplete: "currentYearGeneralFundServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="currentYearReserveFundServiceCharge"
                      fieldName="currentYearReserveFundServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "currentYearReserveFundServiceCharge",
                        size: "large",
                        autoComplete: "currentYearReserveFundServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="currentYearServiceChargeConfiguration"
                      fieldName="currentYearServiceChargeConfiguration"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "currentYearServiceChargeConfiguration",
                        size: "large",
                        autoComplete: "currentYearServiceChargeConfiguration"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="draftGeneratedGeneralFundServiceCharge"
                      fieldName="draftGeneratedGeneralFundServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "draftGeneratedGeneralFundServiceCharge",
                        size: "large",
                        autoComplete: "draftGeneratedGeneralFundServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="draftGeneratedReserveFundServiceCharge"
                      fieldName="draftGeneratedReserveFundServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "draftGeneratedReserveFundServiceCharge",
                        size: "large",
                        autoComplete: "draftGeneratedReserveFundServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="draftYearServiceChargeConfiguration"
                      fieldName="draftYearServiceChargeConfiguration"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "draftYearServiceChargeConfiguration",
                        size: "large",
                        autoComplete: "draftYearServiceChargeConfiguration"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="priorYearGeneralFundServiceCharge"
                      fieldName="priorYearGeneralFundServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "priorYearGeneralFundServiceCharge",
                        size: "large",
                        autoComplete: "priorYearGeneralFundServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="priorYearReserveFundServiceCharge"
                      fieldName="priorYearReserveFundServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "priorYearReserveFundServiceCharge",
                        size: "large",
                        autoComplete: "priorYearReserveFundServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="priorYearServiceChargeConfiguration"
                      fieldName="priorYearServiceChargeConfiguration"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "priorYearServiceChargeConfiguration",
                        size: "large",
                        autoComplete: "priorYearServiceChargeConfiguration"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="currentYearServiceCharge"
                      fieldName="currentYearServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "currentYearServiceCharge",
                        size: "large",
                        autoComplete: "currentYearServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="draftGeneratedServiceCharge"
                      fieldName="draftGeneratedServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "draftGeneratedServiceCharge",
                        size: "large",
                        autoComplete: "draftGeneratedServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="priorYearServiceCharge"
                      fieldName="priorYearServiceCharge"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "priorYearServiceCharge",
                        size: "large",
                        autoComplete: "priorYearServiceCharge"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="backupUnitCode"
                      fieldName="backupUnitCode"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "backupUnitCode",
                        size: "large",
                        autoComplete: "backupUnitCode"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="legalStatus"
                      fieldName="legalStatus"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "legalStatus",
                        size: "large",
                        autoComplete: "legalStatus"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderPaymentPlanDiscount"
                      fieldName="salesOrderPaymentPlanDiscount"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderPaymentPlanDiscount",
                        size: "large",
                        autoComplete: "salesOrderPaymentPlanDiscount"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col span={6}>
                    <InputField
                      label="salesOrderNonPaymentPlanDiscount"
                      fieldName="salesOrderNonPaymentPlanDiscount"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderNonPaymentPlanDiscount",
                        size: "large",
                        autoComplete: "salesOrderNonPaymentPlanDiscount"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col span={6}>
                    <InputField
                      label="salesOrderRebateAmount"
                      fieldName="salesOrderRebateAmount"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderRebateAmount",
                        size: "large",
                        autoComplete: "salesOrderRebateAmount"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col span={6}>
                    <InputField
                      label="salesOrderSaleType"
                      fieldName="salesOrderSaleType"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderSaleType",
                        size: "large",
                        autoComplete: "salesOrderSaleType"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderBookingDate"
                      fieldName="salesOrderBookingDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderBookingDate",
                        size: "large",
                        autoComplete: "salesOrderBookingDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderFinanceClearedDate"
                      fieldName="salesOrderFinanceClearedDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderFinanceClearedDate",
                        size: "large",
                        autoComplete: "salesOrderFinanceClearedDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderSpaSignedDate"
                      fieldName="salesOrderSpaSignedDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderSpaSignedDate",
                        size: "large",
                        autoComplete: "salesOrderSpaSignedDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderAccountBirthDate"
                      fieldName="salesOrderAccountBirthDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderAccountBirthDate",
                        size: "large",
                        autoComplete: "salesOrderAccountBirthDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderAccountEmiratesId"
                      fieldName="salesOrderAccountEmiratesId"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderAccountEmiratesId",
                        size: "large",
                        autoComplete: "salesOrderAccountEmiratesId"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderAccountPassport"
                      fieldName="salesOrderAccountPassport"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderAccountPassport",
                        size: "large",
                        autoComplete: "salesOrderAccountPassport"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderAccountEmail"
                      fieldName="salesOrderAccountEmail"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderAccountEmail",
                        size: "large",
                        autoComplete: "salesOrderAccountEmail"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="salesOrderAccountPhone"
                      fieldName="salesOrderAccountPhone"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "salesOrderAccountPhone",
                        size: "large",
                        autoComplete: "salesOrderAccountPhone"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="nameOfCorporate"
                      fieldName="nameOfCorporate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "nameOfCorporate",
                        size: "large",
                        autoComplete: "nameOfCorporate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="company"
                      fieldName="company"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "company",
                        size: "large",
                        autoComplete: "company"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="soldDate"
                      fieldName="soldDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "soldDate",
                        size: "large",
                        autoComplete: "soldDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="soldBookingDate"
                      fieldName="soldBookingDate"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "soldBookingDate",
                        size: "large",
                        autoComplete: "soldBookingDate"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="cornerUnit"
                      fieldName="cornerUnit"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "cornerUnit",
                        size: "large",
                        autoComplete: "cornerUnit"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="endUnit"
                      fieldName="endUnit"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "endUnit",
                        size: "large",
                        autoComplete: "endUnit"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="communityCenter"
                      fieldName="communityCenter"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "communityCenter",
                        size: "large",
                        autoComplete: "communityCenter"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="lakeView"
                      fieldName="lakeView"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "lakeView",
                        size: "large",
                        autoComplete: "lakeView"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="gardenView"
                      fieldName="gardenView"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "gardenView",
                        size: "large",
                        autoComplete: "gardenView"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="landscapeView"
                      fieldName="landscapeView"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "landscapeView",
                        size: "large",
                        autoComplete: "landscapeView"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col><Col span={6}>
                    <InputField
                      label="backToBack"
                      fieldName="backToBack"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "backToBack",
                        size: "large",
                        autoComplete: "backToBack"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="bua"
                      fieldName="bua"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "bua",
                        size: "large",
                        autoComplete: "bua"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="standardPrice"
                      fieldName="standardPrice"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "standardPrice",
                        size: "large",
                        autoComplete: "standardPrice"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="premiumPrice"
                      fieldName="premiumPrice"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "premiumPrice",
                        size: "large",
                        autoComplete: "premiumPrice"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={6}>
                    <InputField
                      label="createdAt"
                      fieldName="createdAt"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "createdAt",
                        size: "large",
                        autoComplete: "createdAt"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default CreateOrEdit;
