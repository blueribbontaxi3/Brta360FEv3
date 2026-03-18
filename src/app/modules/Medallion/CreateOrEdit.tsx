import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Spin, notification, message, Flex } from 'antd';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { formFieldErrors } from 'utils/helper';
import { SearchField } from '@atoms/FormElement';
import CorporationSelectField from '@atoms/CorporationSelectField';
import TaxiDetails from '@molecules/TaxiDetails';


const CreateOrEditPage = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);

        try {
          const response = await axios.get(`/medallions/${id}`);
          const memberData = response.data.data;

          if (memberData) {
            setData(memberData.medallionNumber)
            Object.keys(memberData.medallionNumber).forEach((key) => {
              setValue(key, memberData.medallionNumber[key]);
            });
            if (memberData?.medallionNumber?.medallionNumber) {
              await handleFetchData(memberData?.medallionNumber?.medallionNumber)
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
      title: (<Link to="/medallions">Medallion</Link>),
    },
    {
      title: id ? 'View' : 'Create',
    }
  ];
  const [vehicleNumber, setVehicleNumber] = useState<any>({});

  const validationSchema = yup.object().shape({
    corporationId: yup
      .number()
      .required('Corporation is a required field'),
    medallionNumber: yup
      .number()
      .typeError('Medallion Number must be a valid number') // Custom error for type mismatch
      .transform((value, originalValue) => (originalValue === '' ? null : value)) // Handle empty string
      .test(
        'required-if-vehicle-empty',
        'Medallion Number is required when no vehicle data is available',
        function (value) {
          return vehicleNumber?.public_vehicle_number ? true : false;
        }
      )
      .test(
        'required-if-vehicle-match',
        'Medallion Number does not match the provided Vehicle Data',
        function (value) {
          return vehicleNumber?.public_vehicle_number == getValues('medallionNumber');
        }
      )
      .required('Medallion Number is a required field'), // General required error
    vehicleNumber: yup.array().nullable(), // Assuming vehicleNumber is an array
  });


  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });

  useEffect(() => {
    console.log('errprs', errors)
  }, [errors])

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    data.status = (data.status == 'true' || data.status == true) ? 'active' : 'inactive'

    if (id) {
      data.user_id = id;
      console.log('data.status', data.status)
      axios.patch(`medallions/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/medallions');
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
        setLoading(false)
      });
    } else {
      axios.post('medallions/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1999)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/medallions');
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


  const handleFetchData = async (value: any) => {
    setLoading(true);
    try {
      const response = await axios.get(`/medallions/vehicle/data`,
        {
          params: {
            publicVehicleNumber: value,
            limit: 8000,
          },
        }
      );

      const isWav = response.data.data[0]?.wheelchair_accessible === 'Y' ? true : false
      setValue('isWav', isWav)
      if (response?.data?.data?.vehicle_data?.length === 0) {
        message.error("No vehicle data found for the provided medallion number.");
      } else {
        console.log('response.data.data', response.data.data)
        setVehicleNumber(response.data.data || []);
        message.success("Data fetched successfully!");
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={id ? 'View Medallion' : "Create Medallion"} data={data} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={24}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>

                  {!id &&
                    <>
                      <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                        <CorporationSelectField
                          label="Corporation"
                          fieldName="corporationId"
                          control={control}
                          errors={errors}
                        />
                      </Col>

                      <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                        <SearchField
                          label="Medallion Number"
                          fieldName="medallionNumber"
                          control={control}
                          iProps={{
                            placeholder: "Medallion Number",
                            size: "large",
                            onSearch: (value: any) => {
                              handleFetchData(value)
                            }
                          }}
                          errors={errors}
                        />
                      </Col>

                      {
                        vehicleNumber?.public_vehicle_number &&

                        <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                          <Flex justify='flex-start' align='center' style={{ height: '100%' }}>
                            <Button type="primary" size='large' htmlType="submit">
                              {id ? 'Update' : 'Create'}
                            </Button>
                          </Flex>
                        </Col>}
                    </>}

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <TaxiDetails data={vehicleNumber} />
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

export default CreateOrEditPage;
