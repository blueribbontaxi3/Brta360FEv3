import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Space, Spin, notification } from 'antd';
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





const OfficerCreateOrEdit = (props: any) => {

    const { modalTitle, open, setOpen, corporationGetValues, setMemberUserData, memberUserData, officerSelectValue, setOfficerSelectValue }: any = props;
    const [loading, setLoading] = useState(false);
    const [roleData, setRoleData] = useState([]);
    const [data, setData] = useState(null);
    const navigate = useNavigate();




    useEffect(() => {
        return () => {
            setMemberUserData([])
            setOfficerSelectValue(null)
        };
    }, []);

    const getMemberUser = async () => {
        const response = await axios.get(`/users/`, {
            params: {
                member_id: corporationGetValues('memberId'),
                page: 'corporation',
                role_ids: [3, 4, 5, 6],
            }
        });
        const itemData = response?.data?.data?.items;
        setMemberUserData(itemData)
        return itemData;
    }

    useEffect(() => {
        getRoleList(); // Assuming this is a function to fetch the role list

        if (officerSelectValue?.[0]?.includes('edit')) {
            // getMemberUser()
            const fetchData = async () => {
                if (officerSelectValue) {
                    const [label, id] = officerSelectValue;
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
                                setValue(
                                    'roleIds',
                                    userDetail?.roles
                                        ?.filter((role: any) => [3, 4, 5, 6].includes(role.id)) // Filter only roles with specified IDs
                                        .map((role: any) => role.id) // Map the filtered roles to their IDs
                                );
                            }
                        } catch (error) {
                            console.error('Error fetching user details:', error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            };

            fetchData(); // Call the async function inside useEffect
        } else {
            reset()
            setOfficerSelectValue(null)
        }
    }, [officerSelectValue]); // Dependency array to trigger effect when `id` changes

    const getRoleList = async () => {
        setRoleData([])
        axios.get(`/roles`, {
            params: {
                ids: [3, 4, 5, 6]
            }
        }).then((r) => {
            setRoleData(r?.data?.data.items)
        }).catch((e) => { });
    }

    const schema: any = yup
        .object()
        .shape({
            name: yup.string().required('First name is a required field'),
            email: yup.string().email().required('Email is a required field'),
            roleIds: yup.array().of(yup.number()).min(1, 'You must select at least one role.').required('Roles are required'),
        })
        .required();


    const { control, getValues, handleSubmit, reset, formState: { errors }, setValue, setError }: any = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            roleIds: [], // Default value for the select field
        }
    });


    const onSubmit: SubmitHandler<any> = async (data: any) => {
        setLoading(true)
        data.memberId = corporationGetValues('memberId')
        data.status = 'active'
        let id: any = officerSelectValue?.[1]
        if (id) {
            await axios.patch(`users/${id}`, data).then(async (r) => {
                setLoading(false)
                if (r.data.status === 1) {
                    notification.success({
                        message: 'Success',
                        description: r.data.message,
                        duration: 5,
                    });
                    getMemberUser();
                    reset()
                    setValue('roleIds', []);
                    setOpen(false)

                }
            }).catch((e) => {
                if (e?.response.status === 422) {
                    formFieldErrors(e, setError)
                }
                setLoading(false)
            });
        } else {
            await axios.post('users/store', data).then((r) => {
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
                if (r?.data?.status === 1) {
                    notification.success({
                        message: 'Success',
                        description: r.data.message,
                        duration: 5,
                    });
                    getMemberUser();
                    setValue('roleIds', []);
                    reset()
                    setOpen(false)
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
                setLoading(false);
            });
        }

    }

    return (
        <Modal
            title={modalTitle}
            centered
            open={open}
            onOk={handleSubmit(onSubmit)}
            onCancel={() => setOpen(false)}
            maskClosable={false}
            okText={"Save"}
        >
            <Spin spinning={loading}>
                <Row gutter={[16, 16]} justify={'center'} align={"middle"}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Card>
                            <Form name="officerCreateEditForm" layout="vertical" autoComplete="off" >
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24}>
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
                                    <Col xs={24} sm={24} md={24}>
                                        <SelectField
                                            label="Roles"
                                            fieldName="roleIds"
                                            control={control}
                                            iProps={{
                                                placeholder: "Select Role",
                                                size: "large",
                                                loading: !(roleData.length > 0),
                                                mode: "multiple",
                                                defaultValue: []
                                            }}
                                            options={
                                                roleData.map((item: any) => {
                                                    return { value: item.id, label: item.name }
                                                })
                                            }
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col xs={24} sm={24} md={24}>
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
                                    {/* <Col xs={24} sm={24} md={12}>
                                        <InputPassword
                                            label="Password"
                                            fieldName="password"
                                            control={control}
                                            initValue=""
                                            iProps={{
                                                placeholder: "Password",
                                                size: "large",
                                                // prefix: <UserOutlined className="site-form-item-icon" />,
                                            }}
                                            errors={errors}
                                        />
                                    </Col> */}

                                </Row>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </Modal>

    );
};

export default OfficerCreateOrEdit;
