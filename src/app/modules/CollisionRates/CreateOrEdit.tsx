import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification, Image, message, Flex, Segmented, Tag, Typography, Avatar, Empty, ConfigProvider, Affix, Modal } from 'antd';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../utils/axiosInceptor';
import { formFieldErrors } from 'utils/helper';
import { DateField, InputField, InputNumberField, MaskInputField, RangePickerField, SearchField, SwitchField } from '@atoms/FormElement';

import validationSchema from './validationSchema';

const CreateOrEdit = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [medallionData, setMedallionData] = useState([]);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchData = async () => {

        try {
          const response = await axios.get(`/collision-rates/${id}`);
          const collisionData = response.data.data;

          if (collisionData) {
            setData(collisionData.collision)
            setValue('forYear', collisionData.collision.forYear);
            setValue('vehicleYear', collisionData.collision.vehicleYear);
            setValue('collision', collisionData.collision.collisionRates)
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
      title: (<Link to="/collision-rates">Collision Rates</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];




  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    defaultValues: {
      collision: [
        { collisionType: 500, deductibleAmbRate: undefined, deductibleWavRate: undefined, costAmbRate: undefined, costWavRate: undefined },
        { collisionType: 1000, deductibleAmbRate: undefined, deductibleWavRate: undefined, costAmbRate: undefined, costWavRate: undefined },
        { collisionType: 5000, deductibleAmbRate: undefined, deductibleWavRate: undefined, costAmbRate: undefined, costWavRate: undefined }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "collision" // this should match the key in your form data
  });

  useEffect(() => {
    console.log('errprs', errors)
  }, [errors])

  const onSubmit: SubmitHandler<any> = async (data: any) => {


    setLoading(true)
    if (id) {
      axios.patch(`collision-rates/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/collision-rates');
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
        setLoading(false)
      });
    } else {
      axios.post('collision-rates/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1999)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/collision-rates');
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
      <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Collision Rates' : "Create Collision Rates"} data={data} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={24}>
            <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                  <Affix offsetTop={10}>
                    <Card>
                      <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                          <DateField
                            label="Vehicle Year"
                            fieldName="vehicleYear"
                            control={control}
                            iProps={{
                              placeholder: "Select Vehicle Year",
                              size: "large",
                              picker: "year",
                              onChange: (value: any, year: any) => {
                                setValue('vehicleYear', year)
                              },
                            }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                          <DateField
                            label="For Year"
                            fieldName={`forYear`}
                            control={control}
                            iProps={{
                              placeholder: "Enter Year",
                              size: "large",
                              picker: "year",
                              onChange: (value: any, year: any) => {
                                setValue(`forYear`, year)
                              },
                            }}
                            errors={errors}
                          />
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

                <Col xs={24} sm={24} md={12} lg={8} xl={18}>
                  {/* COLLISION TYPE 500 */}
                  {fields.map((item: any, index: any) => (
                    <Card title={`Collision Type ${item.collisionType}`} bordered={true} style={{ marginBottom: '20px' }} key={item.id}>
                      <Row gutter={16}>
                        {/* Hidden Field for Collision Type */}
                        <Col span={0}>
                          <InputField
                            fieldName={`collision[${index}].collisionType`}
                            control={control}
                            iProps={{ type: "hidden" }}
                            errors={errors}
                          />
                        </Col>

                        {/* Deductible Amb Rate */}
                        <Col xs={24} sm={24} md={12} lg={6}>
                          <InputNumberField
                            label={`Deductible Amb Rate`}
                            fieldName={`collision[${index}].deductibleAmbRate`}
                            control={control}
                            iProps={{ placeholder: "Enter Deductible Amb Rate", size: "large", min: 1, addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>

                        {/* Deductible WAV Rate */}
                        <Col xs={24} sm={24} md={12} lg={6}>
                          <InputNumberField
                            label={`Deductible WAV Rate`}
                            fieldName={`collision[${index}].deductibleWavRate`}
                            control={control}
                            iProps={{ placeholder: "Enter Deductible WAV Rate", size: "large", min: 1, addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>

                        {/* Cost Amb Rate */}
                        <Col xs={24} sm={24} md={12} lg={6}>
                          <InputNumberField
                            label={`Cost Amb Rate`}
                            fieldName={`collision[${index}].costAmbRate`}
                            control={control}
                            iProps={{ placeholder: "Enter Cost Amb Rate", size: "large", min: 1, addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>

                        {/* Cost WAV Rate */}
                        <Col xs={24} sm={24} md={12} lg={6}>
                          <InputNumberField
                            label={`Cost WAV Rate`}
                            fieldName={`collision[${index}].costWavRate`}
                            control={control}
                            iProps={{ placeholder: "Enter Cost WAV Rate", size: "large", min: 1, addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
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
