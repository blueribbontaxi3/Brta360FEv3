import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Divider, Button, message, Form, Flex, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { theme } from 'antd';
import Logo from '../../../../assets/logo.png'; // Replace with your actual logo path
import AuthLayoutImage from '../../../../assets/authLayoutImage.png';
import GoogleIcon from '../../../../assets/google.svg?react';
import { InputField, InputPassword } from '@atoms/FormElement';
import { userLoginService } from 'app/pages/duck/login/ducks/services';
import { GoogleLogin } from '@react-oauth/google';
import MicrosoftIcon from '../../../../assets/microsoft.svg?react';
import MediaQuery from 'react-responsive';
import { useMediaQuery } from 'react-responsive';
import axiosService from "utils/axiosInceptor";

const { useToken } = theme;
const { Text, Link: AntLink } = Typography;

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { token } = useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    email: yup.string().email().required('Email is a required field'),
    password: yup.string().required('Password is a required field'),
  }).required();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(schema),
  });

  const authUser = useSelector((state: any) => state?.user_login?.auth_user);

  useEffect(() => {
    if (authUser?.status === 1) {
      const { data: { access_token, user }, message } = authUser;
      if (access_token) {
        localStorage.setItem('brta360_admin', access_token);
        localStorage.setItem('brta360_user', JSON.stringify(user));
        window.location.href = '/dashboard';
      } else {
        messageApi.open({ type: 'error', content: message });
      }
    } else {
      setIsLoading(false);
    }
  }, [authUser, messageApi]);

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setIsLoading(true);
    dispatch(userLoginService(data));
  };
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const is1025 = useMediaQuery({ query: '(max-width: 1025px)' })


  // const login = useGoogleLogin({
  //   flow: 'auth-code',
  //   onSuccess: async (credentialResponse: any) => {
  //     console.log("Google Login Success:", credentialResponse);

  //     // credentialResponse.credential is the ID token
  //     const data: any = await axiosService.post(`/auth/google`, {
  //       token: credentialResponse.credential, // send ID token
  //     });

  //     console.log("Backend Response:", data);

  //     if (data?.accessToken) {
  //       localStorage.setItem("brta360_admin", data.accessToken);
  //       localStorage.setItem("brta360_user", JSON.stringify(data.user));
  //       window.location.href = "/dashboard";
  //     }
  //   },
  //   onError: () => {
  //     console.error("Login Failed");
  //   },
  // });


  return (
    <div style={{
      height: '100vh',
      display: 'flex',
    }}>
      {contextHolder}
      <Row style={{ flex: 1, height: '100%' }}>
        {/* Left column with image */}
        <MediaQuery minWidth={769}>

          <Col
            xl={12}
            lg={10}
            md={24}
            sm={24}
            xs={24}
            style={{
              backgroundColor: '#f0f2f5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={AuthLayoutImage}
              alt="AuthLayoutImage"
              style={{
                width: '100%',
                height: "100vh",
                objectFit: 'cover'
              }}
            />
          </Col>
        </MediaQuery>

        {/* Right column with form */}
        <Col
          xl={12}
          lg={14}
          md={24}
          sm={24}
          xs={24}
          style={{
            padding: !(isMobile || is1025) ? '50px' : '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            style={{
              maxWidth: (isMobile || is1025) ? '100%' : '80%',
              width: (isMobile || is1025) ? '100%' : '70%',
              margin: '0 auto',
              padding: '20px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Add subtle shadow for modern look
              borderRadius: '8px', // Rounded corners
              backgroundColor: '#ffffff', // Clean white background
            }}
            autoComplete='off'
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: '200px',
                  height: 'auto',
                  marginBottom: '10px',
                }}
              />
              <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Welcome Back</h2>
              <p style={{ color: '#888', fontSize: '14px' }}>
                Please enter your credentials to access your account.
              </p>
            </div>

            <InputField
              label="Email"
              fieldName="email"
              control={control}
              iProps={{
                placeholder: 'Enter your email',
                size: 'large',
                style: { borderRadius: '8px' }, // Rounded input
                autoComplete: 'off'
              }}
              errors={errors}
            />

            <InputPassword
              label="Password"
              fieldName="password"
              control={control}
              iProps={{
                placeholder: 'Enter your password',
                size: 'large',
                style: { borderRadius: '8px' },
                autoComplete: 'off'
              }}
              validate={errors.password ? 'error' : undefined}
              validMessage={errors.password?.message}
            />

            <div style={{ textAlign: 'right', margin: '10px 0' }}>
              <Link to="/forgot-password" style={{ color: token.colorPrimary, fontSize: '14px' }}>
                Forgot Password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                size='large'
              >
                Login
              </Button>
              <Divider>or</Divider>
              <Row
                gutter={16}
              >
                {/* First Button - 50% Width */}
                <Col span={24} xs={24} md={24} xxl={24} xl={24} style={{ display: 'flex', justifyContent: 'center' }}>
                  {/* <Button
                    block
                    size='large'
                    onClick={() => login()}
                    icon={<GoogleIcon />}
                  >
                    
                  </Button> */}

                  <GoogleLogin
                    width={'100%'}
                    size={'large'}
                    text={'signin_with'}
                    onSuccess={async (credentialResponse: any) => {
                      const data: any = await axiosService.post(`/auth/google`, {
                        token: credentialResponse.credential,
                        authType: 'login'
                      }).then((response) => {

                        let user = response?.data?.data;
                        console.log("Google Login Success:", user);
                        if (user) {
                          localStorage.setItem("brta360_admin", user.accessToken);
                          localStorage.setItem("brta360_user", JSON.stringify(user.user));
                          window.location.href = "/dashboard";
                        }
                      }).catch((error) => {
                        console.error("Login Failed:", error?.response?.data?.message);
                      });

                    }}
                    onError={() => {
                      console.error("Login Failed");
                    }}
                  />

                </Col>
                {/* <Col span={24} xs={24} md={12} xxl={12} xl={12}>
                  <Button
                    block
                    size='large'
                    onClick={() => login()}
                    icon={<MicrosoftIcon />}
                  >
                    Sign in with Microsoft
                  </Button>
                </Col> */}
              </Row>

              <Divider />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Text style={{ fontSize: '14px', color: '#888' }}>
                  Don’t have an account?{' '}
                  <AntLink href="/register" style={{ color: token.colorPrimary, fontWeight: '500' }}>
                    Register Now!
                  </AntLink>
                </Text>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
