import React, { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Spin, Modal, ConfigProvider, Tabs, Button, notification, Descriptions, message, Alert, Tag, Checkbox, Popconfirm, Radio } from 'antd';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../../../../../utils/axiosInceptor';
import dayjs from 'dayjs'
// Components

// Utils
import { affiliationGroupByYear, formFieldErrors } from 'utils/helper';
import { calculateMonthlyData } from 'utils/paymentCalculator';
import Banner from '@molecules/Banner';
import { MedallionDetails } from './MedallionDetails';
import { PolicyDetails } from './PolicyDetails ';
import { InsuranceOptions } from './InsuranceOptions';
import { VehicleInfo } from './VehicleInfo';
import { CorporationInfo } from './CorporationInfo';
import { MemberInfo } from './MemberInfo';
import { FinancialSummary } from './FinancialSummary';
import { FinancialDetailsGrid } from './FinancialDetailsGrid';
import { DateField, InputCheckbox, SelectField } from '@atoms/FormElement';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { InsuranceExportService } from 'Services/InsuranceExportService';
import MediaCard from '@pages/MediaManager/MediaCard';
import { Typography } from 'antd';

const { Text } = Typography;



const HardCardForm = (props: any) => {
    const modalProps = props?.modalProps
    const isHardCardFormModalOpen = props?.isHardCardFormModalOpen

    const [insuranceData, setInsuranceData] = useState<any>(props?.record || {});
    const [originalInsuranceData, setOriginalInsuranceData] = useState<any>(props?.record || {}); // Keep original for restore
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [medallionNumberData, setMedallionNumberData] = useState([]);
    const [medallionNumberSingleData, setMedallionNumberSingleData] = useState<any>({});
    const [affiliationPrices, setAffiliationPrices]: any = useState<any>({});
    const [affiliationCalculationPrices, setAffiliationCalculationPrices] = useState([]);
    const [liabilityCalculationPrices, setLiabilityCalculationPrices] = useState([]);
    const [isAffiliationPriceModalOpen, setIsAffiliationPriceModalOpen] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalPayableAmount, setTotalPayableAmount] = useState(0);
    const [workmanCalculation, setWorkmanCalculation] = useState<any>({});
    const [collisionCalculation, setCollisionCalculation] = useState<any>({});
    const [paceProgramCalculation, setPaceProgramCalculation] = useState<any>({});
    const navigate = useNavigate()
    const [paceProgramRatesData, setPaceProgramRatesData]: any = useState(null);
    const [collisionRatesData, setCollisionRatesData]: any = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [isVehicleErrorModalOpen, setIsVehicleErrorModalOpen] = useState(false);
    const [isFlatCancel, setIsFlatCancel] = useState(true);
    const [existingInsurance, setExistingInsurance] = useState<any>(null);
    const [isExistingInsuranceModalOpen, setIsExistingInsuranceModalOpen] = useState(false);
    const [forceHardCard, setForceHardCard] = useState(false);
    const [parentInsurance, setParentInsurance] = useState<any>(null);
    const [isInsured, setIsInsured] = useState(false);
    const [isRenew, setIsRenew] = useState(false);
    const [isSurrenderFlow, setIsSurrenderFlow] = useState(false);
    const [isHardCardFlow, setIsHardCardFlow] = useState(false);
    const [isStandardFlow, setIsStandardFlow] = useState(true);
    const [isPreRequest, setIsPreRequest] = useState(false);
    const [isFlatCancelAndSurrender, setIsFlatCancelAndSurrender] = useState(false);

    useEffect(() => {
        console.log("modalProps", modalProps)
    }, [modalProps]);

    // Update derived states when insuranceData or isFlatCancel changes
    useEffect(() => {
        setIsInsured(insuranceData?.status === 'insured');
        setIsSurrenderFlow(isFlatCancel && insuranceData?.status === 'insured');
        setIsHardCardFlow(isFlatCancel && insuranceData?.status !== 'insured');
        setIsStandardFlow(insuranceData?.status !== 'flat_cancel');
        setIsPreRequest(insuranceData?.status === 'pre_request');

    }, [JSON.stringify(insuranceData), isFlatCancel]);

    // Sync insuranceData state with props.record
    useEffect(() => {
        if (props?.record) {
            setInsuranceData(props.record);
            setOriginalInsuranceData(props.record);
        }
    }, [props?.record]);

    const validationSchema = yup.object().shape({
        medallionNumberId: yup
            .number()
            .typeError('Medallion must be a number.')
            .required('Medallion is required.'),

        vehicleId: yup
            .number()
            .typeError('Vehicle must be a number.')
            .required('Vehicle is required.'),

        ...((isFlatCancel && !isRenew) && {
            attachmentFile: yup
                .string()
                .required('File is required.'),
            // liabilityFile: yup.string()
            //     .required('Liability File is required.')
        }),

        ...((!isFlatCancel || isFlatCancelAndSurrender) && {
            flatCancelDate: yup
                .string()
                .required('Flat Cancel date is required.')
                .matches(
                    /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
                    'Date must be in MM-DD-YYYY format.'
                )
                .test(
                    'valid-date',
                    'Invalid date. Please provide a valid date in MM-DD-YYYY format.',
                    validateDate
                ),
            flatCancelReason: yup
                .string()
                .required('Flat Cancel Reason is required.')
        }),

        ...(isStandardFlow && isFlatCancel && {
            ...(isSurrenderFlow && {
                surrenderDate: yup
                    .string()
                    .required('Surrender date is required.')
                    .matches(
                        /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
                        'Date must be in MM-DD-YYYY format.'
                    )
                    .test('valid-date', 'Invalid date.', validateDate),
            }),
            ...(isHardCardFlow && !isPreRequest && {
                effectiveDate: yup
                    .string()
                    .required('Effective date is required.')
                    .matches(
                        /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
                        'Date must be in MM-DD-YYYY format.'
                    )
                    .test('valid-date', 'Invalid date.', validateDate),
                policyNumberLiability: yup.string().required('Policy Liability is required.'),
                policyNumberWorkmanComp: yup.string().when('workmanComp', {
                    is: (val: any) => val === 'Added',
                    then: (schema) => schema.required('Policy Number Workman Comp is required'),
                    otherwise: (schema) => schema.notRequired(),
                }),
                policyNumberCollision: yup.string().when('collision', {
                    is: (val: any) => val === 'Added',
                    then: (schema) => schema.required('Policy Number Collision is required'),
                    otherwise: (schema) => schema.notRequired(),
                }),

            }),
        }),
    });


    // function validateDate(value: string) {
    //     console.log("value", value)
    //     if (!value) return false; // Required validation ensures it's not empty
    //     const [month, day, year] = value.split('-').map(Number);
    //     const date = new Date(`${year}-${month}-${day}`);
    //     console.log("date", date.getDate(), day)
    //     return (
    //         date instanceof Date &&
    //         !isNaN(date.getTime()) &&
    //         date.getMonth() + 1 === month &&
    //         date.getDate() === day &&
    //         date.getFullYear() === year
    //     );
    // }


    function validateDate(value: string) {
        if (!value) return false;

        const parsedDate = dayjs(value, 'MM-DD-YYYY', true); // true = strict parsing

        return parsedDate.isValid();
    }

    const { control, reset, watch, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
    });

    useEffect(() => {
        if (watch('medallionNumberId')) {
            fetchMedallionData();
        } else {
            setValue('requestDate', null)
            setMedallionNumberSingleData({})
        }
    }, [watch('medallionNumberId')]);

    useEffect(() => {
        setIsFlatCancelAndSurrender(getValues('isFlatCancelAndSurrender'))
    }, [watch('isFlatCancelAndSurrender')])

    useEffect(() => {
        if (insuranceData?.medallion?.id) {
            setValue('medallionNumberId', insuranceData?.medallion?.id)
            setValue('requestDate', insuranceData?.requestDate)
            setValue('effectiveDate', insuranceData?.effectiveDate)
            setValue('workmanComp', insuranceData?.workmanComp)
            setValue('collision', insuranceData?.collision)
            setValue('paceProgram', insuranceData?.paceProgram)
            setValue('policyNumberCollision', insuranceData?.policyNumberCollision)
            setValue('policyNumberLiability', insuranceData?.policyNumberLiability)
            setValue('policyNumberWorkmanComp', insuranceData?.policyNumberWorkmanComp)
        }

    }, [insuranceData])

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            const errorMessage = errors[firstErrorField]?.message;

            if (errorMessage) {
                notification.error({
                    message: 'Validation Error',
                    description: errorMessage,
                    duration: 3,
                });
            }
        }
    }, [errors]);


    useEffect(() => {
        if (getValues('requestDate')) {
            calculatePrices();
            fetchCollisionRates();
            fetchPaceProgramRates();
        } else {
            setAffiliationPrices([]);
            setAffiliationCalculationPrices([]);
            setLiabilityCalculationPrices([]);
            setCollisionCalculation([]);
            setPaceProgramCalculation([]);
        }
        setForceHardCard(false)
        setValue('forceHardCard', false)
    }, [watch('requestDate'), watch('effectiveDate'), watch('surrenderDate'), medallionNumberSingleData?.id]);

    useEffect(() => {
        if (medallionNumberSingleData?.id) {
            calculatePrices();
        }
    }, [medallionNumberSingleData?.id])

    const fetchCollisionRates = async () => {
        try {
            setLoading(true);

            const requestYear = dayjs(getValues("requestDate")).year();
            const vehicleYear = medallionNumberSingleData?.vehicle?.vehicleYear?.year;
            // if (!requestYear || !vehicleYear) {
            //     throw new Error("Invalid request or vehicle year");
            // }

            const response = await axios.get(`/collision-rates`, {
                params: {
                    pageSize: 99999,
                    forYear: requestYear,
                    vehicleYear: vehicleYear,
                },
            });

            setCollisionRatesData(response?.data?.data || null);
        } catch (error: any) {
            // console.error("Error fetching collision rates:", error.message || error);
            message.error("Failed to fetch collision rates. Please try again.");
            console.error("Error fetching collision rates:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPaceProgramRates = async () => {
        try {
            setLoading(true);

            const requestYear = dayjs(getValues("requestDate")).year();

            const response = await axios.get(`/pace-program-rates`, {
                params: {
                    pageSize: 99999,
                    search: requestYear,
                },
            });


            setPaceProgramRatesData(response?.data?.data || null);
        } catch (error: any) {
            console.error("Error fetching paceProgram rates:", error.message || error);
            message.error("Failed to fetch paceProgram rates. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const fetchMedallionData = async () => {
        const medallionNumberId = getValues('medallionNumberId');
        if (!medallionNumberId) {
            setMedallionNumberSingleData({});
            setValue('requestDate', null);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`/medallions/${medallionNumberId}`);
            setMedallionNumberSingleData(response.data.data.medallionNumber);
            setValue('memberId', response.data.data.medallionNumber.corporation.member.id)
            setValue('corporationId', response.data.data.medallionNumber.corporation.id)
            setValue('vehicleId', response.data.data.medallionNumber?.vehicle?.id)

        } catch (error: any) {
            console.error("Error fetching medallion data:", error.message || error);
            notification.error({
                message: "Failed to fetch medallion data",
                description: error?.message,
                duration: 5,
            });
            setMedallionNumberSingleData({});
        } finally {
            setLoading(false);
        }
    };

    const calculatePrices = () => {
        if (insuranceData?.status === 'flat_cancel' && !getValues('requestDate')) {
            return;
        }
        const requestDate: any = getValues('requestDate');
        const effectiveDate: any = getValues('effectiveDate');
        const endDate: any = getValues('surrenderDate') ? getValues('surrenderDate') : null
        let startDate: any;
        if (requestDate) {
            startDate = dayjs(requestDate)
        }

        if (effectiveDate) {
            startDate = dayjs(effectiveDate)
        }

        const year = startDate.year();
        const prices: any = affiliationGroupByYear(medallionNumberSingleData?.corporation?.affiliation?.prices).find((value: any) => value.year === year);

        const affiliationPriceResult = calculateMonthlyData({
            startDate: startDate,
            endDate: endDate,
            amount: Number(prices?.affiliation?.sellingPrice - (medallionNumberSingleData?.corporation?.discount?.amount || 0)),
        });

        const liabilityPriceResult = calculateMonthlyData({
            startDate: startDate,
            endDate: endDate,
            amount: Number(prices?.liability?.sellingPrice),
        });

        setAffiliationPrices(prices);
        setAffiliationCalculationPrices(affiliationPriceResult);
        setLiabilityCalculationPrices(liabilityPriceResult);

    };

    const totalCalculation = () => {
        const totalPayableAffiliationAmount =
            affiliationCalculationPrices?.reduce((sum, item: any) => sum + item.payableAmount, 0) || 0;
        const totalAffiliationAmount = Number(affiliationPrices?.affiliation?.sellingPrice || 0);

        const totalPayableLiabilityAmount =
            liabilityCalculationPrices?.reduce((sum, item: any) => sum + item.payableAmount, 0) || 0;
        const totalLiabilityAmount =
            liabilityCalculationPrices?.reduce((sum, item: any) => sum + item.perAmount, 0) || 0;

        const totalPayableWorkmanCompAmount = Number(workmanCalculation?.totalPayableAmount || 0);
        const totalWorkmanCompAmount = Number(workmanCalculation?.totalAmount || 0);

        const totalPayableCollisionAmount = Number(collisionCalculation?.totalPayableAmount || 0);
        const totalCollisionAmount = Number(collisionCalculation?.totalAmount || 0);

        const totalPayablePaceProgramAmount = Number(paceProgramCalculation?.totalPayableAmount || 0);
        const totalPaceProgramAmount = Number(paceProgramCalculation?.totalAmount || 0);

        setTotalAmount(
            totalAffiliationAmount + totalLiabilityAmount + totalWorkmanCompAmount + totalCollisionAmount + totalPaceProgramAmount
        );
        setTotalPayableAmount(
            totalPayableLiabilityAmount +
            totalPayableAffiliationAmount +
            totalPayableCollisionAmount +
            totalPayableWorkmanCompAmount +
            totalPayablePaceProgramAmount
        );

        setValue('liabilityRate', {
            totalLiabilityAmount,
            totalPayableLiabilityAmount,
        });
        setValue('affiliationRate', {
            affiliationAmount: totalAffiliationAmount,
            payableAffiliationAmount: totalPayableAffiliationAmount,
            discount: (medallionNumberSingleData?.corporation?.discount?.amount || 0),
            affiliationAmountAfterDiscount: Number(totalAffiliationAmount - (medallionNumberSingleData?.corporation?.discount?.amount || 0))
        });
        setValue(
            'noOfDays',
            liabilityCalculationPrices?.reduce((sum, item: any) => sum + item.payableDaysCount, 0) || 0
        );
    };

    useEffect(() => {
        totalCalculation();
    }, [
        useMemo(() => JSON.stringify(affiliationCalculationPrices), [affiliationCalculationPrices]),
        useMemo(() => JSON.stringify(liabilityCalculationPrices), [liabilityCalculationPrices]),
        useMemo(() => JSON.stringify(workmanCalculation), [workmanCalculation]),
        useMemo(() => JSON.stringify(collisionCalculation), [collisionCalculation]),
        useMemo(() => JSON.stringify(paceProgramCalculation), [paceProgramCalculation]),
    ]);

    useEffect(() => {
        setForceHardCard(false);
        setValue('forceHardCard', false);
        setValue('flatCancel', null)
    }, []);

    // Reset action type when modal opens
    useEffect(() => {
        if (isHardCardFormModalOpen?.open) {
            setValue('flatCancel', false);
            setValue('isFlatCancelAndSurrender', false);
            setValue('surrenderDate', null);
            setValue('surrenderFile', null);
            setValue('flatCancelDate', null);
            setValue('flatCancelFile', null);
        }
    }, [isHardCardFormModalOpen]);

    // Set parentInsurance data when isSurrender is selected
    useEffect(() => {
        const fetchAndSetParentInsurance = async () => {
            if (getValues('isFlatCancelAndSurrender') && originalInsuranceData?.parentId) {
                try {
                    const response = await axios.get(`insurances/${originalInsuranceData?.parentId}`);
                    const parentInsuranceData = response.data?.data?.insurance;

                    setInsuranceData(parentInsuranceData);
                    // if (parentInsuranceData) {
                    //     setValue('medallionNumberId', parentInsuranceData?.medallion?.id);
                    //     setValue('memberId', parentInsuranceData?.member?.id);
                    //     setValue('corporationId', parentInsuranceData?.corporation?.id);
                    //     setValue('vehicleId', parentInsuranceData?.vehicle?.id);
                    //     setValue('requestDate', parentInsuranceData?.requestDate);
                    //     setValue('effectiveDate', parentInsuranceData?.effectiveDate);
                    //     setValue('workmanComp', parentInsuranceData?.workmanComp);
                    //     setValue('collision', parentInsuranceData?.collision);
                    //     setValue('paceProgram', parentInsuranceData?.paceProgram);
                    //     setValue('policyNumberCollision', parentInsuranceData?.policyNumberCollision);
                    //     setValue('policyNumberLiability', parentInsuranceData?.policyNumberLiability);
                    //     setValue('policyNumberWorkmanComp', parentInsuranceData?.policyNumberWorkmanComp);
                    // }
                } catch (error) {
                    console.error('Error fetching parent insurance:', error);
                }
            }
        };

        fetchAndSetParentInsurance();
    }, [watch('isFlatCancelAndSurrender')]);

    useEffect(() => {

        if (!getValues('flatCancel')) {
            setValue('flatCancelDate', null)
        }
        setIsFlatCancel(!getValues('flatCancel'))
    }, [errors, watch('flatCancel')])

    const onSubmit = async (data: any) => {
        setLoading(true);
        setValue('insuranceIdExisting', null);
        if (medallionNumberSingleData?.corporation?.isCmg) {
            setPaceProgramCalculation({})
        }

        const isPreRequest = insuranceData?.status == 'pre_request';

        try {
            let endpoint = '';
            if (isPreRequest) {
                endpoint = 'insurances/store';
            } else if (insuranceData?.status === 'flat_cancel' && !getValues('flatCancel')) {
                endpoint = 'insurances/store';
            } else {
                endpoint = `insurances/${isFlatCancel ? (isInsured ? 'surrender' : 'hard-card') : 'flat-cancel'}/store`;
            }


            const method = 'post';
            data.parentId = originalInsuranceData?.id;

            data.isPreRequest = isPreRequest;
            data.forceHardCard = forceHardCard || false;
            const response = await axios[method](endpoint, {
                ...data,
                status: data.status === true ? 'active' : 'inactive'
            });

            if (response.data.status === 1) {
                notification.success({
                    message: 'Success',
                    description: response.data.message,
                });
                modalProps({ open: false, loadNew: true })
                setValue('flatCancel', null)
                setIsExistingInsuranceModalOpen(false);
                // InsuranceExportService.exportMainData([response.data.data?.data]);
                if (window.location.pathname.includes('/insurances-renew')) {
                    navigate('/insurances-renew');
                } else {
                    navigate('/insurances');
                }
            }
        } catch (e: any) {
            formFieldErrors(e, setError);
            if (e?.response?.data?.isModal && e?.response?.data?.insuranceRecord) {
                /**
                 * If the response indicates that an existing insurance record is found,
                 * and server has provided the insurance record,
                 * we set the existing insurance data and open the modal.
                 * 
                 */
                setValue('insuranceIdExisting', e?.response?.data?.insuranceRecord?.id);
                setExistingInsurance(e.response.data);
                setIsExistingInsuranceModalOpen(true);
            }
            console.error("Error fetching medallion data:", e.message || e);
        } finally {
            setLoading(false);
        }
    };


    const renderTabItems = (data: any) => {
        return Object.entries(data).map(([key, value]: any) => ({
            label: value.year,
            key,
            children: Object.entries(value)
                .filter(([innerKey]) => innerKey !== "year")
                .map(([innerKey, innerValue]: any) => (
                    <Descriptions
                        style={{ marginTop: 20 }}
                        size="small"
                        title={innerKey.charAt(0).toUpperCase() + innerKey.slice(1)}
                        bordered
                        column={2}
                        key={innerKey}
                    >
                        <Descriptions.Item label="Cost Price">{innerValue.costPrice}</Descriptions.Item>
                        <Descriptions.Item label="Selling Price">{innerValue.sellingPrice}</Descriptions.Item>
                    </Descriptions>
                )),
        }));
    };

    useEffect(() => {
        if (medallionNumberSingleData?.vehicle && !medallionNumberSingleData?.vehicle?.vehicleYear?.year) {
            setIsVehicleErrorModalOpen(true);
        }
    }, [medallionNumberSingleData])

    const handleForceHardCard = () => {
        // Form values le kar force flag ke sath submit karein
        const values = getValues();

        handleSubmit(onSubmit)(values);
    };


    return (
        <>
            <Spin spinning={loading}>
                <Form
                    name="insuranceForm"
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleSubmit(onSubmit)}
                >
                    {
                        (originalInsuranceData.status == 'request') && (
                            <InputCheckbox
                                control={control}
                                fieldName="flatCancel"
                                label="Flat Cancel"
                                checked={watch('flatCancel')}
                                onChange={(e: any) => {
                                    const checked = e.target.checked;
                                    setValue('flatCancel', checked);
                                    setValue('flatCancelDate', null)
                                    setValue('flatCancelReason', null)
                                    setValue('flatCancelReason', undefined)
                                }}
                            />
                        )
                    }
                    {
                        (originalInsuranceData.status == 'renew') && (
                            <>
                                <InputCheckbox
                                    control={control}
                                    fieldName="isFlatCancelAndSurrender"
                                    label="Flat Cancel / Surrender"
                                    checked={watch('isFlatCancelAndSurrender')}
                                    onChange={(e: any) => {
                                        const checked = e.target.checked;
                                        setValue('isFlatCancelAndSurrender', checked);
                                        setValue('flatCancelDate', null)
                                    }}
                                />
                            </>
                        )
                    }

                    {
                        getValues('isFlatCancelAndSurrender') && <>
                            <DateField
                                label="Flat Cancel Date"
                                fieldName="flatCancelDate"
                                control={control}
                                iProps={{
                                    placeholder: "Flat Cancel Date",
                                    size: "middle",
                                    format: "MM-DD-YYYY",
                                    disabledDate: (currentDate: any) => {

                                        if (insuranceData?.status === "renew") {
                                            const requestYear = dayjs(insuranceData?.effectiveDate).subtract(1, 'year').year();
                                            return (
                                                currentDate.startOf("day") <=
                                                dayjs(insuranceData?.effectiveDate).subtract(1, 'year').startOf("day") ||
                                                currentDate.year() !== requestYear
                                            );
                                        }
                                        return false; // Else sab allowed
                                    },
                                }}
                                errors={errors}
                            />
                            <SelectField
                                label="Reason"
                                fieldName="flatCancelReason"
                                allowClear={true}
                                control={control}
                                iProps={{
                                    loading: loading,
                                    placeholder: 'Select Reason',
                                    size: 'middle',
                                }}
                                errors={errors}
                                options={
                                    [
                                        {
                                            value: 'Reason 1',
                                            label: 'Reason 1',
                                        },
                                        {
                                            value: 'Reason 2',
                                            label: 'Reason 2',
                                        }
                                    ]
                                }
                            />

                        </>
                    }

                    {
                        getValues('flatCancel') && <>
                            <DateField
                                label="Flat Cancel Date"
                                fieldName="flatCancelDate"
                                control={control}
                                iProps={{
                                    placeholder: "Flat Cancel Date",
                                    size: "middle",
                                    format: "MM-DD-YYYY",
                                    disabledDate: (currentDate: any) => {

                                        if (insuranceData?.status === "renew") {
                                            const requestYear = dayjs(insuranceData?.effectiveDate).subtract(1, 'year').year();
                                            return (
                                                currentDate.startOf("day") <=
                                                dayjs(insuranceData?.effectiveDate).subtract(1, 'year').startOf("day") ||
                                                currentDate.year() !== requestYear
                                            );
                                        }
                                        return false; // Else sab allowed
                                    },
                                }}
                                errors={errors}
                            />
                            <SelectField
                                label="Reason"
                                fieldName="flatCancelReason"
                                allowClear={true}
                                control={control}
                                iProps={{
                                    loading: loading,
                                    placeholder: 'Select Reason',
                                    size: 'middle',
                                }}
                                errors={errors}
                                options={
                                    [
                                        {
                                            value: 'Reason 1',
                                            label: 'Reason 1',
                                        },
                                        {
                                            value: 'Reason 2',
                                            label: 'Reason 2',
                                        }
                                    ]
                                }
                            />

                        </>
                    }

                    <Row gutter={[16, 16]}

                        {...(getValues('flatCancel')) && {
                            style: {
                                display: 'none',
                            },
                        }}
                        {...(originalInsuranceData?.status === "renew" && !getValues('isFlatCancelAndSurrender')) && {
                            style: {
                                display: 'none',
                            },
                        }}
                    >
                        <Col xs={24} lg={10}>
                            <MedallionDetails
                                control={control}
                                errors={errors}
                                setMedallionNumberData={setMedallionNumberData}
                                medallionNumberData={medallionNumberData}
                                medallionNumberSingleData={medallionNumberSingleData}
                                setIsAffiliationPriceModalOpen={setIsAffiliationPriceModalOpen}
                                insuranceData={insuranceData}
                                setValue={setValue}
                            />


                            <PolicyDetails
                                control={control}
                                errors={errors}
                                disabled={!medallionNumberSingleData.id || (true && !isFlatCancel)}
                            />
                        </Col>

                        {/* Middle Column */}
                        <Col xs={24} lg={8}>
                            <VehicleInfo data={medallionNumberSingleData?.vehicle} />
                            <InsuranceOptions
                                control={control}
                                errors={errors}
                                setValue={setValue}
                                getValues={getValues}
                                watch={watch}
                                medallionNumberSingleData={medallionNumberSingleData}
                                workmanCalculation={workmanCalculation}
                                setWorkmanCalculation={setWorkmanCalculation}
                                collisionCalculation={collisionCalculation}
                                setCollisionCalculation={setCollisionCalculation}
                                paceProgramCalculation={paceProgramCalculation}
                                setPaceProgramCalculation={setPaceProgramCalculation}
                                insuranceData={insuranceData}
                                isInsured={isInsured}
                                collisionRatesData={collisionRatesData}
                                paceProgramRatesData={paceProgramRatesData}
                            />

                        </Col>

                        {/* Right Column */}
                        <Col xs={24} lg={6}>
                            <MemberInfo data={medallionNumberSingleData?.corporation?.member} />

                            <CorporationInfo
                                data={medallionNumberSingleData?.corporation}
                                onViewPrices={() => setIsAffiliationPriceModalOpen(true)}
                            />


                            <FinancialSummary
                                totalAmount={totalAmount}
                                totalPayable={totalPayableAmount}
                            />
                        </Col>

                        {/* Financial Details Grid - Full Width */}
                        <Col span={24}>
                            <FinancialDetailsGrid
                                affiliationPrices={affiliationPrices}
                                affiliationCalculationPrices={affiliationCalculationPrices}
                                liabilityCalculationPrices={liabilityCalculationPrices}
                                workmanCalculation={workmanCalculation}
                                collisionCalculation={collisionCalculation}
                                paceProgramCalculation={paceProgramCalculation}
                                medallionNumberSingleData={medallionNumberSingleData}
                            />

                        </Col>

                        {/* Submit Button */}

                    </Row>



                    {
                        medallionNumberSingleData?.vehicle && medallionNumberSingleData?.vehicle?.vehicleYear?.year &&
                        <Row justify={'end'} style={{ marginTop: '10px' }}>
                            <Col>
                                <Button type="primary" danger={isInsured || getValues('isFlatCancelAndSurrender') ? true : false} htmlType="submit" size="large"  >
                                    {
                                        !isFlatCancelAndSurrender && getValues('flatCancel') ? 'Renew' :
                                            isFlatCancelAndSurrender ? 'Surrender With Flat Cancel' :
                                                insuranceData?.status == 'pre_request' ? 'Create Request' :
                                                    insuranceData.status == 'renew' ? 'Confirm Surrender' :
                                                        insuranceData.status == 'renew' && !getValues('flatCancel') ? 'Confirm Hard Card' :
                                                            insuranceData.status === 'flat_cancel' ? 'Request' : <>
                                                                {isInsured ? ' Surrender' : getValues('flatCancel') ? 'Create Flat Cancel' : 'Create Hard Card'}
                                                            </>
                                    }


                                </Button>
                            </Col>
                        </Row>
                    }
                </Form>
            </Spin>

            <Modal
                title="Pricing Information"
                open={isAffiliationPriceModalOpen}
                onCancel={() => setIsAffiliationPriceModalOpen(false)}
                footer={null}
                width={700}
            >
                <ConfigProvider
                    theme={{
                        components: {
                            Descriptions: {
                                titleMarginBottom: 0
                            },
                        },
                    }}
                >
                    <Tabs
                        type="card"
                        items={renderTabItems(affiliationGroupByYear(medallionNumberSingleData?.corporation?.affiliation?.prices))}
                    />
                </ConfigProvider>
            </Modal>

            <Modal
                title={
                    <span style={{ color: '#faad14' }}>
                        <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
                        Vehicle Record Missing
                    </span>
                }
                open={isVehicleErrorModalOpen}
                onCancel={() => setIsVehicleErrorModalOpen(false)}
                footer={[
                    <Button type="link" onClick={() => {
                        medallionNumberSingleData?.vehicle
                            ? navigate('/vehicle/edit/' + medallionNumberSingleData?.vehicle?.id) : navigate('/vehicles/')

                    }}>
                        Go to Vehicle Info
                    </Button>,
                    <Button key="ok" type="primary" danger onClick={() => setIsVehicleErrorModalOpen(false)}>
                        Close
                    </Button>,
                ]}
            >
                {
                    medallionNumberSingleData?.vehicle ?
                        <Alert
                            message="Incomplete Vehicle Information"
                            description="The vehicle record is missing important information like the vehicle year. Please update the vehicle details before proceeding with insurance creation."
                            type="error"
                            showIcon
                        />
                        :
                        <Alert
                            message="Incomplete Vehicle Information"
                            description="The vehicle record is missing important information. Please update the vehicle details before proceeding with insurance creation."
                            type="error"
                            showIcon
                        />
                }

            </Modal>

            <Modal
                title="Existing Insurance Record"
                open={isExistingInsuranceModalOpen}
                onCancel={() => setIsExistingInsuranceModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsExistingInsuranceModalOpen(false)}>
                        Close
                    </Button>,
                    <Popconfirm
                        title="Are you sure you want to force create a hard card?"
                        onConfirm={handleForceHardCard}
                        okText="Yes"
                        cancelText="No"
                        disabled={!forceHardCard || loading}
                    >
                        <Button
                            key="force-create"
                            type="primary"
                            danger
                            disabled={!forceHardCard || loading}
                            loading={loading}
                        >
                            Force Create Hard Card
                        </Button>
                    </Popconfirm>
                ]}
                width={700}
                centered
            >
                <Spin spinning={loading}>
                    <Alert
                        message="Action Required"
                        description={
                            <>
                                Please surrender the existing insurance before creating a hard card.<br />
                                {
                                    existingInsurance?.vehicle?.vinNumber
                                        ? <>This VIN (<b>{existingInsurance.vehicle.vinNumber}</b>) is already assigned to another insurance record. Please resolve this conflict before proceeding.</>
                                        : null
                                }
                            </>
                        }
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />

                    {existingInsurance ? (
                        <Descriptions
                            bordered
                            column={2}
                            size="small"
                            labelStyle={{ fontWeight: 600 }}
                        >
                            <Descriptions.Item label="Current Vehicle" span={2}>
                                VIN: <Tag color='blue-inverse'>{existingInsurance.vehicle?.vinNumber || '-'}</Tag> &nbsp; | &nbsp; ID: {existingInsurance.vehicle?.id || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Medallion Number">
                                <Tag color='cyan-inverse'>{existingInsurance?.insuranceRecord?.[0]?.medallionNumber || '-'}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Insurance Status">
                                <Tag color={existingInsurance?.insuranceRecord?.[0]?.status === 'insured' ? 'green' : 'red'}>
                                    {existingInsurance?.insuranceRecord?.[0]?.status?.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Corporation" span={2}>
                                {existingInsurance?.insuranceRecord?.[0]?.corporation?.corporationName ||
                                    existingInsurance?.insuranceRecord?.[0]?.corporationName ||
                                    '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Member" span={2}>
                                {existingInsurance?.insuranceRecord?.[0]?.corporation?.member?.fullName ||
                                    '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Request Date">{existingInsurance?.insuranceRecord?.[0]?.requestDate || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Effective Date">{existingInsurance?.insuranceRecord?.[0]?.effectiveDate || '-'}</Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>No insurance record found.</p>
                    )}

                    <Checkbox
                        checked={forceHardCard}
                        onChange={e => setForceHardCard(e.target.checked)}
                        style={{ margin: '16px 0 8px 0' }}
                    >
                        Forcefully create Hard Card
                    </Checkbox>

                    {forceHardCard && (
                        <Alert
                            type="warning"
                            showIcon
                            style={{ marginBottom: 16 }}
                            message="Warning"
                            description={
                                <>
                                    If you forcefully create a Hard Card, the previous insurance request will be <b>surrendered</b>.<br />
                                    The surrender date will be the effective date of this Hard Card.
                                </>
                            }
                        />
                    )}
                </Spin>
            </Modal >

        </>
    );
};

export default HardCardForm;