import React, { useEffect, useState, useMemo } from 'react';
import { DateField, InputRadio, SelectField } from '@atoms/FormElement';
import { Button, Col, Flex, Form, message, Modal, notification, Popconfirm, Row, Spin, Table } from 'antd';
import { calculateMonthlyData } from 'utils/paymentCalculator';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FinancialCard } from './FinancialCard';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useParams } from 'react-router-dom';
import axios from '../../../../../utils/axiosInceptor';
import { isEmpty } from 'lodash';
import { usdFormat } from 'utils/helper';
import { DeleteOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';

dayjs.extend(isSameOrAfter);

// Parent Component
const Collision: React.FC<any> = ({
    isCreate, control, errors, setValue,
    getValues, medallionNumberSingleData,
    watch, collisionCalculation, setCollisionCalculation,
    insuranceData, isInsured, collisionRatesData, isEdit, collisionLastData,
    collisionAllData, collisionSecondLastData

}) => {

    const isMedallionSingleData = !!medallionNumberSingleData?.id;
    const [modalVisible, setModalVisible] = useState(false);
    const [action, setAction] = useState<string | null>(null);
    const [selectFieldDisabled, setSelectFieldDisabled] = useState(true);
    // Recalculate options whenever 'collision' changes
    const collisionValue = getValues('collision');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { insuranceId } = useParams();
    const isInsuredEdit = isEdit && insuranceData?.status == 'insured' && insuranceData?.collision == 'Added'
    const options = useMemo(() => {
        const baseOptions = [{ value: 'Added', label: 'Added' }];
        if (collisionValue === 'Added' && isInsuredEdit) {
            return [
                ...baseOptions,
                { value: 'End', label: 'End' },
                { value: 'Remove', label: 'Remove' },
                { value: 'Change', label: 'Change' },
            ];
        }
        if (collisionValue === 'Added') {
            return [
                ...baseOptions,
                { value: 'Change', label: 'Change' },
                { value: 'Remove', label: 'Remove' },
            ];
        }
        if (collisionValue === 'End') {
            return [
                { value: 'End', label: 'End' },
                { value: 'Remove', label: 'Remove' },
                { value: 'endChange', label: 'Change' },
                { value: 'Revert', label: 'Revert' },
            ];
        }
        return baseOptions;
    }, [collisionValue, insuranceData]);



    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (insuranceData?.collision == 'Added') {
            setValue('collisionCoverageId', collisionLastData?.id)
        }
        const requestDate = getValues("requestDate");
        const effectiveDate = getValues("effectiveDate");
        const isInsuranceNew = !insuranceData?.id;


        // if (!collisionRatesData && getValues('collision') != 'Added') {
        //     setValue('collision', null);
        //     setValue('collisionRates', null);
        //     setValue('collisionTemp', null)
        //     setCollisionCalculation(null)
        //     return
        // };
        if (collisionRatesData?.items?.length > 0 && ((requestDate && isInsuranceNew) || (!isEmpty(effectiveDate) && !isInsuranceNew))) {
            setValue("collisionTemp", "Added");
            setAction("Added");
            // setModalVisible(true);
        } else if (!collisionRatesData && isMedallionSingleData) {


            const requestYear = dayjs(getValues("requestDate")).year();
            const vehicleYear = medallionNumberSingleData?.vehicle?.vehicleYear?.year;
            message.error(`Collision rate does not exist. Vehicle Year (${vehicleYear}) or Insurance Year (${requestYear})`);
            setValue("collision", null);
            setAction(null);


        }

    }, [collisionRatesData, insuranceData]);

    const handleChange = (value: string) => {
        if (value === 'Remove') {
            confirmRemoval();
        } else if (value === 'Revert') {
            setAction(value);
            setValue("collision", 'Added');
        } else {
            setAction(value);
            setModalVisible(true);
        }
    };

    const confirmRemoval = () => {
        Modal.confirm({
            title: 'Are you sure you want to remove this collision?',
            content: 'This action will remove the collision details.',
            onOk: () => {
                setAction(null);
                setValue('collision', 'Remove');
                setValue('collisionRates', null);
                setValue('collisionTemp', null)
                setValue('collisionAmount', null)
                setValue('collisionPayableAmount', null)
                setCollisionCalculation(null)
                setModalVisible(false);
            },
        });
    };

    useEffect(() => {
        const requestDate = getValues("requestDate");
        const effectiveDate = getValues("effectiveDate");
        const isCollisionAdded = insuranceData?.collision === "Added";
        const isFlatCancel = insuranceData?.status == 'flat_cancel';
        const isPreRequest = insuranceData?.status === "pre_request";

        if (isPreRequest) {
            setSelectFieldDisabled(false);
        } else {
            if (isFlatCancel && requestDate) {
                setSelectFieldDisabled(false);
            }
            else if (isEdit && (requestDate || isCollisionAdded)) {
                setSelectFieldDisabled(false);
            } else if (insuranceData?.status == 'request' && effectiveDate) {

                setSelectFieldDisabled(false);
            } else if (!isCollisionAdded && !isEdit && insuranceData?.status == 'request') {

                setSelectFieldDisabled(true);
            } else if (isCreate && requestDate) {

                setSelectFieldDisabled(false);
            } else if (insuranceData?.status == 'request' && effectiveDate) {

                setSelectFieldDisabled(false);
            } else {

                setSelectFieldDisabled(true)
            }
        }


    }, [medallionNumberSingleData, insuranceData, watch("requestDate"), watch("effectiveDate")]);

    // useEffect(() => {
    //     const requestDate = getValues("requestDate");
    //     const effectiveDate = getValues("effectiveDate");
    //     const isInsuranceNew = insuranceData?.id;
    //     if (insuranceData?.id && insuranceData?.status == 'request' && !isEdit) {

    //     }

    // }, [watch('effectiveDate')])


    // useEffect(() => {
    //     if (action == null) {
    //         setValue('collision', null);
    //     }
    // }, [action])

    useEffect(() => {
        if (getValues('collision') == 'Added') {
            setAction('Added')
        }
    }, [watch('collision')])

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    const renderLabel = () => {
        return <Flex style={{ width: '100%' }} align="flex-end" justify='space-between'>
            <>Collision</>
            {collisionAllData?.length > 0 && <Button size="small" type='primary' variant="solid" icon={<EyeOutlined />} onClick={handleOpenModal}>
                View Details
            </Button>
            }
        </Flex>
    }

    const confirm: any = (item: any) => {
        setLoading(true)
        axios.delete(`/insurances/${insuranceData.id}/coverage/${item}`).then((r) => {

            notification.success({
                message: 'Success',
                description: r.data.message,
                duration: 5,
            });
            setTimeout(() => {
                window.location.reload()
            }, 500)


        }).catch((e) => { setLoading(false) });
    };

    const columns = [
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (v: any, r: any) => {
                return dayjs(v).format('MM-DD-YYYY')
            }
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (v: any, r: any) => {
                return dayjs(v).format('MM-DD-YYYY')
            }
        },
        {
            title: 'No of Days',
            dataIndex: 'noOfDays',
            key: 'noOfDays'
        },
        {
            title: 'Deductible',
            dataIndex: 'rate',
            key: 'rate',
            render: (value: any) => {
                return value ? `${value}` : '-';
            }
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (value: any) => {
                return usdFormat(value)
            }
        },
        {
            title: 'Payable Amount',
            dataIndex: 'payableAmount',
            key: 'payableAmount',
            render: (value: any) => {
                return usdFormat(value)
            }
        },
        isEdit && {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (value: any, record: any, index: any) => {
                if (index === 0 && isEdit) {
                    return <Popconfirm
                        title="Delete Collision Coverage"
                        description={
                            <>
                                <b>Are you sure you want to delete this collision coverage?</b>
                                <br />
                                <span style={{ color: 'red', fontWeight: 500 }}>
                                    This action cannot be undone.
                                </span>
                                <br />
                                <span style={{ color: '#faad14', fontWeight: 500 }}>
                                    After deletion, all data including insurance will be refreshed automatically.
                                </span>
                            </>
                        }
                        okText="Yes, Delete"
                        cancelText="No"
                        onConfirm={() => confirm(record.id)}
                    >
                        <Button type="primary" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                }
                return null;

            }
        },
    ].filter(Boolean)

    return (
        <>
            <Modal
                title={
                    <Flex align="center" gap="small">
                        <FileTextOutlined />
                        Collision Details
                    </Flex>
                }
                width={'40%'}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null} // No footer buttons
            >
                <Table columns={columns} dataSource={collisionAllData} pagination={false} />
            </Modal>
            <Spin spinning={loading}>
                <SelectField
                    label={renderLabel()}
                    fieldName="collision"
                    control={control}
                    iProps={{
                        placeholder: "Select Collision",
                        size: "middle",
                        onChange: handleChange,
                    }}
                    options={options}
                    errors={errors}
                    classes={'collision-dropDown'}
                    disabled={selectFieldDisabled}
                />
                <CollisionForm
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    action={action}
                    setAction={setAction}
                    parentSetValue={setValue}
                    getParentValues={getValues}
                    medallionNumberSingleData={medallionNumberSingleData}
                    collisionCalculation={collisionCalculation}
                    setCollisionCalculation={setCollisionCalculation}
                    watchParentValues={watch}
                    collisionRatesData={collisionRatesData}
                    insuranceData={insuranceData}
                    collisionLastData={collisionLastData}
                    collisionSecondLastData={collisionSecondLastData}
                />
            </Spin>
        </>
    );
};

// Child Component: CollisionForm
const CollisionForm: React.FC<any> = ({
    modalVisible,
    setModalVisible,
    action,
    parentSetValue,
    getParentValues,
    medallionNumberSingleData,
    collisionCalculation,
    setCollisionCalculation,
    watchParentValues,
    collisionRatesData,
    insuranceData,
    setAction,
    collisionLastData,
    collisionSecondLastData
}: any) => {
    const validationSchema: any = yup.object().shape({
        collisionStartDate: yup
            .string()
            .required('Start Date is required.')
            .matches(
                /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
                'Date must be in MM-DD-YYYY format'
            )
            .test(
                'is-greater-or-equal',
                `Start Date must be greater than or equal to the ${getParentValues('effectiveDate') ? "Effective" : "Request"} Date.`,
                function (value) {

                    const startDate = getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate');

                    if (!value || !startDate) return true;
                    return dayjs(value).isSameOrAfter(dayjs(startDate));
                }
            ),
    });

    const { control, formState: { errors }, handleSubmit, setValue, getValues, watch, reset }: any = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: {
            collisionStartDate: '',
            collisionEndDate: '',
        },
    });

    const [financialData, setFinancialData]: any = useState<any>({
        daysCount: 0,
        totalAmount: 0,
        totalPayableAmount: 0,
    });

    const onSubmit = (data: any) => {
        // Handle "End" action
        if (action === 'End' || action == 'endChange') {
            parentSetValue('collision', 'End');
            setCollisionCalculation(financialData)
            parentSetValue('collisionRates', financialData)
            setModalVisible(false);
        } else if (action === 'Change') {
            parentSetValue('collision', 'Added');
            setCollisionCalculation(financialData)
            parentSetValue('collisionRates', financialData)
            setModalVisible(false);
        } else {
            parentSetValue('collision', action);
            setCollisionCalculation(financialData)
            parentSetValue('collisionRates', financialData)

            setModalVisible(false);
        }
    };



    useEffect(() => {
        if (getParentValues('collision') == 'Added' && modalVisible == false) {
            setCollisionCalculation(financialData);
            parentSetValue('collisionRates', financialData)
        }
    }, [financialData])

    useEffect(() => {
        if (collisionCalculation == null) {
            setValue('collisionStartDate', null)
        }
    }, [collisionCalculation])

    // useEffect(() => {

    //     if (action == null) {
    //         setFinancialData({})
    //         setValue('collision', null);
    //         setValue('collisionRates', null);
    //         setValue('collisionTemp', null)
    //         setCollisionCalculation(null)
    //     }
    // }, [action])


    const updateCollisionData = async () => {
        const collisionRateValue = getValues("collisionRate");
        if (collisionRateValue && collisionRatesData?.items?.[0]?.collisionRates) {
            let matchValue = collisionRatesData.items[0].collisionRates.find(
                (item: any) => item?.collisionType == collisionRateValue
            );

            const isWav = medallionNumberSingleData?.isWav;
            let amount = matchValue?.deductibleAmbRate;
            if (isWav) {
                amount = matchValue?.deductibleWavRate;
            }


            const startDate = getValues("collisionStartDate");
            const endDate = getValues("collisionEndDate");
            if (!startDate) return;
            const collisionPriceResult = calculateMonthlyData({
                startDate: startDate,
                endDate: endDate || null,
                amount: amount,
            });


            setFinancialData((prev: any) => ({
                ...prev,
                totalAmount: amount || 0,
                daysCount: collisionPriceResult?.reduce((sum: number, item: any) => sum + item.payableDaysCount, 0),
                totalPayableAmount: collisionPriceResult?.reduce((sum: number, item: any) => sum + item.payableAmount, 0),
                collisionRate: collisionRateValue,
                collisionStartDate: startDate,
                collisionEndDate: endDate ? dayjs(endDate).format("MM-DD-YYYY") : null,
            }));
        }
    };

    useEffect(() => {
        updateCollisionData();
    }, [watch("collisionRate"), collisionRatesData, watch("collisionStartDate"), watch("collisionEndDate"), insuranceData?.id]);


    useEffect(() => {
        if (getParentValues('surrenderDate')) {
            setValue("collisionEndDate", getParentValues('surrenderDate'))
        }
    }, [watchParentValues('surrenderDate')])
    // useEffect(() => {
    //     if (getParentValues('requestDate') || getParentValues('effectiveDate')) {
    //         const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
    //         const endDate = requestDate.endOf('year');
    //         setValue('collisionStartDate', requestDate.format('MM-DD-YYYY'));
    //         setValue('collisionEndDate', endDate.format('MM-DD-YYYY'));
    //         setValue('collisionRate', 500);
    //         setFinancialData((prev: any) => ({
    //             ...prev,
    //             collisionRate: getValues('collisionRate'),
    //             collisionStartDate: requestDate.format('MM-DD-YYYY'),
    //             collisionEndDate: endDate.format('MM-DD-YYYY'),
    //         }));
    //     }
    // }, [medallionNumberSingleData, watchParentValues('requestDate'), watchParentValues('effectiveDate')])

    useEffect(() => {
        const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
        const collisionStartDate: any = getValues('collisionStartDate') ? dayjs(getValues('collisionStartDate')) : null;
        if (collisionStartDate?.isValid() && requestDate.isAfter(collisionStartDate)) {
            message.error("Collision Start Date can't be greater than Request date");

            // Reset only if values exist to prevent unnecessary renders
            setValue('collisionStartDate', null);
            // setValue('collisionEndDate', null);
            parentSetValue('collision', null)
            setAction(null)
            setCollisionCalculation(null)
            setFinancialData({});
            parentSetValue('collisionRates', {})

        }
    }, [watchParentValues("requestDate"), watchParentValues("effectiveDate")]);


    useEffect(() => {
        const collisionData = collisionLastData;

        if (collisionData && insuranceData.collision == 'Added') {
            const startDate = dayjs(collisionData?.startDate);
            const endDate = getValues('collisionEndDate');
            const year = startDate?.year();
            setValue('collisionStartDate', startDate.format('MM-DD-YYYY'));

            setValue('collisionEndDate', startDate.endOf('year').format('MM-DD-YYYY'));
            setValue('collisionRate', collisionData?.rate);

            const prices: any = collisionRatesData?.items?.[0]?.collisionRates?.find(
                (item: any) => item?.collisionType == collisionData?.rate
            );

            const isWav = medallionNumberSingleData?.isWav;
            let amount = prices?.deductibleAmbRate;
            if (isWav) {
                amount = prices?.deductibleWavRate;
            }


            const collisionResult = calculateMonthlyData({
                startDate: startDate,
                endDate: endDate || null,
                amount: amount || 0,
            });
            setCollisionCalculation({
                daysCount: collisionResult?.reduce((sum: number, item: any) => sum + item.payableDaysCount, 0),
                totalPayableAmount: collisionResult?.reduce((sum: number, item: any) => sum + item.payableAmount, 0),
                totalAmount: amount || 0,
                collisionStartDate: startDate,
                collisionEndDate: endDate,
            })
        }
    }, [insuranceData?.id, medallionNumberSingleData])

    useEffect(() => {
        const collisionData = collisionLastData;
        if (modalVisible == true && !collisionData && insuranceData?.collision !== 'Added') {
            let collisionRate = getParentValues();

            if (collisionRate?.collisionRates?.collisionRate) {
                setValue('collisionRate', collisionRate?.collisionRates?.collisionRate);
            } else {
                setValue('collisionRate', 500);
                const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
                const endDate = requestDate.endOf('year');
                setValue('collisionEndDate', endDate);
            }
        } else if (insuranceData?.collision == null) {
            const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
            const endDate = requestDate.endOf('year');
            setValue('collisionRate', 500);
            setValue('collisionEndDate', endDate.format('MM-DD-YYYY'));

        }
    }, [modalVisible])

    const options: any = [
        { label: 500, value: 500 },
        { label: 1000, value: 1000 },
        { label: 5000, value: 5000 },
    ];

    return (
        <Modal
            title={`${action} Collision`}
            open={modalVisible}
            centered
            maskClosable={false}
            onCancel={() => {
                let collisionRate = getParentValues();
                if (collisionRate) {
                    setValue('collisionStartDate', collisionRate?.collisionRates?.collisionStartDate);
                    setValue('collisionEndDate', collisionRate?.collisionRates?.collisionEndDate);
                    setValue('collisionRate', collisionRate?.collisionRates?.collisionRate);
                }


                setModalVisible(false)
            }}
            onOk={handleSubmit(onSubmit)}
        >
            <Form name="collisionForm" layout="vertical" autoComplete="off">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <InputRadio
                            fieldName="collisionRate"
                            label="Select a rate"
                            control={control}
                            options={options}
                            errors={errors}
                            iProps={
                                {
                                    block: true,
                                    optionType: "button",
                                    buttonStyle: "solid"
                                }
                            }
                        />
                    </Col>
                    <Col span={12}>
                        <DateField
                            label="Start Date"
                            fieldName="collisionStartDate"
                            control={control}
                            errors={errors}
                            disabled={action === "End" || action == 'endChange'}
                            iProps={{
                                format: "MM-DD-YYYY",
                                disabledDate: (currentDate: any) => {
                                    const effectiveDate = getParentValues("effectiveDate");
                                    const requestDate = getParentValues("requestDate");

                                    // ✅ Agar `effectiveDate` ho, toh uska year use karo, warna `requestDate` ka
                                    let referenceDate = effectiveDate || requestDate;
                                    if (collisionSecondLastData?.endDate) {
                                        referenceDate = dayjs(collisionSecondLastData?.endDate).add(1, 'day');
                                    }
                                    const referenceYear = dayjs(referenceDate)?.year();

                                    return (
                                        currentDate &&
                                        (currentDate.year() !== referenceYear || currentDate.isBefore(dayjs(referenceDate), "day"))
                                    );
                                },
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <DateField
                            label="End Date"
                            fieldName="collisionEndDate"
                            control={control}
                            errors={errors}
                            disabled={action === 'Added' || action === 'Change'}
                            iProps={{
                                format: "MM-DD-YYYY",
                                disabledDate: (currentDate: any) => {
                                    const collisionStartDate = getValues("collisionStartDate");

                                    const referenceYear = dayjs(collisionStartDate)?.year();

                                    return (
                                        currentDate &&
                                        (currentDate?.year() !== referenceYear || currentDate.isBefore(dayjs(collisionStartDate), "day"))
                                    );
                                },
                            }}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <FinancialCard
                        title="Collision"
                        amount={financialData.totalAmount}
                        payableAmount={financialData.totalPayableAmount}
                        daysCount={financialData.daysCount}
                    />
                </Row>
            </Form>
        </Modal>
    );
};

export default Collision;
