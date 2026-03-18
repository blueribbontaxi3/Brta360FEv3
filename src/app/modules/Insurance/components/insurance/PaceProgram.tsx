import React, { useEffect, useState, useMemo } from 'react';
import { DateField, InputRadio, SelectField } from '@atoms/FormElement';
import { Alert, Button, Col, Flex, Form, message, Modal, Row, Spin, Table, Typography } from 'antd';
import { affiliationGroupByYear, usdFormat } from 'utils/helper';
import { calculateMonthlyData } from 'utils/paymentCalculator';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FinancialCard } from './FinancialCard';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useParams } from 'react-router-dom';
import axios from '../../../../../utils/axiosInceptor';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
const { Text, Link } = Typography;

dayjs.extend(isSameOrAfter);

// Parent Component
const PaceProgram: React.FC<any> = ({
  control, errors, setValue, getValues,
  medallionNumberSingleData, watch,
  paceProgramCalculation, setPaceProgramCalculation,
  insuranceData, isInsured, paceProgramRatesData,
  isCreate, isEdit,
  paceProgramLastData,
  paceProgramAllData, paceProgramSecondLastData
}) => {


  const [messageApi, contextHolder] = message.useMessage();

  const { insuranceId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [selectFieldDisabled, setSelectFieldDisabled] = useState(true);
  // Recalculate options whenever 'paceProgram' changes
  const paceProgramValue = getValues('paceProgram');
  const isInsuredEdit = isEdit && insuranceData?.status == 'insured' && insuranceData?.paceProgram == 'Added'
  const options = useMemo(() => {
    const baseOptions = [{ value: 'Added', label: 'Added' }];
    if (paceProgramValue === 'Added' && isInsuredEdit) {
      return [
        ...baseOptions,
        { value: 'End', label: 'End' },
        { value: 'Remove', label: 'Remove' },
        { value: 'Change', label: 'Change' },
      ];
    }
    if (paceProgramValue === 'Added') {
      return [
        ...baseOptions,
        { value: 'Change', label: 'Change' },
        { value: 'Remove', label: 'Remove' },
      ];
    }
    if (paceProgramValue === 'End') {
      return [
        { value: 'End', label: 'End' },
        { value: 'Remove', label: 'Remove' },
        { value: 'endChange', label: 'Change' },
        { value: 'Revert', label: 'Revert' },
      ];
    }
    return baseOptions;
  }, [paceProgramValue]);

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const requestDate = getValues("requestDate");
  //   const effectiveDate = getValues("effectiveDate");
  //   const isInsuranceNew = !insuranceData?.id;
  //   const isPaceProgramAdded = insuranceData?.paceProgram === "Added";
  //   console.log('===isPaceProgramAdded===', isPaceProgramAdded, isInsuranceNew)

  //   if (isPaceProgramAdded) {
  //     setValue("paceProgramTemp", "Added");
  //     setAction("Added");
  //     setValue("paceProgram", "Added");
  //     // setModalVisible(true);
  //   }
  // }, [insuranceData, paceProgramRatesData]);




  const handleChange = (value: string) => {
    if (value === 'Remove') {
      confirmRemoval();
    } else if (value === 'Revert') {
      setAction(value);
      setValue("paceProgram", 'Added');
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
          Are you sure you want to remove this Pace Program?
        </>
      ),
      content: (
        <Alert
          message="Warning!"
          description={
            <Text type="danger" strong={true} style={{ fontSize: "16px" }}>
              This action is irreversible. Once removed, you won't be able to restore this Pace Program.
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
        setValue("paceProgram", null);
        setValue('paceProgramAmount', null);
        setValue('paceProgramPayableAmount', null);
        setValue('paceProgramRates', null)
        setPaceProgramCalculation(null)
        setAction(null)
        setModalVisible(false);
      },
    });
  };

  useEffect(() => {

    const requestDate = getValues("requestDate");
    const effectiveDate = getValues("effectiveDate");
    const isInsuranceNew = !insuranceData?.id;
    const isPaceProgramAdded = insuranceData?.paceProgram === "Added";
    const isHardCardAdded = insuranceData?.status === "insured";
    const isFlatCancel = insuranceData?.status == 'flat_cancel';

    if (isFlatCancel && requestDate) {
      setSelectFieldDisabled(false);
    }
    else if (!isEdit && isHardCardAdded && isPaceProgramAdded) {
      setSelectFieldDisabled(true);
    } else if (isEdit && (requestDate || isPaceProgramAdded)) {
      setSelectFieldDisabled(false);
    } else if (insuranceData?.status == 'request' && effectiveDate) {
      setSelectFieldDisabled(false);
    } else if (!isPaceProgramAdded && !isEdit && insuranceData?.status == 'request') {
      setSelectFieldDisabled(true);
    } else if (isCreate && requestDate) {
      setSelectFieldDisabled(false);
    } else {
      setSelectFieldDisabled(true);
    }

  }, [medallionNumberSingleData, watch("requestDate"), watch("effectiveDate")]);

  useEffect(() => {
    const isPaceProgramAdded = insuranceData?.paceProgram === "Added";
    if (isPaceProgramAdded) {
      setValue('paceProgram', 'Added');
    }
  }, [])

  useEffect(() => {
    if (insuranceData?.paceProgram == 'Added') {
      setValue('paceProgramCoverageId', paceProgramLastData?.id)
    }

    if (getValues('paceProgram') == 'Added') {
      setAction('Added')
    }
  }, [watch('paceProgram')])


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);


  const renderLabel = () => {
    return <Flex style={{ width: '100%' }} align="flex-end" justify='space-between'>
      <>Pace Program</>
      {paceProgramAllData?.length > 0 && <Button size="small" type='primary' variant="solid" icon={<EyeOutlined />} onClick={handleOpenModal}>
        View Details
      </Button>
      }
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
      {contextHolder}
      <Modal
        title={
          <Flex align="center" gap="small">
            <FileTextOutlined />
            Pace Program Details
          </Flex>
        }
        width={'40%'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null} // No footer buttons
      >
        <Table columns={columns} dataSource={paceProgramAllData} pagination={false} />
      </Modal>
      <Spin spinning={loading}>
        <SelectField
          label={renderLabel()}
          fieldName="paceProgram"
          control={control}
          iProps={{
            placeholder: "Select Pace Program",
            size: "middle",
            onChange: handleChange,
          }}
          options={options}
          errors={errors}
          disabled={selectFieldDisabled}
          classes={'paceProgram-dropDown'}
        />
        <WorkmanCompForm
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          action={action}
          setAction={setAction}
          parentSetValue={setValue}
          getParentValues={getValues}
          medallionNumberSingleData={medallionNumberSingleData}
          paceProgramCalculation={paceProgramCalculation}
          setPaceProgramCalculation={setPaceProgramCalculation}
          watchParentValues={watch}
          paceProgramRatesData={paceProgramRatesData}
          insuranceData={insuranceData}
          paceProgramLastData={paceProgramLastData}
          paceProgramSecondLastData={paceProgramSecondLastData}
        />
      </Spin>
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
  paceProgramCalculation,
  setAction,
  setPaceProgramCalculation,
  watchParentValues,
  paceProgramRatesData,
  insuranceData,
  paceProgramLastData,
  paceProgramSecondLastData
}: any) => {

  const validationSchema: any = yup.object().shape({
    paceProgramStartDate: yup
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
      paceProgramStartDate: '',
      paceProgramEndDate: '',
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
      parentSetValue('paceProgram', 'End');
      setPaceProgramCalculation(financialData)
      parentSetValue('paceProgramRates', financialData)
      setModalVisible(false);
    } else if (action === 'Change') {
      parentSetValue('paceProgram', 'Added');
      setPaceProgramCalculation(financialData)
      parentSetValue('paceProgramRates', financialData)
      setModalVisible(false);
    } else {
      parentSetValue('paceProgram', action);
      setPaceProgramCalculation(financialData)
      parentSetValue('paceProgramRates', financialData)

      setModalVisible(false);
    }
  };
  useEffect(() => {
    if (getParentValues('paceProgram') == 'Added' && modalVisible == false) {
      setPaceProgramCalculation(financialData);
      parentSetValue('paceProgramRates', financialData)

    }
  }, [financialData])


  useEffect(() => {
    if (getParentValues('surrenderDate')) {
      setValue("paceProgramEndDate", getParentValues('surrenderDate'))
    }
  }, [watchParentValues('surrenderDate')])

  useEffect(() => {

    if (paceProgramRatesData?.items?.[0]?.amount) {

      let amount = Number(paceProgramRatesData?.items?.[0]?.amount)

      const startDate = getValues('paceProgramStartDate');
      const endDate = getValues('paceProgramEndDate');

      if (!startDate) return;


      const paceProgramPriceResult = calculateMonthlyData({
        startDate: startDate,
        endDate: endDate ? endDate : null,
        amount: amount,
      });


      setFinancialData((prev: any) => ({
        ...prev,
        totalAmount: amount || 0,
        daysCount: paceProgramPriceResult?.reduce((sum: number, item: any) => sum + item.payableDaysCount, 0),
        totalPayableAmount: paceProgramPriceResult?.reduce((sum: number, item: any) => sum + item.payableAmount, 0),
        paceProgramStartDate: startDate,
        paceProgramEndDate: dayjs(endDate).format('MM-DD-YYYY'),
      }));

    }
  }, [paceProgramRatesData, watch('paceProgramStartDate'), watch('paceProgramEndDate'), medallionNumberSingleData, watchParentValues('requestDate'), watchParentValues('effectiveDate')]);


  useEffect(() => {
    if (getParentValues('requestDate') || getParentValues('effectiveDate')) {
      const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
      const endDate = requestDate.endOf('year');
      // setValue('paceProgramStartDate', requestDate.format('MM-DD-YYYY'));
      setValue('paceProgramEndDate', endDate.format('MM-DD-YYYY'));
      // setFinancialData((prev: any) => ({
      //   ...prev,
      //   paceProgramStartDate: requestDate.format('MM-DD-YYYY'),
      //   paceProgramEndDate: endDate.format('MM-DD-YYYY'),
      // }));
    }
  }, [medallionNumberSingleData, watchParentValues('requestDate'), watchParentValues('effectiveDate')])

  // useEffect(() => {
  //   console.log("amount", amount)
  //   const paceProgramData = insuranceData?.insuranceCoverage?.find((i: any) => i.type === 'paceProgram');
  //   if (isEdit && insuranceData?.paceProgram == 'Added' && paceProgramData) {
  //     setValue('paceProgramStartDate', dayjs(paceProgramData?.startDate).format('MM-DD-YYYY'));
  //     setValue('paceProgramEndDate', dayjs(paceProgramData?.endDate).format('MM-DD-YYYY'));
  //     if (amount) {
  //       setFinancialData((prev: any) => ({
  //         ...prev,
  //         totalAmount: amount || 0,
  //       }));

  //     }
  //   }
  // }, [insuranceData?.id, medallionNumberSingleData])

  useEffect(() => {
    const paceProgramData = paceProgramLastData;
    if (paceProgramData && insuranceData.paceProgram == 'Added') {
      const startDate = dayjs(paceProgramData?.startDate);
      const endDate = getValues('paceProgramEndDate');
      const year = startDate?.year();

      setValue('paceProgramStartDate', startDate.format('MM-DD-YYYY'));
      setValue('paceProgramEndDate', startDate.endOf('year').format('MM-DD-YYYY'));

      let amount = Number(paceProgramRatesData?.items?.[0]?.amount)
      const workmenPriceResult = calculateMonthlyData({
        startDate: startDate,
        endDate: endDate || null,
        amount: amount,
      });
      setPaceProgramCalculation({
        daysCount: workmenPriceResult?.reduce((sum: number, item: any) => sum + item.payableDaysCount, 0),
        totalPayableAmount: workmenPriceResult?.reduce((sum: number, item: any) => sum + item.payableAmount, 0),
        totalAmount: amount,
        paceProgramStartDate: startDate,
        paceProgramEndDate: endDate,
      })
    }
  }, [insuranceData?.id, medallionNumberSingleData])

  useEffect(() => {
    const requestDate = dayjs(getParentValues("effectiveDate") || getParentValues("requestDate"));
    const paceProgramStartDate: any = getValues("paceProgramStartDate") ? dayjs(getValues("paceProgramStartDate")) : null;
    if (paceProgramStartDate?.isValid() && requestDate.isAfter(paceProgramStartDate)) {
      message.error("Pace Program Start Date can't be greater than Request date");
      // Reset only if values exist to prevent unnecessary renders
      setValue('paceProgramStartDate', null);
      // setValue('paceProgramEndDate', null);
      parentSetValue('paceProgram', null)
      parentSetValue('paceProgramRates', {})
      setPaceProgramCalculation(null)
      setFinancialData({});
      setAction(null)
    }
  }, [watchParentValues('requestDate'), watchParentValues('effectiveDate')]);


  useEffect(() => {
    const paceProgramData = paceProgramLastData;
    const paceProgramDataForm = getParentValues()

    if (modalVisible == true && !paceProgramData && insuranceData?.paceProgram !== 'Added') {
      const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
      const endDate = requestDate.endOf('year');
      if (paceProgramDataForm?.paceProgramStartDate) {
        setValue('paceProgramStartDate', paceProgramDataForm.paceProgramStartDate);
        setValue('paceProgramEndDate', paceProgramDataForm.paceProgramEndDate);
      } else {
        setValue('paceProgramEndDate', endDate.format('MM-DD-YYYY'));
      }

    } else if (insuranceData?.paceProgram == null) {
      const requestDate = dayjs(getParentValues('effectiveDate') ? getParentValues('effectiveDate') : getParentValues('requestDate'));
      const endDate = requestDate.endOf('year');
      setValue('paceProgramEndDate', endDate.format('MM-DD-YYYY'));

    }
  }, [modalVisible])


  return (
    <Modal
      title={`${action} Pace Program`}
      open={modalVisible}
      centered
      maskClosable={false}
      onCancel={() => {
        let paceProgramRate = getParentValues();
        if (paceProgramRate) {
          setValue('paceProgramStartDate', paceProgramRate?.paceProgramRates?.paceProgramStartDate);
          setValue('paceProgramEndDate', paceProgramRate?.paceProgramRates?.paceProgramEndDate);
        }
        setModalVisible(false)
      }}
      onOk={handleSubmit(onSubmit)}
    >
      <Form name="paceProgramForm" layout="vertical" autoComplete="off">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <DateField
              label="Start Date"
              fieldName="paceProgramStartDate"
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
                  if (paceProgramSecondLastData?.endDate) {
                    referenceDate = dayjs(paceProgramSecondLastData?.endDate).add(1, 'day');
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
              fieldName="paceProgramEndDate"
              control={control}
              errors={errors}
              disabled={action === 'Added' || action === 'Change'}
              iProps={{
                format: "MM-DD-YYYY",
                disabledDate: (currentDate: any) => {
                  const paceProgramStartDate = getValues("paceProgramStartDate");

                  const referenceYear = dayjs(paceProgramStartDate)?.year();

                  return (
                    currentDate &&
                    (currentDate?.year() !== referenceYear || currentDate.isBefore(dayjs(paceProgramStartDate), "day"))
                  );
                },
              }}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <FinancialCard
            title="Pace Program"
            amount={financialData.totalAmount}
            payableAmount={financialData.totalPayableAmount}
            daysCount={financialData.daysCount}
          />
        </Row>
      </Form>
    </Modal>
  );
};

export default PaceProgram;
