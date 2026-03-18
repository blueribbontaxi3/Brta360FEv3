import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification, Image, Result } from 'antd';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { AddressComponent } from 'app/molecules/AddressComponent';
import { formFieldErrors, isRole } from 'utils/helper';
import { DateField, InputField, MaskInputField, RangePickerField, SwitchField } from '@atoms/FormElement';
import MediaCard from '@pages/MediaManager/MediaCard';
import { useSelector } from 'react-redux';


const DriverCreateOrEditPage = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [data, setData]: any = useState(null);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchMemberData = async () => {
        setLoading(true);

        try {
          const response = await axios.get(`/driver/${id}`);
          const memberData = response.data.data;

          if (memberData) {
            setData(memberData.driver)
            Object.keys(memberData.driver).forEach((key) => {
              if (key !== 'dlIssuedDate' && key !== 'dlExpiryDate') {
                setValue(key, memberData.driver[key]);
              } else if (key === 'dlIssuedDate') {
                setValue(
                  'dlIssuedDate',
                  [memberData.driver.dlIssuedDate, memberData.driver.dlExpirationDate]
                );
              }
            });
            setValue('status', memberData.driver.status.toLowerCase() === 'active');
          }
        } catch (error: any) {
          if (error.status == 403) {
            navigate('/403')
          }
          // Handle errors gracefully, e.g., log the error, display an error message to the user
          console.error('Error fetching driver data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMemberData();
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
      title: (<Link to="/drivers">Drivers</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is a required field'),
    middleName: yup.string().optional(),
    lastName: yup.string().required('Last Name is a required field'),
    emailAddress: yup.string().email('Invalid email format').required('Email Address is a required field'),
    phoneNumber: yup
      .string()
      .required('Phone Number is a required field')
      .matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Phone Number must be in the format (999)-999-9999'),
    preferredContact: yup.string().optional(),
    address: yup.string().required('Address is a required field'),
    //unit: yup.string().optional(),
    //city: yup.string().required('City is a required field'),
    //state: yup.string().required('State is a required field'),
    // zipCode: yup.string().required('Zip Code is a required field'),
    dateOfBirth: yup.date().required('Date of Birth is a required field'),
    // socialSecurityNumber: yup.string().matches(/^\d{3}-\d{2}-\d{4}$/, 'Social Security Number must be in the format XXX-XX-XXXX').required('Social Security Number is a required field'),
    // dlNumber: yup.string().matches(/^[A-Z]\d{3}-\d{4}-\d{4}$/, 'Driver License Number must be in the format A999-9999-9999').required('Driver License Number is a required field'),
    // dlIssuedDate: yup.date().required('Issued Date is a required field'),
    // dlExpirationDate: yup.date().required('Expiration Date is a required field'),
    // eFirstName: yup.string().required('Emergency First Name is a required field'),
    // eLastName: yup.string().required('Emergency Last Name is a required field'),
    // ePhoneNumber: yup.string().matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Phone Number must be in the format (999)-999-9999').required('Emergency Phone Number is a required field'),
    //emergencyEmailAddress: yup.string().email('Invalid email format').required('Emergency Email Address is a required field'),
    // eContactNotes: yup.string().optional(),
    status: yup
      .boolean()
      .transform((value, originalValue) => {
        if (originalValue === "") return undefined;
        return value;
      })
      .optional()
      .typeError("Status must be true or false"),
    preferId: yup.string().optional(),
  });

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });
  const authRole: any = useSelector(
    (state: any) => state?.user_login?.auth_role
  );

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    data.status = (data.status == 'true' || data.status == true) ? 'active' : 'inactive'
    if (id) {
      axios.post(`driver/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/drivers');
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
        setLoading(false)
      });
    } else {
      axios.post('driver/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1999)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/drivers');
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
      <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Driver' : "Create Driver"} data={data} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={24}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="First Name"
                      fieldName="firstName"
                      control={control}
                      iProps={{
                        placeholder: "First Name",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="Middle Name"
                      fieldName="middleName"
                      control={control}
                      iProps={{
                        placeholder: "Middle Name",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="Last Name"
                      fieldName="lastName"
                      control={control}
                      iProps={{
                        placeholder: "Last Name",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="Email Address"
                      fieldName="emailAddress"
                      control={control}
                      iProps={{
                        placeholder: "Email Address",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <MaskInputField
                      label="Phone Number"
                      fieldName="phoneNumber"
                      control={control}
                      iProps={{
                        placeholder: "Phone Number",
                        size: "large",
                        mask: "phone",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <MaskInputField
                      label="Preferred Contact"
                      fieldName="preferredContact"
                      control={control}
                      iProps={{
                        placeholder: "Preferred Contact",
                        size: "large",
                        mask: "phone",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <AddressComponent control={control} setValue={setValue} errors={errors} />

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <DateField
                      label="Date of Birth"
                      fieldName="dateOfBirth"
                      control={control}
                      iProps={{
                        size: "large",
                        format: 'MM-DD-YYYY'
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <MaskInputField
                      label="Social Security Number"
                      fieldName="socialSecurityNumber"
                      control={control}
                      iProps={{
                        placeholder: "Social Security Number",
                        size: "large",
                        mask: "ssn",
                      }}
                      errors={errors}
                      setValue={setValue}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <MaskInputField
                      label="Driver License Number"
                      fieldName="dlNumber"
                      control={control}
                      iProps={{
                        placeholder: "Driver License Number",
                        size: "large",
                        mask: "dl",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={8}>
                    <RangePickerField
                      label="Issued Date / Expiration Date"
                      fieldName="dlIssuedDate"
                      control={control}
                      iProps={{
                        size: "large",
                        format: 'MM-DD-YYYY'
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="Emergency First Name"
                      fieldName="emergencyFirstName"
                      control={control}
                      iProps={{
                        placeholder: "Emergency First Name",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="Emergency Last Name"
                      fieldName="emergencyLastName"
                      control={control}
                      iProps={{
                        placeholder: "Emergency Last Name",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <MaskInputField
                      label="Emergency Phone Number"
                      fieldName="emergencyPhoneNumber"
                      control={control}
                      iProps={{
                        placeholder: "Emergency Phone Number",
                        size: "large",
                        mask: "phone",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="Emergency Email Address"
                      fieldName="emergencyEmailAddress"
                      control={control}
                      iProps={{
                        placeholder: "Emergency Email Address",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="Emergency Notes"
                      fieldName="emergencyContactNotes"
                      control={control}
                      iProps={{
                        placeholder: "Emergency Notes",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>



                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <InputField
                      label="Preferred ID"
                      fieldName="preferId"
                      control={control}
                      iProps={{
                        placeholder: "Preferred ID",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={6} xl={4}>
                    <SwitchField
                      label="Status"
                      fieldName="status"
                      control={control}
                      initValue={1}
                      iProps={{
                        checkedChildren: "Active",
                        unCheckedChildren: "Inactive",
                      }}
                      errors={errors}
                    />
                  </Col>


                  <Col xs={24} sm={24} md={5} lg={5} xl={2}>
                    <MediaCard
                      name="driverImage"
                      buttonText="Driver Image"
                      allowedTypes={"images"}
                      previewSize={'110px'}
                      media_relations={data?.media_relations}
                      onChange={(media: any) => {
                        setValue('driverImage', media)
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={5} lg={5} xl={2}>
                    <MediaCard
                      name="documentsFile"
                      buttonText="Document"
                      allowedTypes={"images"}
                      previewSize={'110px'}
                      media_relations={data?.media_relations}
                      onChange={(media: any) => {
                        setValue('documentsFile', media)
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={5} lg={5} xl={2}>
                    <MediaCard
                      name="driverLicenseFile"
                      buttonText="Driver License"
                      allowedTypes={"images"}
                      previewSize={'110px'}
                      media_relations={data?.media_relations}
                      onChange={(media: any) => {
                        setValue('driverLicenseFile', media)
                      }}
                    />
                  </Col>
                  <Col span={24}>
                    <div style={{ textAlign: 'right' }}>
                      <Space size="small">
                        <Button type="primary" size='large' htmlType="submit">
                          {id ? 'Update' : 'Create'}
                        </Button>
                      </Space>
                    </div>
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

export default DriverCreateOrEditPage;
