import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification, Tag, Typography, Affix, Modal } from 'antd';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { formFieldErrors } from 'utils/helper';
import { DateField, InputField, InputNumberField, } from '@atoms/FormElement';
import { CloseOutlined } from '@ant-design/icons';
const { confirm } = Modal;

const CreateOrEdit = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);

        try {
          const response = await axios.get(`/affiliations/${id}`);
          const affiliationData = response.data.data;

          if (affiliationData) {
            setData(affiliationData.affiliation)
            setValue('name', affiliationData.affiliation.name);
            const groupedByYear = affiliationData.affiliation.prices.reduce((acc: any, curr: any) => {
              const { year, name, costPrice, sellingPrice } = curr;

              if (!acc[year]) {
                acc[year] = { year };
              }

              acc[year][name] = { costPrice, sellingPrice };
              return acc;
            }, {});

            // Step 2: Convert grouped object to an array
            const output = Object.values(groupedByYear);


            setValue("prices", output)
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
      title: (<Link to="/affiliations">Affiliation</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    prices: yup
      .array()
      .of(
        yup.object().shape({
          year: yup
            .number()
            .required('Year is required')
            .typeError('Year must be a number')
            .test('unique-year', 'Year must be unique within the item list', function (value) {
              const prices = getValues('prices'); // `this.parent` refers to the current item object
              const years = prices.map((item: any) => item.year); // Get all years in the `prices` array
              const uniqueYears = new Set(years); // Create a Set to ensure uniqueness
              return years.length === uniqueYears.size; // Check if any duplicates exist
            }),
          affiliation: yup.object({
            costPrice: yup.string().required('Affiliation cost is required'),
            sellingPrice: yup.string().required('Affiliation sell price is required'),
          }),
          cmg: yup.object({
            costPrice: yup.string().required('CMG cost is required'),
            sellingPrice: yup.string().required('CMG sell price is required'),
          }),
          liability: yup.object({
            costPrice: yup.string().required('Liability cost is required'),
            sellingPrice: yup.string().required('Liability sell price is required'),
          }),
          pace: yup.object({
            costPrice: yup.string().required('Pace cost is required'),
            sellingPrice: yup.string().required('Pace sell price is required'),
          }),
          workman: yup.object({
            costPrice: yup.string().required('workman cost is required'),
            sellingPrice: yup.string().required('workman sell price is required'),
          }),
        })
      ),
  });


  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      prices: [
        {
          affiliation: { costPrice: "", sellingPrice: "" },
          cmg: { costPrice: "", sellingPrice: "" },
          liability: { costPrice: "", sellingPrice: "" },
          pace: { costPrice: "", sellingPrice: "" },
          workman: { costPrice: "", sellingPrice: "" }
        }
      ],
    },
  });

  useEffect(() => {
    console.log('errprs', errors)
  }, [errors])

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    if (id) {
      axios.patch(`affiliations/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/affiliations');
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
        setLoading(false)
      });
    } else {
      axios.post('affiliations/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1999)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/affiliations');
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
  // Field Array for Repeating Rows
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
  });

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Affiliation' : "Create Affiliation"} data={data} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={24}>
            <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Affix offsetTop={10}>
                    <Card>
                      <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                          <InputField
                            label="Name"
                            fieldName="name"
                            control={control}
                            iProps={{
                              placeholder: "Name",
                              size: "large",
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

                  {fields.map((field, index) => (
                    <Card
                      key={index}
                      extra={
                        index > 0 && <CloseOutlined
                          onClick={() => {
                            confirm({
                              title: "Are you sure you want to remove this row?",
                              content: "This action cannot be undone.",
                              okText: "Yes, Remove",
                              cancelText: "Cancel",
                              okType: "danger",
                              onOk() {
                                remove(index); // Row ko remove karne ka logic
                              },
                              onCancel() {
                                console.log("Row removal cancelled"); // Optional: Log ya custom logic
                              },
                            });
                          }
                          }
                        />
                      }>
                      <Row gutter={16} key={field.id}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <DateField
                            label="Year"
                            fieldName={`prices.${index}.year`}
                            control={control}
                            iProps={{
                              placeholder: "Enter Year",
                              size: "large",
                              picker: "year",
                              onChange: (value: any, year: any) => {
                                setValue(`prices.${index}.year`, year)
                              }
                            }}
                            errors={errors}
                          />
                        </Col>
                        {/* AFFILIATION */}
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          <InputNumberField
                            label="AFFILIATION Cost Price"
                            fieldName={`prices.${index}.affiliation.costPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Cost Price", size: "large", addonAfter: "$", min: 0 }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          <InputNumberField
                            label="AFFILIATION Sell Price"
                            fieldName={`prices.${index}.affiliation.sellingPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Sell Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                        {/* CMG PRICE */}
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          <InputNumberField
                            label="CMG PRICE Cost Price"
                            fieldName={`prices.${index}.cmg.costPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Cost Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          <InputNumberField
                            label="CMG PRICE Sell Price"
                            fieldName={`prices.${index}.cmg.sellingPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Sell Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          {/* LIABILITY */}
                          <InputNumberField
                            label="LIABILITY Cost Price"
                            fieldName={`prices.${index}.liability.costPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Cost Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          <InputNumberField
                            label="LIABILITY Sell Price"
                            fieldName={`prices.${index}.liability.sellingPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Sell Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          {/* PACE */}
                          <InputNumberField
                            label="PACE Cost Price"
                            fieldName={`prices.${index}.pace.costPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Cost Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          <InputNumberField
                            label="PACE Sell Price"
                            fieldName={`prices.${index}.pace.sellingPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Sell Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          {/* workman */}
                          <InputNumberField
                            label="workman Cost Price"
                            fieldName={`prices.${index}.workman.costPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Cost Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                          <InputNumberField
                            label="workman Sell Price"
                            fieldName={`prices.${index}.workman.sellingPrice`}
                            control={control}
                            iProps={{ placeholder: "Enter Sell Price", size: "large", addonAfter: "$" }}
                            errors={errors}
                          />
                        </Col>

                        {index > 0 &&
                          <Button
                            type="default"
                            danger
                            onClick={() => {
                              confirm({
                                title: "Are you sure you want to remove this row?",
                                content: "This action cannot be undone.",
                                okText: "Yes, Remove",
                                cancelText: "Cancel",
                                okType: "danger",
                                onOk() {
                                  remove(index); // Row ko remove karne ka logic
                                },
                                onCancel() {
                                  console.log("Row removal cancelled"); // Optional: Log ya custom logic
                                },
                              });
                            }}
                            style={{ marginTop: "10px" }}
                          >
                            Remove Row
                          </Button>
                        }
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() =>
                      append({
                        affiliation: { costPrice: "", sellingPrice: "" },
                        cmg: { costPrice: "", sellingPrice: "" },
                        liability: { costPrice: "", sellingPrice: "" },
                        pace: { costPrice: "", sellingPrice: "" },
                        workman: { costPrice: "", sellingPrice: "" },
                      })
                    }
                    style={{ marginBottom: "20px" }}
                  >
                    + Add Row
                  </Button>

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
