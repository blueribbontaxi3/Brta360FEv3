import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification, Image, Modal, Divider } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { AddressComponent } from 'app/molecules/AddressComponent';
import { formFieldErrors } from 'utils/helper';
import { DateField, InputField, MaskInputField, RangePickerField, SelectField, SwitchField } from '@atoms/FormElement';
import Banner from '@molecules/Banner';
import MemberSelectField from '@atoms/MemberSelectField';
import moment from 'moment';
import CorporationTypeAndSubTypeSelect from '@atoms/CorporationTypeSelect';
import AffiliationSelect from '@atoms/AffiliationSelect';
import UserCreateOrEditPage from 'app/pages/User/CreateOrEdit';
import OfficerCreateOrEdit from './OfficerForm';
import OfficerCard from './OfficerCard';
import DiscountSelect from '@atoms/DiscountSelectField';
import MediaCard from '@pages/MediaManager/MediaCard';


const CorporationCreateOrEditPage = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [data, setData]: any = useState(null);
  const [memberUserData, setMemberUserData]: any = useState([]);
  const [isMemberSelect, setIsMemberSelect] = useState(false);
  const [modalTitle, setModalTitle]: any = useState('');
  const [officerSelectValue, setOfficerSelectValue]: any = useState(null);
  const navigate = useNavigate();
  let { id } = useParams();
  const [open, setOpen]: any = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/corporations/${id}`);
          const itemData = response.data.data;

          if (itemData) {
            setData(itemData.corporation)
            Object.keys(itemData.corporation).forEach((key) => {
              setValue(key, itemData.corporation[key]);
            });
            setValue('status', itemData.corporation.status.toLowerCase() === 'active');

          }
        } catch (error) {
          // Handle errors gracefully, e.g., log the error, display an error message to the user
          console.error('Error fetching  data:', error);
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
      title: (<Link to="/corporations">Corporation</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  const validationSchema = yup.object().shape({
    memberId: yup.number().required('Member is a required field'),
    corporationName: yup.string().required('Corporation Name is a required field'),
    fileNumber: yup
      .string()
      .matches(/^\d{8}$/, 'File Number must be exactly 8 digits')
      .required('File Number is a required field'),
    incorporationDate: yup
      .date().required('Incorporation Date is a required field'),
    corporationTypeId: yup
      .number()
      .transform((value) => (value === '' ? null : value)) // Convert empty string to null
      .required('Corporation Type ID is a required field')
      .typeError('Corporation Type ID must be a number'),
    discountId: yup
      .number()
      .transform((value) => (value === '' ? null : value)) // Convert empty string to null
      .required('Discount ID is a required field')
      .typeError('Discount ID must be a number'),
    affiliationId: yup
      .number()
      .transform((value) => (value === '' ? null : value)) // Convert empty string to null
      .required('Affiliation ID is a required field')
      .typeError('Affiliation ID must be a number'),
    efinNo: yup
      .string()
      .matches(/^\d{2}-\d{7}$/, 'EFIN Number must be in the format 00-0000000')
      .required('EFIN No. is a required field'),
    // irisNo: yup.string().required('IRIS No. is a required field'),
    address: yup.string().required('Address is a required field'),
    // status: yup.string().required('Status is a required field'),
    agentId: yup
      .number()
      .transform((value) => (value === '' ? null : value)) // Convert empty string to null
      .required('Agent is a required field')
      .typeError('Agent must be a number'),
    presidentId: yup
      .number()
      .transform((value) => (value === '' ? null : value)) // Convert empty string to null
      .required('President is a required field')
      .typeError('President must be a number'),
    secretaryId: yup
      .number()
      .transform((value) => (value === '' ? null : value)) // Convert empty string to null
      .required('Secretary is a required field')
      .typeError('Secretary must be a number'),
    signerId: yup
      .number()
      .transform((value) => (value === '' ? null : value)) // Convert empty string to null
      .required('Signer is a required field')
      .typeError('Signer must be a number'),
  });

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });


  const getMemberUser = async () => {
    const response = await axios.get(`/users/`, {
      params: {
        member_id: getValues('memberId'),
        role_ids: [3, 4, 5, 6],
        page: 'corporation'
      }
    });
    const itemData = response?.data?.data?.items;
    setMemberUserData(itemData)
    return itemData;
  }

  useEffect(() => {
    const memberId = watch('memberId'); // Watch the memberId field value in real-time
    if (memberId) {
      getMemberUser();
      setIsMemberSelect(true);
    } else {
      setIsMemberSelect(false);
    }
  }, [watch('memberId')]); // Dependency array now reacts to changes in memberId


  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    data.incorporationDate = moment(data.incorporationDate).format('YYYY-MM-DD')
    delete data.updatedAt;
    delete data.createdAt;
    data.status = (data.status == 'true' || data.status == true) ? 'active' : 'inactive'
    if (id) {
      data.user_id = id;
      axios.put(`corporations/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/corporations');
        }
      }).catch((e) => {
        formFieldErrors(e, setError)
        setLoading(false)
      });
    } else {
      axios.post('corporations/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/corporations');
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
      <Banner
        breadCrumb={breadCrumbList}
        title={id ? 'Edit Corporation' : "Create Corporation"}
        data={data}
      />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={24}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                    <MemberSelectField
                      label="Member"
                      fieldName="memberId"
                      control={control}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                    <InputField
                      label="Corporation Name"
                      fieldName="corporationName"
                      control={control}
                      iProps={{
                        placeholder: "Corporation Name",
                        size: "large",
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                    <MaskInputField
                      label="File Number"
                      fieldName="fileNumber"
                      control={control}
                      iProps={{
                        placeholder: "File Number",
                        size: "large",
                        mask: "99999999",
                        valueGot: data && data?.fileNumber
                      }}
                      errors={errors}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                    <DateField
                      label="Incorporation Date"
                      fieldName="incorporationDate"
                      control={control}
                      iProps={{
                        placeholder: "Incorporation Date",
                        size: "large",
                        format: 'MM-DD-YYYY'
                      }}
                      errors={errors}
                    />
                  </Col>

                  <CorporationTypeAndSubTypeSelect data={data} control={control} errors={errors} setValue={setValue} watch={watch} getValues={getValues} />

                  <DiscountSelect control={control} errors={errors} setValue={setValue} watch={watch} getValues={getValues} />

                  <AffiliationSelect control={control} errors={errors} setValue={setValue} watch={watch} getValues={getValues} />


                  <Col xs={24} sm={24} md={12} lg={8} xl={4}>
                    <MaskInputField
                      label="Employer Identification"
                      fieldName="efinNo"
                      control={control}
                      iProps={{
                        placeholder: "Employer Identification",
                        size: "large",
                        mask: "99-9999999",
                      }}
                      errors={errors}
                    />
                  </Col>
                  <AddressComponent control={control} setValue={setValue} errors={errors} />
                  {isMemberSelect && <OfficerCard corporationData={data} watch={watch} setValue={setValue} getValues={getValues} control={control} errors={errors} memberUserData={memberUserData}   {...{ open, setOpen, modalTitle, setModalTitle, officerSelectValue, setOfficerSelectValue }} />}



                  <Col span={4}>
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
                  <Col span={24}>
                    <Divider />
                    <Row>
                      <Col xs={24} sm={24} md={8} lg={5} xl={4}>
                        <MediaCard
                          name="corporationLogo"
                          buttonText="Logo"
                          allowedTypes={"images"}
                          previewSize={'180px'}
                          media_relations={data?.media_relations}
                          onChange={(media: any) => {
                            setValue('corporationLogo', media)
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={5} xl={4}>
                        <MediaCard
                          name="articlesOfIncorporationFile"
                          buttonText="Articles Of Incorporation"
                          allowedTypes={"images"}
                          previewSize={'180px'}
                          media_relations={data?.media_relations}
                          onChange={(media: any) => {
                            setValue('articlesOfIncorporationFile', media)
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={5} xl={4}>
                        <MediaCard
                          name="federalIdNumberFile"
                          buttonText="Federal ID Number"
                          allowedTypes={"images"}
                          previewSize={'180px'}
                          media_relations={data?.media_relations}
                          onChange={(media: any) => {
                            setValue('federalIdNumberFile', media)
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={5} xl={4}>
                        <MediaCard
                          name="otherDocumentFile"
                          buttonText="Other Document"
                          allowedTypes={"images"}
                          previewSize={'180px'}
                          media_relations={data?.media_relations}
                          onChange={(media: any) => {
                            setValue('otherDocumentFile', media)
                          }}
                        />
                      </Col>

                    </Row>
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
              {
                memberUserData.length > 0 && <OfficerCreateOrEdit {...{ open, setOpen, modalTitle, officerSelectValue, setOfficerSelectValue }} setMemberUserData={setMemberUserData} memberUserData={memberUserData} corporationGetValues={getValues} />
              }

            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default CorporationCreateOrEditPage;
