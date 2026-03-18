import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification, Image, message, Flex, Segmented, Tag, Typography, Avatar, Empty, ConfigProvider, Affix, Modal } from 'antd';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { AddressComponent } from 'app/molecules/AddressComponent';
import { formFieldErrors } from 'utils/helper';
import { DateField, InputField, InputNumberField, MaskInputField, RangePickerField, SearchField, SwitchField } from '@atoms/FormElement';
import CorporationSelectField from '@atoms/CorporationSelectField';
import TaxiDetails from '@molecules/TaxiDetails';
import { values } from 'lodash';
import { current } from '@reduxjs/toolkit';
import moment from 'moment';
import VehicleDetails from '@molecules/VehicleDetails';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import VehicleYearsSelectField from '@atoms/VehicleYearsSelectField';
import validationSchema from './validationSchema';
import MediaCard from '@pages/MediaManager/MediaCard';
import { VehicleInfo } from '@modules/Insurance/components/insurance/VehicleInfo';
import MedallionNumberSelect from '@atoms/MedallionNumberSelect';
const { Title, Text } = Typography;
const { CheckableTag } = Tag;
const { confirm } = Modal;

const CreateOrEdit = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [data, setData]: any = useState(null);
  const [medallionData, setMedallionData] = useState([]);
  const [singleMedallionData, setSingleMedallionData]: any = useState({});
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchData = async () => {

        try {
          const response = await axios.get(`/transponders/${id}`);
          const transponderData = response.data.data;

          if (transponderData) {
            setData(transponderData.transponder)
            setValue('applyDate', transponderData.transponder?.applyDate)
            setValue('transponderNumber', transponderData.transponder?.transponderNumber)
            setValue('medallionNumberId', medallionData.find((item: any) => item.medallionNumber == transponderData.transponder?.medallionNumber)?.['id'])
          }
        } catch (error) {
          // Handle errors gracefully, e.g., log the error, display an error message to the user
          console.error('Error fetching member data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  const breadCrumbList: any = [
    {
      title: (
        <>
          <Link to="/">
            <span>Dashboard</span>
          </Link>
        </>
      ),
    },
    {
      title: (<Link to="/transponders">Transponders</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all'
  }
  );

  useEffect(() => {
    if (medallionData.length > 0 && data) {
      setValue('medallionNumberId', medallionData.find((item: any) => item.medallionNumber == data?.medallionNumber)?.['id'])
    }

  }, [medallionData, data])

  useEffect(() => {
    console.log("=========", errors)
  }, [errors])

  useEffect(() => {

    setSingleMedallionData(medallionData.find((i: any) => {
      return i.id == getValues('medallionNumberId');
    }));

  }, [watch('medallionNumberId')])

  const onSubmit: SubmitHandler<any> = async (data: any) => {

    data.medallionNumber = singleMedallionData?.medallionNumber

    setLoading(true)
    if (id) {
      axios.patch(`transponders/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/transponder');
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
        setLoading(false)
      });
    } else {
      axios.post('transponders/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1999)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/transponder');
        } else {
          notification.error({
            message: 'Error',
            description: 'Something went wrong',
            duration: 5,
          });
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
      }
      ).finally(() => {
        setLoading(false);
      });
    }
  }

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Transponder' : "Create Transponder"} data={data} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={10}>
            <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Affix offsetTop={10}>
                    <Card>
                      <Row gutter={[16, 16]}>
                        <MedallionNumberSelect
                          control={control}
                          errors={errors}
                          colProps={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, }}
                          setMedallionNumberData={setMedallionData}
                          medallionNumberData={medallionData}
                          vehicleRequired={'1'}
                        />
                        <Col xs={24} sm={24} md={12} lg={24} xl={24}>

                          <InputField
                            label="Transponder Number"
                            fieldName="transponderNumber"
                            control={control}
                            iProps={{
                              placeholder: "Enter Transponder Number",
                            }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                          <DateField
                            label="Apply Date"
                            fieldName={`applyDate`}
                            control={control}
                            iProps={{
                              placeholder: "Apply Date",
                              size: "medium",
                              format:'MM-DD-YYYY'
                            }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                          <MediaCard
                            name="transponderFile"
                            buttonText="File"
                            allowedTypes={"images"}
                            previewSize={'110px'}
                            media_relations={data?.media_relations}
                            onChange={(media: any) => {
                              setValue('transponderFile', media)
                            }}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={19} lg={19} xl={19}>
                          <VehicleInfo data={singleMedallionData} />
                        </Col>
                        <Col span={24}>
                          <div style={{ textAlign: 'right' }}>
                            <Space size="large">
                              <Button type="primary" size='large' htmlType="submit">
                                {id ? 'Update' : 'Create'}
                              </Button>
                            </Space>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Affix>
                </Col>


                {/* <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                    <Flex justify='flex-start' align='center' style={{ height: '100%' }}>
                      <Button type="primary" size='large' htmlType="submit">
                        {id ? 'Update' : 'Create'}
                      </Button>
                    </Flex>
                  </Col> */}




              </Row>
            </Form>

          </Col>
        </Row>
      </Spin >
    </>
  );
};

export default CreateOrEdit;
