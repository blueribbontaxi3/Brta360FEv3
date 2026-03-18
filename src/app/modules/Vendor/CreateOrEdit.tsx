import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification } from 'antd';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import { AddressComponent } from 'app/molecules/AddressComponent';
import { formFieldErrors } from 'utils/helper';
import { InputField, MaskInputField, SwitchField, TextAreaField } from '@atoms/FormElement';

const VendorCreateOrEditPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData]: any = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchVendorData = async () => {
                setLoading(true);

                try {
                    const response = await axios.get(`/vendor/${id}`);
                    const vendorData = response.data.data;

                    if (vendorData) {
                        setData(vendorData.vendor);
                        Object.keys(vendorData.vendor).forEach((key) => {
                            setValue(key, vendorData.vendor[key]);
                        });
                        setValue('status', vendorData.vendor.status?.toLowerCase() === 'active');
                    }
                } catch (error: any) {
                    if (error.status === 403) {
                        navigate('/403');
                    }
                    console.error('Error fetching vendor data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchVendorData();
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
            title: <Link to="/vendors">Vendors</Link>,
        },
        {
            title: id ? 'Edit' : 'Create',
        },
    ];

    const validationSchema = yup.object().shape({
        name: yup.string().required('Name is a required field'),
        email: yup.string().email('Invalid email format').required('Email is a required field'),
        phone: yup
            .string()
            .required('Phone Number is a required field')
            .matches(/^\(\d{3}\)-\d{3}-\d{4}$/, 'Phone Number must be in the format (999)-999-9999'),
        company: yup.string().optional(),
        address: yup.string().optional(),
        notes: yup.string().optional(),
        status: yup
            .boolean()
            .transform((value, originalValue) => {
                if (originalValue === '') return undefined;
                return value;
            })
            .optional()
            .typeError('Status must be true or false'),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    }: any = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    });

    const onSubmit: SubmitHandler<any> = async (data: any) => {
        setLoading(true);
        data.status = data.status === 'true' || data.status === true ? 'active' : 'inactive';

        if (id) {
            axios
                .post(`vendor/${id}`, data)
                .then((r) => {
                    setLoading(false);
                    if (r.data.status === 1) {
                        notification.success({
                            message: 'Success',
                            description: r.data.message,
                            duration: 5,
                        });
                        navigate('/vendors');
                    }
                })
                .catch((e) => {
                    formFieldErrors(e, setError);
                    setLoading(false);
                });
        } else {
            axios
                .post('vendor/store', data)
                .then((r) => {
                    setLoading(false);
                    if (r?.data?.status === 1) {
                        notification.success({
                            message: 'Success',
                            description: r.data.message,
                            duration: 5,
                        });
                        navigate('/vendors');
                    } else {
                        notification.error({
                            message: 'Error',
                            description: 'Something went wrong',
                            duration: 5,
                        });
                    }
                })
                .catch((e) => {
                    formFieldErrors(e, setError);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Vendor' : 'Create Vendor'} data={data} />
            <Spin spinning={loading}>
                <Row gutter={[16, 16]} justify={'center'} align={'middle'}>
                    <Col span={24}>
                        <Card>
                            <Form name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                                        <InputField
                                            label="Name"
                                            fieldName="name"
                                            control={control}
                                            iProps={{
                                                placeholder: 'Vendor Name',
                                                size: 'large',
                                            }}
                                            errors={errors}
                                        />
                                    </Col>

                                    <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                                        <InputField
                                            label="Email"
                                            fieldName="email"
                                            control={control}
                                            iProps={{
                                                placeholder: 'Email Address',
                                                size: 'large',
                                            }}
                                            errors={errors}
                                        />
                                    </Col>

                                    <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                                        <MaskInputField
                                            label="Phone Number"
                                            fieldName="phone"
                                            control={control}
                                            iProps={{
                                                placeholder: 'Phone Number',
                                                size: 'large',
                                                mask: 'phone',
                                            }}
                                            errors={errors}
                                        />
                                    </Col>

                                    <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                                        <InputField
                                            label="Company"
                                            fieldName="company"
                                            control={control}
                                            iProps={{
                                                placeholder: 'Company Name',
                                                size: 'large',
                                            }}
                                            errors={errors}
                                        />
                                    </Col>

                                    <AddressComponent control={control} setValue={setValue} errors={errors} />

                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <TextAreaField
                                            label="Notes"
                                            fieldName="notes"
                                            control={control}
                                            initValue=""
                                            iProps={{
                                                placeholder: 'Additional notes about the vendor',
                                                size: 'large',
                                                autoSize: { minRows: 3, maxRows: 6 },
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
                                                checkedChildren: 'Active',
                                                unCheckedChildren: 'Inactive',
                                            }}
                                            errors={errors}
                                        />
                                    </Col>

                                    <Col span={24}>
                                        <div style={{ textAlign: 'right' }}>
                                            <Space size="small">
                                                <Button type="primary" size="large" htmlType="submit">
                                                    {id ? 'Update' : 'Create'}
                                                </Button>
                                                <Button size="large" onClick={() => navigate('/vendors')}>
                                                    Cancel
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

export default VendorCreateOrEditPage;
