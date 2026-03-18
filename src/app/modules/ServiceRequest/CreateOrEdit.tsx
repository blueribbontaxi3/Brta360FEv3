import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InputField, InputPassword, SelectField, TextAreaField } from '../../atoms/FormElement';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { capitalizeFirstWord, formFieldErrors, getServiceRequestStatuses, getStatuses} from '../../../utils/helper';
import ImageUpload from '../../molecules/Image/ImageUpload';

const CreateOrEdit = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();
  let { id } = useParams();
  const [fileList, setFileList] = useState<any>([]);
  useEffect(() => {
    if (id) {
      setLoading(true)
      axios.get('/service-requests/' + id).then((e: any) => {
        const data = e?.data?.data;
        if(data){
          setValue('category_id', data?.category_id)
          setValue('description', data?.description)
          setValue('status', data?.status)
          setFileList(data?.media)
        }
        setLoading(false)

      }).catch(() => { })

    }
    getCategoryList();
  }, [id])

  const getCategoryList = () => {
    // axios.get(`/roles`, {
    //   params: {
    //     pageSize: -1,
    //     current: 10000,
    //   }
    // }).then((r) => {
    //   setCategoryData(r?.data?.data?.data)
    // }).catch((e) => { });
  }

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
      title: (<Link to="/service-requests">Service Requests</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  const schema = yup
    .object()
    .shape({
      // status: yup.string().required('Status  is a required field'),
    })
    .required();

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError }: any = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    if (id) {
      const {status} = data;
      axios.patch(`service-requests/${id}`, {
        status
      }).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/service-requests');
        }
      }).catch((e) => {
        if (e?.response.status === 422) {
          formFieldErrors(e,setError)
        }
        setLoading(false)
      });
    } else {
      axios.post('service-requests', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          navigate('/service-requests');
        } else {
          notification.error({
            message: 'Error',
            description: 'Something went wrong',
            duration: 5,
          });
        }
      }).catch((e) => {
        if (e?.response?.status == 422) {
          formFieldErrors(e,setError)
        } 
      }
      ).finally(() => {
        setLoading(false);
      });
    }

  }

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Service Request' : "Create Service Request"} />
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
          <Col span={12}>
            <Card>
              <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                <Row gutter={16}>
                  <Col span={24} style={{marginBottom:'1rem'}}>
                    <ImageUpload 
                    title={'Gallery'} 
                    fileType={'jpg,png,jpeg,webp,svg,svg+xml'} 
                    multiple={true}
                    fileList={fileList}
                    setFileList={setFileList}
                    />
                  </Col>

                  <Col span={12}>
                    <SelectField
                      label="Category"
                      fieldName="category_id"
                      control={control}
                      iProps={{
                        placeholder: "Category",
                        size: "large",
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      options={getCategoryList()}
                      errors={errors}
                    />
                  </Col>
                  <Col span={12}>
                    {/* <SelectField
                      label="Status"
                      fieldName="status"
                      control={control}
                      iProps={{
                        placeholder: "Status",
                        size: "large",
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
                      options={getServiceRequestStatuses()}
                      errors={errors}
                    /> */}
                  </Col>
                  <Col span={24}>
                    <TextAreaField
                      label="Description"
                      fieldName="description"
                      control={control}
                      initValue=""
                      iProps={{
                        placeholder: "Description",
                        size: "large",
                        // prefix: <UserOutlined className="site-form-item-icon" />,
                      }}
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
