import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Divider, Button, message, Form, Flex, Typography, notification, Progress } from 'antd';
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
import MediaQuery from 'react-responsive';
import { useMediaQuery } from 'react-responsive';
import axiosService from "utils/axiosInceptor";
import { formFieldErrors } from 'utils/helper';
import zxcvbn from 'zxcvbn';

const { useToken } = theme;
const { Text, Link: AntLink } = Typography;

interface LoginFormInputs {
  email: string;
  password: string;
  name: string;
  confirm_password: string;
}

const Register: React.FC = () => {
  const { token } = useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState<{ score: number, feedback: string }>({
    score: 0,
    feedback: ''
  });

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
        return { label: 'Too Weak', color: 'red' };
      case 1:
        return { label: 'Weak', color: '#ff4d4f' };
      case 2:
        return { label: 'Fair', color: '#faad14' };
      case 3:
        return { label: 'Good', color: '#52c41a' };
      case 4:
        return { label: 'Strong', color: '#1677ff' };
      default:
        return { label: '', color: '' };
    }
  };



  const schema: any = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long')
      .max(20, 'Password must not exceed 20 characters'),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('password')], 'Confirm Password must match the Password')
      .required('Confirm Password is required'),
  }).required();


  const { control, handleSubmit, formState: { errors }, setError, setValue } = useForm<LoginFormInputs>({
    defaultValues: { email: '', password: '', name: '', confirm_password: '' },
    resolver: yupResolver(schema),
  });


  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setIsLoading(true);
    setIsLoading(true)
    axiosService.post('auth/register', data).then((r) => {
      setIsLoading(false)
      if (r?.data?.status === 1) {
        let user = r?.data?.data?.user;

        notification.success({
          message: 'Success',
          description: user?.message,
          duration: 5,
        });

        navigate(`/otp-verify/${user?.token}`);

      } else {
        notification.error({
          message: 'Error',
          description: 'Something went wrong',
          duration: 5,
        });
      }
    }).catch((e) => {
      if (e?.response?.status == 422) {
        formFieldErrors(e, setError)
      }
    }
    ).finally(() => {
      setIsLoading(false);
    });
  };
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const is1025 = useMediaQuery({ query: '(max-width: 1025px)' })

  useEffect(() => {
    console.log('errprs', errors)
  }, [errors])


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
              maxWidth: (isMobile || is1025) ? '100%' : '90%',
              width: (isMobile || is1025) ? '100%' : '80%',
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
              <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Register Account</h2>
            </div>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <InputField
                  label="Name"
                  fieldName="name"
                  control={control}
                  iProps={{
                    placeholder: 'Enter your name',
                    size: 'large',
                    style: { borderRadius: 8 },
                    autoComplete: 'off',
                  }}
                  errors={errors}
                />

              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>

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
              </Col>

            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <InputPassword
                  label="Password"
                  fieldName="password"
                  control={control}
                  iProps={{
                    placeholder: 'Enter your password',
                    size: 'large',
                    style: { borderRadius: 8 },
                    autoComplete: 'off',
                    onChange: (e: any) => {
                      const val = e.target.value;
                      const result = zxcvbn(val);
                      setPasswordStrength({
                        score: result.score,
                        feedback: result.feedback.suggestions?.[0] || '',
                      });
                      setValue('password', val); // Update the form value
                    }
                  }}
                  errors={errors}
                />
                {passwordStrength.score > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <Progress
                      percent={(passwordStrength.score + 1) * 20}
                      showInfo={false}
                      strokeColor={getStrengthLabel(passwordStrength.score).color}
                    />
                    <Text type="secondary" style={{ color: getStrengthLabel(passwordStrength.score).color }}>
                      {getStrengthLabel(passwordStrength.score).label}
                    </Text>
                  </div>
                )}
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <InputPassword
                  label="Confirm Password"
                  fieldName="confirm_password"
                  control={control}
                  iProps={{
                    placeholder: 'Confirm your password',
                    size: 'large',
                    style: { borderRadius: 8 },
                    autoComplete: 'off',
                  }}
                  errors={errors}

                />
              </Col>

            </Row>

            {/* <div style={{ textAlign: 'right', margin: '10px 0' }}>
              <Link to="/forgot-password" style={{ color: token.colorPrimary, fontSize: '14px' }}>
                Forgot Password?
              </Link>
            </div> */}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                size='large'
              >
                Register
              </Button>
              <Divider>or</Divider>
              <Row
                gutter={16}
              >
                {/* First Button - 50% Width */}
                <Col span={24} xs={24} md={24} xxl={24} xl={24}>
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
                        authType: 'register'
                      }).then((response) => {

                        let user = response?.data?.data;
                        console.log("user", user);
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
                  Already account?{' '}
                  <AntLink href="/login" style={{ color: token.colorPrimary, fontWeight: '500' }}>
                    Login Now!
                  </AntLink>
                </Text>
              </div>
            </Form.Item>
          </Form>
        </Col >
      </Row >
    </div >
  );
};

export default Register;
