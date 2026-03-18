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
import dayjs from 'dayjs';

const CreateOrEdit = (props: any) => {

  const { editData } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  let { id }: any = useParams();
  if (editData?.id) {
    id = editData?.id;
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchData = async () => {

        try {
          const response = await axios.get(`/pace-program-rates/${id}`);
          const paceProgramData = response.data.data;
          if (paceProgramData) {
            setData(paceProgramData?.paceProgram )
            setValue('year', paceProgramData?.paceProgram?.year);
            setValue('amount', paceProgramData?.paceProgram?.amount);
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
    console.log("id", id)
  }, [id, editData]);

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
      title: (<Link to="/pace-program-rates">Collision Rates</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  const { control, watch, handleSubmit, reset, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all'
  });
  useEffect(() => {
    console.log('errprs', errors)
    console.log('getValues()', getValues())
  }, [errors])

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    if (id) {
      axios.patch(`pace-program-rates/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          reset();
          props.setVisible({
            visible: false,
            isNew: true
          })
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
        setLoading(false)
      });
    } else {
      axios.post('pace-program-rates/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1999)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          reset();
          props.setVisible({
            visible: false,
            isNew: true
          })
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
      {/* <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Collision Rates' : "Create Collision Rates"} data={data} /> */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={24}>
            <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                  <DateField
                    label="For Year"
                    fieldName={`year`}
                    control={control}
                    iProps={{
                      placeholder: "Enter Year",
                      picker: "year",
                      onChange: (value: any, year: any) => {
                        setValue(`year`, year)
                      }
                    }}
                    errors={errors}
                  />
                </Col>
                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <DateField
                    label="Date"
                    fieldName={`date`}
                    control={control}
                    iProps={{
                      placeholder: "Enter Date",
                      size: "medium",
                      format: "MM-DD-YYYY"
                    }}
                    errors={errors}
                  />
                </Col> */}
                <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                  <InputNumberField
                    label={`Amount`}
                    fieldName={`amount`}
                    control={control}
                    iProps={{ placeholder: "Enter Amount", size: "medium", min: 1, addonAfter: "$" }}
                    errors={errors}
                  />
                </Col>
                <Col span={24}>
                  <Row gutter={8} justify="end" style={{ marginTop: '20px' }}>
                    <Col>
                      <Button
                        danger
                        type="primary"
                        onClick={() => {
                          reset()
                          props.setVisible(false)
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col>
                      <Button type="primary" htmlType="submit">
                        Add
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Spin >
    </>
  );
};

export default CreateOrEdit;
