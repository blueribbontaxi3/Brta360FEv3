import React, { useEffect, useState, useMemo } from 'react';
import { DateField, SelectField } from '@atoms/FormElement';
import { Alert, Button, Col, Flex, Form, message, Modal, Row, Table, Typography } from 'antd';
import { affiliationGroupByYear, usdFormat } from 'utils/helper';
import { calculateMonthlyData } from 'utils/paymentCalculator';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FinancialCard } from './FinancialCard';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
const { Text, Link } = Typography;

dayjs.extend(isSameOrAfter);

// Parent Component
const WorkmanComp: React.FC<any> = ({
    control, errors, setValue, getValues,
    medallionNumberSingleData, watch, workmanCalculation,
    setWorkmanCalculation, insuranceData, isCreate, workmanCompLastData, workmanCompAllData, workmanCompSecondLastData }) => {
    const [messageApi, contextHolder] = message.useMessage();


    const { insuranceId } = useParams();
    const isEdit = window.location.pathname.includes('/edit');
    const isFlatCancel = insuranceData?.status == 'flat_cancel';

    const [modalVisible, setModalVisible] = useState(false);
    const [action, setAction] = useState<string | null>(null);
    const [selectFieldDisabled, setSelectFieldDisabled] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Recalculate options whenever 'workmanComp' changes
    const workmanCompValue = getValues('workmanComp');
    const isInsuredEdit = isEdit && insuranceData?.status == 'insured' && insuranceData?.workmanComp == 'Added'

    const options = useMemo(() => {
        const baseOptions = [{ value: 'Added', label: 'Added' }];
        if (workmanCompValue === 'Added' && isInsuredEdit) {
            return [
                ...baseOptions,
                { value: 'End', label: 'End' },
                { value: 'Remove', label: 'Remove' },
                { value: 'Change', label: 'Change' },
            ];
        }
        if (workmanCompValue === 'Added') {
            return [
                ...baseOptions,
                { value: 'Change', label: 'Change' },
                { value: 'Remove', label: 'Remove' },
            ];
        }
        if (workmanCompValue === 'End') {
            return [
                { value: 'End', label: 'End' },
                { value: 'Remove', label: 'Remove' },
                { value: 'endChange', label: 'Change' },
                { value: 'Revert', label: 'Revert' },
            ];
        }
        return baseOptions;
    }, [workmanCompValue]);


    const handleChange = (value: string) => {
        if (value === 'Remove') {
            confirmRemoval();
        } else if (value === 'Revert') {
            setAction(value);
            setValue("workmanComp", 'Added');
        } else {
            setAction(value);
            setModalVisible(true);
        }
    };

    const confirmRemoval = () => {
        Modal.confirm({
            width: '40%',
            centered: true,
            title: (
                <>
                    Are you sure you want to remove this Workman Comp?
                </>
            ),
            content: (
                <Alert
                    message="Warning!"
                    description={
                        <Text type="danger" strong={true} style={{ fontSize: "16px" }}>
                            This action is irreversible. Once removed, you won't be able to restore this Workman Comp.
                        </Text>
                    }
                    type="warning"
                />
            ),
            okText: (
                <>
                    <CheckCircleOutlined style={{ marginRight: 5 }} /> Yes, Remove
                </>
            ),
            cancelText: (
                <>
                    <CloseCircleOutlined style={{ marginRight: 5 }} /> Cancel
                </>
            ),
            okType: "danger",
            onOk: () => {

                setValue("workmanComp", null);
                setValue('workmanAmount', null);
                setValue('workmanPayableAmount', null);
                setValue('workmanCompRates', null)
                setAction(null)
                setModalVisible(false);
            },
        });
    };

    useEffect(() => {

        if (insuranceData?.workmanComp == 'Added') {
            setValue('workmanCompCoverageId', workmanCompLastData?.id)
        }
        const medallionsCount = medallionNumberSingleData.corporation?.medallionsCount || 0;

        const requestDate = getValues("requestDate");
        const effectiveDate = getValues("effectiveDate");
        const isWorkmanCompAdded = insuranceData?.workmanComp === "Added";
        const isPreRequest = insuranceData?.status === "pre_request";
        const isRequestStatus = (insuranceData?.status === "request");
        const isWorkmanAutoApply = medallionNumberSingleData?.workmanAutoApply;

        if (isPreRequest) {
            if (medallionsCount <= 1 || isWorkmanAutoApply) {
                setSelectFieldDisabled(false);
            } else if (!isWorkmanAutoApply && medallionsCount > 1) {
                setSelectFieldDisabled(true);
            }
        } else {
            if (medallionsCount <= 1 || isWorkmanAutoApply) {
                if (isFlatCancel && requestDate) {
                    setSelectFieldDisabled(false);

                } else if (isEdit && (requestDate || isWorkmanCompAdded)) {
                    setSelectFieldDisabled(false);
                } else if (isRequestStatus && effectiveDate) {
                    setSelectFieldDisabled(false);
                } else if (!isWorkmanCompAdded && !isEdit && isRequestStatus) {
                    setSelectFieldDisabled(true);
                } else if (isCreate && requestDate) {
                    setSelectFieldDisabled(false);
                } else {
                    setSelectFieldDisabled(true);
                }
            } else if (!isWorkmanAutoApply && medallionsCount > 1 && requestDate) {
                setSelectFieldDisabled(true);
                setAction("Added");
                setValue("workmanComp", "Added");
            } else {
                setSelectFieldDisabled(false);
                setAction(null);
                setValue("workmanComp", null);
            }
        }


    }, [medallionNumberSingleData, watch("requestDate"), watch("effectiveDate"), insuranceData]);



    useEffect(() => {
        if (action == null) {
            setValue('workmanComp', null);
        }
    }, [action])

    // Function to open modal
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    const renderLabel = () => {
        return <Flex style={{ width: '100%' }} align="flex-end" justify='space-between'>
            <>Workman's Comp</>

            {workmanCompAllData?.length > 0 && <Button size="small" type='primary' variant="solid" icon={<EyeOutlined />} onClick={handleOpenModal}>
                View Details
            </Button>}

        </Flex>
    }

    const columns = [
        {
            title: 'Start Date', dataIndex: 'startDate', key: 'startDate',
            render: (v: any, r: any) => {
                return dayjs(v).format('MM-DD-YYYY')
            }
        },
        {
            title: 'End Date', dataIndex: 'endDate', key: 'endDate',
            render: (v: any, r: any) => {
                return dayjs(v).format('MM-DD-YYYY')
            }
        },
        {
            title: 'No of Days', dataIndex: 'noOfDays', key: 'noOfDays'
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
    ];

    return (
        <>
            <Modal
                title={
                    <Flex align="center" gap="small">
                        <FileTextOutlined />
                        Workman's Compensation Details
                    </Flex>
                }
                width={'40%'}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null} // No footer buttons
            >
                <Table columns={columns} dataSource={workmanCompAllData} pagination={false} />
            </Modal>
            <SelectField
                label={renderLabel()}
                fieldName="workmanComp"
                control={control}
                setValue={setValue}
                iProps={{
                    placeholder: "Select Workman's Comp",
                    size: "middle",
                    onChange: handleChange,
                    extra: (!medallionNumberSingleData?.workmanAutoApply && medallionNumberSingleData.corporation?.medallionsCount > 1) && <Text type="warning">Workman applies automatically when a corporation has more than one medallion.</Text>
                }}
                classes={'workmanComp-dropDown'}
                options={options}
                errors={errors}
                disabled={selectFieldDisabled}
            />
            <WorkmanCompForm
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                action={action}
                setAction={setAction}
                parentSetValue={setValue}
                getParentValues={getValues}
                medallionNumberSingleData={medallionNumberSingleData}
                workmanCalculation={workmanCalculation}
                setWorkmanCalculation={setWorkmanCalculation}
                watchParentValues={watch}
                insuranceData={insuranceData}
                workmanCompLastData={workmanCompLastData}
                workmanCompSecondLastData={workmanCompSecondLastData}
            />
        </>
    );
};

// Child Component: WorkmanCompForm
const WorkmanCompForm: React.FC<any> = ({
    modalVisible,
    setModalVisible,
    action,
    parentSetValue,
    getParentValues,
    medallionNumberSingleData,
    workmanCalculation,
    setWorkmanCalculation,
    watchParentValues,
    insuranceData,
    setAction,
    workmanCompLastData,
    workmanCompSecondLastData
}: any) => {
    const isEdit = window.location.pathname.includes('/edit');
    const isRequestStatus = insuranceData?.status == 'request'
    const isHardCardStatus = insuranceData?.status == 'insured'

    const validationSchema: any = yup.object().shape({
        workManCompStartDate: yup
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

    const { control, formState: { errors }, handleSubmit, setValue, getValues, watch }: any = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    });

    const [financialData, setFinancialData]: any = useState<any>({
        daysCount: 0,
        totalAmount: 0,
        totalPayableAmount: 0,
    });

    const getPricesForYear = (year: number) => {
        return affiliationGroupByYear(medallionNumberSingleData?.corporation?.affiliation?.prices)
            .find((price: any) => price.year === year);
    };

    const onSubmit = (data: any) => {
        // Handle "End" action
        if (action === 'End' || action == 'endChange') {
            parentSetValue('workmanComp', 'End');
            setWorkmanCalculation(financialData)
            parentSetValue('workmanCompRates', financialData)
            setModalVisible(false);
        } else if (action === 'Change') {
            parentSetValue('workmanComp', 'Added');
            setWorkmanCalculation(financialData)
            parentSetValue('workmanCompRates', financialData)
            setModalVisible(false);
        } else {
            parentSetValue('workmanComp', action);
            setWorkmanCalculation(financialData)
            parentSetValue('workmanCompRates', financialData)
            setModalVisible(false);
        }
    };

    useEffect(() => {
        if ((medallionNumberSingleData.corporation?.medallionsCount > 1 && !medallionNumberSingleData?.workmanAutoApply) && getParentValues('requestDate') && modalVisible == false) {
            setWorkmanCalculation(financialData)
            parentSetValue('workmanCompRates', financialData)
            return;
        } else if (insuranceData?.workmanComp == 'Added' && modalVisible == false) {
            setWorkmanCalculation(financialData)
            parentSetValue('workmanCompRates', financialData)
            return;
        }
    }, [financialData]);

    useEffect(() => {
        const workmanCompDataForm = getParentValues()

        if (medallionNumberSingleData?.workmanAutoApply) {
            if (getParentValues('workmanComp') == 'Added') {
                if (workmanCompDataForm?.workManCompStartDate) {
                    setValue('workManCompStartDate', workmanCompDataForm.workManCompStartDate);
                    setValue('workManCompEndDate', workmanCompDataForm.workManCompEndDate);
                }
                fetchFinancialData();
            } else if (workmanCompDataForm?.workmanComp == null) {
                parentSetValue('workmanCompRates', {})
                setWorkmanCalculation({})
                setValue('workManCompStartDate', null)

            }
        } else if (getParentValues('workmanComp') == 'Added' && medallionNumberSingleData.corporation?.medallionsCount > 1 && !medallionNumberSingleData?.workmanAutoApply) {
            setValue('workManCompStartDate', getParentValues('requestDate'));
            const startDate = dayjs(getParentValues('requestDate'));
            setValue('workManCompEndDate', startDate.endOf('year').format('MM-DD-YYYY'));


            fetchFinancialData();
        } else if (getParentValues('workmanComp') == 'Added' && medallionNumberSingleData.corporation?.medallionsCount == 1) {
            setValue('workManCompStartDate', getParentValues('requestDate'));
            fetchFinancialData();
        }

    }, [medallionNumberSingleData, watchParentValues('requestDate'), watchParentValues('effectiveDate'), watchParentValues('workmanComp')])

    const fetchFinancialData = async () => {
        const startDate = getValues('workManCompStartDate');
        const endDate = getValues('workManCompEndDate');
        if (!startDate) return;

        const requestDate = dayjs(startDate);
        const year = requestDate?.year();

        // Wait for prices to be fetched
        const prices: any = await getPricesForYear(year);
        if (prices) {
            const workmenPriceResult = await calculateMonthlyData({
                startDate: requestDate,
                endDate: endDate || null,
                amount: prices?.workman?.sellingPrice || 0,
            });

            setFinancialData({
                daysCount: workmenPriceResult?.reduce((sum: number, item: any) => sum + item.payableDaysCount, 0),
                totalPayableAmount: workmenPriceResult?.reduce((sum: number, item: any) => sum + item.payableAmount, 0),
                totalAmount: prices?.workman?.sellingPrice || 0,
                workManCompStartDate: startDate,
                workManCompEndDate: endDate,
            });
        }

        // Ensure financial data is updated even if prices are not found
        setFinancialData((prev: any) => ({
            ...prev,
            workManCompStartDate: startDate,
            workManCompEndDate: endDate,
        }));
    };

    useEffect(() => {
        fetchFinancialData(); // Call the async function
    }, [watch('workManCompStartDate'), watch('workManCompEndDate'), insuranceData?.id]);

    useEffect(() => {
        const workmanCompData = workmanCompLastData;
        if (isEdit && insuranceData?.workmanComp == 'Added' && workmanCompData) {
            setValue('workManCompStartDate', dayjs(workmanCompData?.startDate).format('MM-DD-YYYY'));
            setValue('workManCompEndDate', dayjs(workmanCompData?.endDate).format('MM-DD-YYYY'));
            const prices: any = getPricesForYear(dayjs(workmanCompData?.startDate)?.year());
            if (prices) {
                fetchFinancialData(); // Call the async function
            }
        }
    }, [insuranceData?.id, medallionNumberSingleData])

    const [selectKey, setSelectKey] = useState(Date.now());

    useEffect(() => {
        const requestDate = dayjs(getParentValues("effectiveDate") || getParentValues("requestDate"));

        const workManCompStartDate: any = getValues("workManCompStartDate") ? dayjs(getValues("workManCompStartDate")) : null;



        if ((isRequestStatus || (isEdit && isHardCardStatus)) && medallionNumberSingleData.corporation?.medallionsCount > 1 && !medallionNumberSingleData?.workmanAutoApply) {

            setValue("workManCompStartDate", requestDate.format('MM-DD-YYYY'));
            return;
        }

        if (workManCompStartDate?.isValid() && requestDate.isAfter(workManCompStartDate)) {
            message.error("Workman Comp Start Date can't be greater than Request Date!");

            // Reset only if values exist to prevent unnecessary renders
            setValue("workManCompStartDate", null);
            parentSetValue("workmanComp", null); // Ensure this updates state
            setAction(null);
            setWorkmanCalculation(null);
            setFinancialData({});
            setWorkmanCalculation({});
            setSelectKey(Date.now());
            parentSetValue("workmanCompRates", {});

        }
    }, [watchParentValues("requestDate"), watchParentValues("effectiveDate")]);

    useEffect(() => {
        if (getParentValues('surrenderDate')) {
            setValue("workManCompEndDate", getParentValues('surrenderDate'))
        }
    }, [watchParentValues('surrenderDate')])

    useEffect(() => {
        if (action == null) {
            parentSetValue('workmanComp', null);
        } else if (action == 'Revert' && insuranceData.workmanComp == 'Added') {
            const workmanCompData = workmanCompLastData;
            setValue('workManCompEndDate', dayjs(workmanCompData?.endDate).format('MM-DD-YYYY'));
            fetchFinancialData();
        }
    }, [action])

    useEffect(() => {
        const workmanCompData = workmanCompLastData;
        if (workmanCompData && insuranceData.workmanComp == 'Added') {
            const startDate = dayjs(workmanCompData?.startDate);
            const endDate = getValues('workManCompEndDate');
            const year = startDate?.year();

            setValue('workManCompStartDate', startDate.format('MM-DD-YYYY'));
            setValue('workManCompEndDate', startDate.endOf('year').format('MM-DD-YYYY'));

            const prices: any = getPricesForYear(year);
            const workmenPriceResult = calculateMonthlyData({
                startDate: startDate,
                endDate: endDate || null,
                amount: prices?.workman?.sellingPrice || 0,
            });
            setWorkmanCalculation({
                daysCount: workmenPriceResult?.reduce((sum: number, item: any) => sum + item.payableDaysCount, 0),
                totalPayableAmount: workmenPriceResult?.reduce((sum: number, item: any) => sum + item.payableAmount, 0),
                totalAmount: prices?.workman?.sellingPrice || 0,
                workManCompStartDate: startDate,
                workManCompEndDate: endDate,
            })
        }
    }, [insuranceData?.id, medallionNumberSingleData])

    useEffect(() => {
        if (action == null) {
            setWorkmanCalculation({})
            setFinancialData({})
            parentSetValue('workmanCompRates', {})
        }
    }, [action])

    useEffect(() => {
        const workmanCompData = workmanCompLastData;
        const workmanCompDataForm = getParentValues()

        if (modalVisible == true && !workmanCompData && insuranceData?.workmanComp !== 'Added') {
            const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
            const endDate = requestDate.endOf('year');
            if (workmanCompDataForm?.workManCompStartDate) {
                setValue('workManCompStartDate', workmanCompDataForm.workManCompStartDate);
                setValue('workManCompEndDate', workmanCompDataForm.workManCompEndDate);
            } else {
                setValue('workManCompEndDate', endDate.format('MM-DD-YYYY'));
            }

        } else if (insuranceData?.workmanComp == null) {
            const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
            if (getParentValues('requestDate')) {
                const endDate = requestDate.endOf('year');
                setValue('workManCompEndDate', endDate.format('MM-DD-YYYY'));
            }


        }
    }, [modalVisible])


    return (
        <Modal

            title={`${action} Workman's Comp`}
            open={modalVisible}
            centered
            maskClosable={false}
            onCancel={() => {
                let workmanRate = getParentValues('workmanCompRates');
                if (workmanRate) {
                    setValue('workManCompStartDate', workmanRate?.workManCompStartDate);
                    setValue('workManCompEndDate', workmanRate?.workManCompEndDate);
                }


                setModalVisible(false)
            }}
            onOk={handleSubmit(onSubmit)}
        >
            <Form name="workmanCompForm" layout="vertical" autoComplete="off">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <DateField
                            label="Start Date"
                            fieldName="workManCompStartDate"
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

                                    if (workmanCompSecondLastData?.endDate && getParentValues('workmanComp') !== null) {
                                        referenceDate = dayjs(workmanCompSecondLastData?.endDate);
                                    }
                                    const referenceYear = dayjs(referenceDate)?.year();
                                    return (
                                        currentDate &&
                                        (currentDate?.year() !== referenceYear || currentDate.isBefore(dayjs(referenceDate), "day"))
                                    );
                                },
                            }}
                        />


                    </Col>
                    <Col span={12}>
                        <DateField
                            label="End Date"
                            fieldName="workManCompEndDate"
                            control={control}
                            errors={errors}
                            disabled={action === 'Added' || action === 'Change'}
                            iProps={{
                                format: "MM-DD-YYYY",
                                disabledDate: (currentDate: any) => {
                                    const workManCompStartDate = getValues("workManCompStartDate");

                                    const referenceYear = dayjs(workManCompStartDate)?.year();

                                    return (
                                        currentDate &&
                                        (currentDate?.year() !== referenceYear || currentDate.isBefore(dayjs(workManCompStartDate), "day"))
                                    );
                                },
                            }}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <FinancialCard
                        title="Workman Comp"
                        amount={financialData.totalAmount}
                        payableAmount={financialData.totalPayableAmount}
                        daysCount={financialData.daysCount}
                    />
                </Row>
            </Form>
        </Modal>
    );
};

export default WorkmanComp;
