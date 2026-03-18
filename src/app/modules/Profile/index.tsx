import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, Typography, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { useDispatch, useSelector } from 'react-redux';
import { formFieldErrors } from 'utils/helper';
import { InputField, InputPassword } from '@atoms/FormElement';
import Banner from '@molecules/Banner';
import ImageUpload from '@molecules/Image/ImageUpload';
import MediaCard from '@pages/MediaManager/MediaCard';
const { Text, Title } = Typography;

const Profile = (props: any) => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const auth: any = useSelector(
    (state: any) => state?.user_login?.auth_user?.data
  );
  const [image, setImage] = useState<any>(null);


  useEffect(() => {
    if (auth) {
      setValue('name', auth?.user?.name)
      setValue('email', auth?.user?.email)
      setImage(auth?.media?.[0])
    }
  }, [auth])


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
      title: 'Profile',
    }
  ];

  const schema = yup
    .object()
    .shape({
      name: yup.string().required('Name is a required field'),
    })
    .required();

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError }: any = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
   
    axios.post(`auth/profile`, data).then((r) => {
      setLoading(false)
      if (r?.data?.status === 1) {
        notification.success({
          message: 'Success',
          description: r.data.message,
          duration: 5,
        });
        dispatch({
          type: 'LOGIN_USER',
          data: r.data,
        })
        localStorage.setItem('brta360_user', JSON.stringify(r.data?.data));
        setValue('password', '')
      }
    }).catch((e: any) => {
      if (e?.response?.status === 422) {
        formFieldErrors(e, setError)
      }
      setLoading(false)
    });
  }

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={auth?.user?.name} data={auth?.user} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} >
          <Col xs={24} sm={12} md={8}>
            <Card>
              {/* Profile Image Upload */}
              <Row gutter={[16, 16]} justify="center" align="middle">
                <Col span={24} style={{ textAlign: 'center' }}>
                  <MediaCard
                    name="avatar"
                    buttonText="Upload Avatar"
                    allowedTypes={"images"}
                    media_relations={auth?.user?.media_relations}
                    onChange={(media: any) => {
                      setValue('avatar', media)
                    }}
                  />
                </Col>
              </Row>

              {/* Profile Details */}
              <Row gutter={[16, 16]} justify="start" style={{ marginTop: '20px' }}>
                <Col span={24}>
                  <ul className="profile-detail-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    <li style={{ marginBottom: '12px' }}>
                      <Space>
                        <Title level={5} style={{ margin: 0 }}>Name:</Title>
                        <Text>{auth?.user?.name}</Text>
                      </Space>
                    </li>
                    <li style={{ marginBottom: '12px' }}>
                      <Space>
                        <Title level={5} style={{ margin: 0 }}>Email:</Title>
                        <Text>{auth?.user?.email}</Text>
                      </Space>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={15}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                  <Col span={12}>
                    <InputField
                      label="Name"
                      fieldName="name"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Name",
                        size: "large",
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={12}>
                    <InputField
                      label="Email"
                      fieldName="email"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Email",
                        size: "large",
                        autoComplete: "email",
                        readOnly: true
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={12}>
                    <InputPassword
                      label="Password"
                      fieldName="password"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Password",
                        size: "large",
                        autoComplete:'new-password'
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      validate={errors?.password && "error"}
                      validMessage={errors?.password && errors?.password?.message}
                    />
                  </Col>

                  <Col span={24}>
                    <div style={{ textAlign: 'right' }}>
                      <Space size="small">
                        <Button type="primary" size='large' htmlType="submit" loading={loading}>
                          {'Update'}
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

export default Profile;
