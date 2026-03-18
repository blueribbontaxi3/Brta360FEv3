import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { formFieldErrors } from 'utils/helper';
import Banner from '@molecules/Banner';
import ImageUpload from '@molecules/Image/ImageUpload';
import { InputField, InputPassword, SelectField, SwitchField } from '@atoms/FormElement';
import { getValue } from '@testing-library/user-event/dist/utils';
import MemberSelectField from '@atoms/MemberSelectField';





const CreateOrEdit = (props: any) => {

  const { hideBanner }: any = props;
  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  let { id }: any = useParams();
  let isCreate = window.location.pathname.includes('create');



  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);

        try {
          // Fetch the user details based on the id
          const response = await axios.get('/users/' + id);
          const userDetail = response?.data?.data;

          if (userDetail) {
            setData(userDetail)
            setValue('name', userDetail?.name);
            setValue('email', userDetail?.email);
            setValue('memberId', userDetail?.memberId);
            setValue('status', userDetail?.status === 'active' ? 1 : 0);
            setValue('roleIds', userDetail?.roles?.map((i: any) => i.id));
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      }
      getRoleList(); // Assuming this is a function to fetch the role list
    };

    fetchData(); // Call the async function inside useEffect
  }, [id]); // Dependency array to trigger effect when `id` changes

  const getRoleList = () => {
    axios.get(`/roles`).then((r) => {
      setRoleData(r?.data?.data.items)
    }).catch((e) => { });
  }

  const schema: any = yup
    .object()
    .shape({
      name: yup.string().required('First name is a required field'),
      ...(isCreate
        ? {
          password: yup
            .string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters long")
            .matches(/[a-z]/, "Password must include at least one lowercase letter")
            .matches(/[A-Z]/, "Password must include at least one uppercase letter")
            .matches(/[0-9]/, "Password must include at least one number")
            .matches(/[@$!%*?&]/, "Password must include at least one special character"),
        }
        : {
          password: yup
            .string()
            .nullable()
            .transform((value) => (value === "" ? undefined : value))
            .notRequired()
            .test(
              "password-strength",
              "Password must be at least 8 characters, and include upper, lower, number and special character",
              (value) => {
                if (!value) return true; // empty = allowed
                return (
                  value.length >= 8 &&
                  /[a-z]/.test(value) &&
                  /[A-Z]/.test(value) &&
                  /[0-9]/.test(value) &&
                  /[@$!%*?&]/.test(value)
                );
              }
            ),
        }),
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
      status: yup
        .boolean()
        .transform((value, originalValue) => {
          if (originalValue === "") return undefined;
          return value;
        })
        .optional()
        .typeError("Status must be true or false"),

      memberId: yup
        .number()
        .typeError('Member ID must be a number')
        .nullable()
        .when('roleIds', (roleIds: any[], schema: any) => {
          const condition = [2, 3, 4, 5, 6];
          const relatedValueToCheck = roleIds?.[0];

          const hasIntersection = Array.isArray(relatedValueToCheck) && relatedValueToCheck.some((val: any) => condition.includes(val));
          if (hasIntersection) {
            return schema.required('Member is required when selecting any of the roles: Member, Agent, President, Signer, and Secretary');
          }
          return schema.optional();
        }),
      roleIds: yup.array().of(yup.number()).min(1, 'Please select at least one role').required('At least one role is required'),
    })
    .required();


  const { control, getValues, handleSubmit, formState: { errors }, setValue, setError }: any = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });



  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    data.status = (data.status == 'true' || data.status == true) ? 'active' : 'inactive'
    if (id) {
      console.log('data.status', data.status)
      data.user_id = id;
      axios.patch(`users/${id}`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/users');
        }
      }).catch((e) => {
        if (e?.response.status === 422) {
          setError('memberId', {
            type: "manual",
            message: 'aasd',
          })
          formFieldErrors(e, setError)
        }
        setLoading(false)
      });
    } else {
      axios.post('users/store', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/users');
        } else {
          notification.error({
            message: 'Error',
            description: 'Something went wrong',
            duration: 5,
          });
        }
      }).catch((e) => {
        console.log('e?.response?.status', e?.response?.status)
        if (e?.response?.status == 422) {
          formFieldErrors(e, setError)
        }
      }
      ).finally(() => {
        setLoading(false);
      });
    }

  }


  const breadCrumbList: any = [
    {
      href: '/',
      title: (
        <>
          <HomeOutlined />
          <span>Dashboard</span>
        </>
      ),
    },
    {
      href: '/users',
      title: 'User',
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];


  return (
    <>
      {!hideBanner && <Banner breadCrumb={breadCrumbList} title={id ? 'Edit User' : "Create User"} data={data} />}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={12}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12}>
                    <InputField
                      label="Name"
                      fieldName="name"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Name",
                        size: "large",
                        autoComplete: "new-name"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <InputField
                      label="Email"
                      fieldName="email"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Email",
                        size: "large",
                        autoComplete: "new-email"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <InputPassword
                      label="Password"
                      fieldName="password"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Password",
                        size: "large",
                        autoComplete: "new-password"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <SelectField
                      label="Roles"
                      fieldName="roleIds"
                      control={control}
                      iProps={{
                        placeholder: "Select Role",
                        size: "large",
                        loading: !(roleData.length > 0),
                        mode: "multiple"
                      }}
                      options={
                        roleData.map((item: any) => {
                          return { value: item.id, label: item.name }
                        })
                      }
                      errors={errors}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={5} lg={4}>
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
                  <Col xs={24} sm={24} md={12}>
                    <MemberSelectField
                      label="Member"
                      fieldName="memberId"
                      control={control}
                      errors={errors}
                    />
                  </Col>


                  <Col span={24}>
                    <div style={{ textAlign: 'right' }}>
                      <Space size="small">
                        <Button type="primary" size='large' htmlType="submit" loading={loading}>
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

export default CreateOrEdit;
