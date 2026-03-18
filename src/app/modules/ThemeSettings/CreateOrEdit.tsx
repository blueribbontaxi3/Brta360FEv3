import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InputField, InputPassword, SelectField } from '../../atoms/FormElement';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { capitalizeFirstWord, formFieldErrors, getStatuses} from '../../../utils/helper';


const CreateOrEdit = (props: any) => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
   
      setLoading(true)
      axios.get('/theme-settings').then((e: any) => {
        const themeSettingDetail = e?.data?.data;
       
        if(themeSettingDetail){
        themeSettingDetail.map((item:any,i:number)=>{
          setValue(item.key,item.value)
        })

         
        }
        setLoading(false)

      }).catch(() => { })
   
 
  }, [])



  const breadCrumbList: any = [
    {
      title: (
        <>
          <Link to="/">
            <HomeOutlined />
            <span>Dashboard</span>
          </Link>
        </>
      ),
    },
    {
      title: (<Link to="/theme-settings">Theme Settings</Link>),
    }
  ];

  const schema = yup
    .object()
    .shape({
      phone_number: yup.string().required('Phonenumber  is a required field'),
      email: yup.string().email().required('Email is a required field'),
      insta_url: yup.string().required('Instagram URL is a required field'),
      linkedin_url: yup.string().required('Linkedin URL is a required field'),
      fb_url: yup.string().required('Facebook URL is a required field')
    })
    .required();

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError }: any = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)

      axios.post(`theme-settings`, data).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/theme-settings');
        }
      }).catch((e) => {
        if (e?.response.status === 422) {
          formFieldErrors(e,setError)
        }
        setLoading(false)
      });
   

  }



  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={"Theme Settings"} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={24}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                  
                  <Col span={12}>
                    <InputField
                      label="Call Us (Phone Number)"
                      fieldName="phone_number"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Phone Number",
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
                        autoComplete: "email"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                
                  <Col span={12}>
                    <InputField
                      label="Facebook URL"
                      fieldName="fb_url"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Facebook URL",
                        size: "large",
                        autoComplete: "fb_url"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={12}>
                    <InputField
                      label="Instagram URL"
                      fieldName="insta_url"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Instagram URL",
                        size: "large",
                        autoComplete: "insta_url"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={12}>
                    <InputField
                      label="Linkedin URL"
                      fieldName="linkedin_url"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Linkedin URL",
                        size: "large",
                        autoComplete: "linkedin_url"
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      errors={errors}
                    />
                  </Col>
                  <Col span={24}>
                    <div style={{ textAlign: 'right' }}>
                      <Space size="small">
                        <Button type="primary" size='large' htmlType="submit" loading={loading}>
                          {'Save'}
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
