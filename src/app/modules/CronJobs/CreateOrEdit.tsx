import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Space, Spin, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InputField, InputPassword, SelectField } from '../../atoms/FormElement';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { capitalizeFirstWord, formFieldErrors, getStatuses } from '../../../utils/helper';
import ImageUpload from '../../molecules/Image/ImageUpload';

const CreateOrEdit = ({ isModalOpen, setIsModalOpen,id }: any) => {

  const [loading, setLoading] = useState<any>(false);
  const [imageUrl, setImageUrl] = useState<any>(null);
  const navigate = useNavigate();

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
      title: (<Link to="/users">Users</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  const schema = yup
    .object()
    .shape({
      name: yup.string().required('Name  is a required field'),
      // status: yup.string().required('Status  is a required field'),
    })
    .required();

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError,reset }: any = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)
    if (id) {
      axios.patch(`amenities/${id}`, data, {
        withCredentials: true
      }).then((r) => {
        setLoading(false)
        if (r.data.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          handleClose();
        }
      }).catch((e) => {
        if (e?.response.status === 422) {
          formFieldErrors(e,setError)
        }
        setLoading(false)
      });
    } else {
      axios.post('amenities', data).then((r) => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        if (r?.data?.status === 1) {
          notification.success({
            message: 'Success',
            description: r.data.message,
            duration: 5,
          });
          handleClose();
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
  useEffect(() => {
    if (id) {
      setLoading(true)
      axios.get('/users/' + id).then((e: any) => {
        const userDetail = e?.data?.data;
        if (userDetail) {
          setValue('name', userDetail?.name)
          setImageUrl(userDetail?.image)
          setValue('status', userDetail?.status)
        }
        setLoading(false)

      }).catch(() => { })
    }
  }, [id])
  useEffect(()=>{
    reset()
  },[isModalOpen])
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal title={id ? 'Edit Amenity' : 'Create Amenity'} open={isModalOpen} onCancel={handleClose} centered footer={null}>
        <Spin spinning={loading}>
          <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)} className='custom-modal-form'>
            <Row gutter={16}>
              <Col span={24}>
                <ImageUpload
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                />
              </Col>
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
                {/* <SelectField
                  label="Status"
                  fieldName="status"
                  control={control}
                  iProps={{
                    placeholder: "Status",
                    size: "large",
                    // prefix: <UserOutlined className="site-form-item-icon" />,
                  }}
                  options={getStatuses()}
                  errors={errors}
                /> */}
              </Col>
              <Col span={24}>
                <div style={{ textAlign: 'right' }}>
                  <Space size="small">
                    <Button size='large' onClick={(e:any)=>handleClose()} style={{marginRight:'1rem'}}>
                      Cancel
                    </Button>
                  </Space>
                  <Space size="small">
                    <Button type="primary" size='large' htmlType="submit" loading={loading}>
                      {id ? 'Update' : 'Create'}
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default CreateOrEdit;
