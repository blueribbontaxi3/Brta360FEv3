import React, { useEffect, useState } from "react";
import {
    Modal,
    Form,
    Checkbox,
    Select,
    Upload,
    Button,
    Typography,
    Space,
    Descriptions,
    Divider,
    Tag,
    Flex,
    Row,
    Col,
    notification,
    Spin,
} from "antd";
import { UploadOutlined, RetweetOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { InputCheckbox, TextAreaField } from "@atoms/FormElement";
import CorporationSelectField from "@atoms/CorporationSelectField";
import MediaCard from "@pages/MediaManager/MediaCard";
import { formFieldErrors } from "../../../utils/helper";
import axios from '../../../utils/axiosInceptor'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const { Option } = Select;
const { Title, Text } = Typography;

const InfoTag = ({ text, status }: any) => (
    <Tag color={status === 'inactive' || status === 'surrender' ? 'red' : 'green'}>{text}</Tag>
);

const SectionTitle = ({ title }: any) => (
    <Divider orientation="left" orientationMargin="0">
        <Text strong style={{ fontSize: 16 }}>{title}</Text>
    </Divider>
);

const MedallionTransferModal = ({
    visible,
    setMedallionDataModal,
    onOk,
    corporations,
    data,
}: any) => {


    const [loading, setLoading]: any = useState(false)


    const schema = yup.object().shape({
        isSold: yup.boolean().required(),

        reason: yup.string()
            .nullable()
            .when('isSold', {
                is: true,
                then: schema => schema.required('Reason is required'),
                otherwise: schema => schema.notRequired()
            }),

        newCorporationId: yup.number()
            .nullable()
            .when('isSold', {
                is: false,
                then: schema => schema.required('New Corporation is required'),
                otherwise: schema => schema.notRequired()
            }),

        medallionNumber: yup.number()
            .required('Medallion Number is required'),

        transferDocument: yup.number()
            .nullable()
            .when('isSold', {
                is: false,
                then: schema => schema.required('Transfer Document is required'),
                otherwise: schema => schema.notRequired()
            }),
    });

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        getValues,
    }: any = useForm({
        mode: "all",
        resolver: yupResolver(schema),
    });





    const medallion = data;
    const corp = data?.corporation;
    const vehicle = data?.vehicle;
    const insurance = data?.insurances?.[0];

    useEffect(() => {
        console.log("errors", errors);
    }, [errors]);

    useEffect(() => {
        setValue('oldCorporationId', data?.corporationId)
        setValue('medallionNumber', data?.medallionNumber)
        setValue('reason', null)
        setValue('newCorporationId', null)
        setValue('isSold', false)
        setValue('transferDocument', null)
    }, [data])
    const handleTransfer = async (data: any) => {
        setLoading(true)
        axios.post('medallions/transfer', data).then((r) => {

            setLoading(false)

            if (r?.data?.status === 1) {
                notification.success({
                    message: 'Success',
                    description: r.data.message,
                    duration: 5,
                });
                setMedallionDataModal(false)


            } else {
                notification.error({
                    message: 'Error',
                    description: 'Something went wrong',
                    duration: 5,
                });
            }
        }).catch((e: any) => {
            formFieldErrors(e, setError)
        }
        ).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Modal
            open={visible}
            width={'70%'}
            onCancel={() => {
                setMedallionDataModal(false)
            }
            }
            maskClosable={false}
            onOk={handleSubmit(handleTransfer)}
            title={
                < Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={4} style={{ margin: 0 }}>🚖 Medallion Transfer Details</Title>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                        Transferring Medallion <Text strong>#{medallion?.medallionNumber}</Text>
                    </Text>
                </Space >
            }
            centered
        >
            <SectionTitle title="Corporation Details" />
            <Descriptions size="small" column={3}>
                <Descriptions.Item label="Corporation">
                    {corp?.corporationName}
                </Descriptions.Item>
                <Descriptions.Item label="Member Name">
                    {corp?.member?.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="File No.">
                    {corp?.fileNumber}
                </Descriptions.Item>
            </Descriptions>

            {
                vehicle && (
                    <>
                        <SectionTitle title="Vehicle Info" />
                        <Descriptions size="small" column={4}>
                            <Descriptions.Item label="Vehicle">
                                {vehicle?.vehicleYear?.year} {vehicle?.vehicleMake?.name} {vehicle?.vehicleModel?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Type">
                                {vehicle?.vehicleType?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="VIN">
                                {vehicle?.vinNumber}
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )
            }

            {
                insurance && (
                    <>
                        <SectionTitle title="Insurance Info" />
                        <Descriptions size="small" column={2}>
                            <Descriptions.Item label="Status">
                                <InfoTag text={insurance?.status} status={insurance?.status} />
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )
            }
            <SectionTitle title="Transfer Form" />

            <Spin spinning={loading}>
                <Form layout="vertical" onFinish={onOk}>
                    <InputCheckbox
                        label="Sold"
                        fieldName="isSold"
                        control={control}
                        errors={errors}
                    />

                    {(!watch('isSold')) ?
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={24} md={8}>
                                <CorporationSelectField
                                    key={`corporation-select-${visible}-${data?.corporation?.id}`} // ✅ Unique key on modal open
                                    label="Corporation"
                                    fieldName="newCorporationId"
                                    control={control}
                                    errors={errors}
                                    excludeIds={[data?.corporation?.id]}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12}>

                                <MediaCard
                                    media_relations={`corporation-select-${visible}-${data?.corporation?.id}`} // ✅ Unique key on modal open
                                    name="transferDocument"
                                    buttonText="Select Transfer Documentation"
                                    allowedTypes={"images"}
                                    previewSize={'200px'}
                                    onChange={(media: any) => {
                                        setValue('transferDocument', media)
                                    }}

                                />
                                <Text type="danger">
                                    {errors?.transferDocument && errors?.transferDocument?.message}
                                </Text>
                            </Col>
                        </Row>

                        :

                        <TextAreaField
                            label="Reason"
                            fieldName="reason"
                            control={control}
                            iProps={{
                                placeholder: "Write a reason",
                            }}
                            errors={errors}
                        />
                    }




                    {/* <Space
                    style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}
                >
                    <Button onClick={() => {
                        setMedallionDataModal(false)
                    }} danger disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" disabled={loading}>
                        OK
                    </Button>
                </Space> */}
                </Form>
            </Spin>


        </Modal >
    );
};

export default MedallionTransferModal;
