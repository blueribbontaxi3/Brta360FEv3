import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification, Image, message, Flex, Segmented, Tag, Typography, Avatar, Empty, ConfigProvider, Tooltip, Modal, Checkbox } from 'antd';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { AddressComponent } from 'app/molecules/AddressComponent';
import { formFieldErrors } from 'utils/helper';
import { DateField, InputField, MaskInputField, RangePickerField, SearchField, SwitchField } from '@atoms/FormElement';
import CorporationSelectField from '@atoms/CorporationSelectField';
import TaxiDetails from '@molecules/TaxiDetails';
import { values } from 'lodash';
import { current } from '@reduxjs/toolkit';
import moment from 'moment';
import VehicleDetails from '@molecules/VehicleDetails';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const { CheckableTag } = Tag;


const CreateOrEditPage = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [medallionData, setMedallionData]: any = useState([]);
  const [forceModal, setForceModal] = useState(false);
  const [forceMessage, setForceMessage] = useState('');
  const [forceChecked, setForceChecked] = useState(false);
  const [forcePayload, setForcePayload] = useState<any>(null);
  const [existingVehicle, setExistingVehicle] = useState<any>(null);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);

        try {
          const response = await axios.get(`/vehicles/${id}`);
          const vehicleData = response.data.data;

          if (vehicleData) {
            setData(vehicleData.vehicle)
            // Object.keys(vehicleData.vehicle).forEach((key) => {
            //   setValue(key, vehicleData.vehicle[key]);
            // });
            setValue('vinNumber', vehicleData?.vehicle?.vinNumber)
            setValue('corporationId', vehicleData?.vehicle?.medallion?.corporation?.id);
            setSelectedTags([vehicleData?.vehicle?.medallionId]);
            setValue('medallionId', vehicleData?.vehicle?.medallionId)

            console.log("vehicleData?.vinNumber", vehicleData?.vehicle?.vinNumber)
            if (vehicleData?.vehicle?.vinNumber) {
              await handleFetchData(vehicleData?.vehicle?.vinNumber)
            }
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


  const [vehicleNumber, setVehicleNumber] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<any>([]);

  const validationSchema = yup.object().shape({
    corporationId: yup
      .number()
      .required('Corporation is a required field'),
    // vinNumber: yup.string()
    //   .matches(/^[a-zA-Z0-9]+$/, 'Vin Number must be alphanumeric') // Alphanumeric validation
    //   .typeError('Vin Number must be a valid alphanumeric string')
    //   .transform((value, originalValue) => (originalValue === '' ? null : value)) // Handle empty string
    //   .test(
    //     'required-if-vehicle-empty',
    //     'Vin Number is required when no vehicle details is available',
    //     function (value) {
    //       return vehicleNumber?.public_vehicle_number ? true : false;
    //     }
    //   )
    //   .test(
    //     'required-if-vehicle-match',
    //     'Vehicle  does not match the provided Vehicle Data',
    //     function (value) {
    //       return vehicleNumber?.public_vehicle_number == getValues('medallionNumber');
    //     }
    //   )
    //   .required('Vehicle Number is a required field'), // General required error
    // vehicleNumber: yup.array().nullable(), // Assuming vehicleNumber is an array
    medallionId: yup.number().required('Medallion is a required field'), // Assuming vehicleNumber is an array
  });

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });

  useEffect(() => {
    console.log('errprs', errors)
  }, [errors])

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: any | null = null;

    if (loading) {
      setElapsed(0); // reset on new load
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const fetchCorporationData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`/medallions/`, {
        params: {
          corporationId: getValues('corporationId'),
          pageSize: 9999
        }
      });
      const medallionData = response.data.data?.items;

      if (medallionData) {
        //setMedallionData(medallionData)
        setMedallionData(medallionData)
      }
    } catch (error) {
      // Handle errors gracefully, e.g., log the error, display an error message to the user
      console.error('Error fetching medallion data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (getValues('corporationId')) {
      fetchCorporationData();
    }

  }, [watch('corporationId')])

  const submitApi = (payload: any) => {
    axios.post('vehicles/store', payload).then((r) => {
      setTimeout(() => {
        setLoading(false)
      }, 1999)
      if (r?.data?.status === 1) {
        notification.success({
          message: 'Success',
          description: r.data.message,
          duration: 5,
        });
        navigate('/vehicles');
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
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    data.status = (data.status == 'true' || data.status == true) ? 'active' : 'inactive'



    if (id) {
      data.user_id = id;
      axios.patch(`vehicles/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/vehicles');
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
        setLoading(false)
      });
    } else {
      axios.post('vehicles/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1999)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/vehicles');
        } else {
          notification.error({
            message: 'Error',
            description: 'Something went wrong',
            duration: 5,
          });
        }
      }).catch((e) => {
        console.log("Error in submitApi:", e?.response?.data);
        if (e?.response?.data?.isModal) {
          setForceMessage(e?.response?.data?.message || 'Vehicle with this VIN already exists.');
          setForceModal(true);
          setForcePayload(data);
          setExistingVehicle(e?.response?.data?.vehicle); // <-- Add this line
        } else {
          formFieldErrors(e, setError)

        }
      }
      ).finally(() => {
        setLoading(false);
      });
    }
  };

  const handleForceSubmit = () => {
    if (forcePayload) {
      setForceModal(false);
      setLoading(true);
      submitApi({ ...forcePayload, isForceSave: true });
      setForceChecked(false);
      setForcePayload(null);
    }
  };

  const handleChange = (tag: any, checked: any) => {
    if (checked) {
      // Allow only one selection
      setSelectedTags([tag.id]);
      setValue('medallionId', tag.id)
    } else {
      setSelectedTags([]);
      setValue('medallionId', null)
    }
  };

  const handleFetchData = async (value: any) => {
    setLoading(true);
    try {
      const response = await axios.get(`/vehicles/vin-decoder/${getValues('vinNumber')}`);

      setVehicleNumber(response.data.data || []);
      message.success("Data fetched successfully!");
    } catch (error: any) {
      setVehicleNumber(error.response || []);
      console.log("Error fetching data:", error);
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Banner
        title="Vehicles"
        breadCrumb={[{ title: "Home", path: "/" }, { title: "Vehicle" }]}
        buttonTitle="Create"
        buttonUrl="/vehicle/create"
        permission="Vehicles Create"
        exportPermission="Vehicles Export"
        data={data}
      />
      <Spin spinning={loading} tip={`Loading vehicle details... (${elapsed}s)`}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={24}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <Row gutter={16}>
                      <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                        <SearchField
                          label={
                            <Space>
                              Vin Number
                              <Tooltip title="First enter the VIN number, then click the search button. After that, you can assign the vehicle medallion.">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
                              </Tooltip>
                            </Space>
                          }
                          fieldName="vinNumber"
                          control={control}
                          iProps={{
                            placeholder: "Vin Number",
                            size: "large",
                            onSearch: (value: any) => {
                              handleFetchData(value);
                            },
                          }}
                          errors={errors}
                        /> </Col>
                      <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                        <CorporationSelectField
                          label="Corporation"
                          fieldName="corporationId"
                          control={control}
                          errors={errors}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                        <Flex gap={4} wrap align="center">
                          <Text>Medallions:</Text>
                          <Space size="middle" style={{ marginLeft: 12 }}>
                            <Tag color="success" style={{ margin: 0 }}>Available</Tag>
                            <Tag color="error" style={{ margin: 0 }}>Already Assigned</Tag>
                            <Tag color="geekblue" style={{ margin: 0 }}>Current Vehicle Assigned</Tag>
                          </Space>
                        </Flex>
                        <Flex gap={4} wrap align="center" style={{ marginTop: 8 }}>
                          {medallionData.map((tag: any) => (
                            !tag?.vehicle ? (
                              <CheckableTag
                                key={tag.id}
                                checked={selectedTags.includes(tag.id)}
                                onChange={(checked) => handleChange(tag, checked)}
                              >
                                <Tag icon={<CheckCircleOutlined />} color="success">
                                  {tag.medallionNumber}
                                </Tag>
                              </CheckableTag>
                            ) : (
                              <Tooltip title={tag.id == getValues('medallionId') ? 'Current Vehicle Assigned' : "Already Assigned"}>
                                <Tag color={tag.id == getValues('medallionId') ? 'geekblue' : 'error'}>
                                  {tag.medallionNumber}
                                </Tag>
                              </Tooltip>
                            )
                          ))}
                        </Flex>
                        {errors?.medallionId?.message && (
                          <Text type="danger">{errors?.medallionId?.message}</Text>)}

                      </Col>

                      {
                        vehicleNumber?.intro?.vin && (
                          <Col span={24}>
                            <div style={{ textAlign: 'right' }}>
                              <Space size="small">
                                <Button type="primary" size='large' htmlType="submit">
                                  {id ? 'Update' : 'Create'}
                                </Button>
                              </Space>
                            </div>
                          </Col>
                        )}


                    </Row>
                  </Col>

                  {/* <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                   
                  </Col> */}
                  {/* <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                    <Flex justify='flex-start' align='center' style={{ height: '100%' }}>
                      <Button type="primary" size='large' htmlType="submit">
                        {id ? 'Update' : 'Create'}
                      </Button>
                    </Flex>
                  </Col> */}

                  <Col xs={24} sm={24} md={24} lg={16} xl={16}>

                    <VehicleDetails loading={loading} data={vehicleNumber} {...{ control, errors, handleFetchData }} />

                  </Col>

                </Row>
                <Modal
                  open={forceModal}
                  onCancel={() => setForceModal(false)}
                  width={'40%'}
                  footer={[
                    <Button key="cancel" onClick={() => setForceModal(false)}>
                      Cancel
                    </Button>,
                    <Button
                      key="force"
                      type="primary"
                      disabled={!forceChecked}
                      onClick={handleForceSubmit}
                    >
                      Forcefully Save
                    </Button>,
                  ]}
                  centered
                  title="Duplicate VIN Detected"
                >
                  <p style={{ color: 'red', marginBottom: 16, fontWeight: 500 }}>
                    {forceMessage}
                  </p>

                  <p style={{ marginBottom: 12 }}>
                    A vehicle with this VIN already exists in our system.
                    Since it has <b>no active insurance</b>, the record will be updated as follows:
                  </p>

                  <ul style={{ marginBottom: 16, paddingLeft: 20 }}>
                    <li>
                      The vehicle will be removed from its current medallion:
                      {" "}
                      <Tag color="red">
                        {existingVehicle?.medallion?.medallionNumber || '-'}
                      </Tag>
                    </li>

                    <li>
                      The vehicle will be reassigned to the new medallion you are adding now:
                      {" "}
                      <Tag color="green">
                        {medallionData?.find((item: any) => selectedTags == item.id)?.medallionNumber || '-'}                      </Tag>
                    </li>
                  </ul>

                  <Checkbox
                    checked={forceChecked}
                    onChange={e => setForceChecked(e.target.checked)}
                    style={{ marginBottom: 20 }}
                  >
                    I understand and want to forcefully save this vehicle.
                  </Checkbox>

                  {/* Existing vehicle info */}
                  {forceModal && forcePayload && forceMessage && (
                    <Card
                      size="small"
                      title="Existing Vehicle Details"
                      style={{ marginTop: 24, background: "#fafafa" }}
                      bordered
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <p>
                            <b>Corporation:</b>{" "}
                            {existingVehicle?.medallion?.corporation?.corporationName || "-"}
                          </p>
                          <p>
                            <b>Medallion Number:</b>{" "}
                            {existingVehicle?.medallion?.medallionNumber || "-"}
                          </p>
                          <p>
                            <b>Member:</b>{" "}
                            {existingVehicle?.medallion?.corporation?.member?.fullName || "-"}
                          </p>
                        </Col>
                        <Col span={12}>
                          <p>
                            <b>Vehicle:</b>{" "}
                            {existingVehicle?.vehicleYear?.year}{" "}
                            {existingVehicle?.vehicleMake?.name}{" "}
                            {existingVehicle?.vehicleModel?.name}
                          </p>
                          <p>
                            <b>VIN:</b> {existingVehicle?.vinNumber}
                          </p>
                          <p>
                            <b>Type:</b> {existingVehicle?.vehicleType?.name}
                          </p>
                          <p>
                            <b>Insurance Status:</b>{" "}
                            {existingVehicle?.insurance?.status ? (
                              <Tag color="green" style={{ marginLeft: 4 }}>
                                {existingVehicle?.insurance?.status.toUpperCase()}
                              </Tag>
                            ) : (
                              "-"
                            )}
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  )}
                </Modal>

              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default CreateOrEditPage;
