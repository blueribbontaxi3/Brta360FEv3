import React, { useEffect, useMemo, useState } from 'react';
import { Form, Row, Col, Spin, Modal, ConfigProvider, Tabs, Button, notification, Descriptions, message, Space, Alert } from 'antd';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axiosInceptor';
import dayjs from 'dayjs'
// Components
import { MedallionDetails } from './components/insurance/MedallionDetails';
import { InsuranceOptions } from './components/insurance/InsuranceOptions';
import { FinancialDetailsGrid } from './components/insurance/FinancialDetailsGrid';
import { FinancialSummary } from './components/insurance/FinancialSummary';
import { VehicleInfo } from './components/insurance/VehicleInfo';
import { CorporationInfo } from './components/insurance/CorporationInfo';
import { MemberInfo } from './components/insurance/MemberInfo';

// Utils
import { affiliationGroupByYear, formFieldErrors } from 'utils/helper';
import { calculateMonthlyData } from 'utils/paymentCalculator';
import Banner from '@molecules/Banner';
import { PolicyDetails } from './components/insurance/PolicyDetails ';
import ConfirmationModal from './components/insurance/ConfirmationModal';
import Status from '@atoms/Status';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { InsuranceExportService } from 'Services/InsuranceExportService';


function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}





const CreateOrEdit = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData]: any = useState(null);
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
  const [collisionRatesData, setCollisionRatesData]: any = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [paceProgramRatesData, setPaceProgramRatesData]: any = useState(null);
  const isEdit = window.location.pathname.includes('/edit');
  const [isVehicleErrorModalOpen, setIsVehicleErrorModalOpen] = useState(false);
  const [renewInsuranceData, setRenewInsuranceData] = useState(null);



  function validateDate(value: string) {
    if (!value) return false;

    const parsedDate = dayjs(value, 'MM-DD-YYYY', true); // true = strict parsing

    return parsedDate.isValid();
  }

  const validationSchema = yup.object().shape({
    medallionNumberId: yup
      .number()
      .typeError('Medallion must be a number.')
      .required('Medallion is required.'),

    vehicleId: yup
      .number()
      .typeError('Vehicle must be a number.')
      .required('Vehicle is required.'),

    requestDate: yup
      .string()
      .required('Request date is required.')
      .matches(
        /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
        'Date must be in MM-DD-YYYY format.'
      )
      .test(
        'valid-date',
        'Invalid date. Please provide a valid date in MM-DD-YYYY format.',
        validateDate
      ),
    attachmentFile: yup.string()
      .required('File is required.')
  });

  const { id, } = useParams();
  const navigate = useNavigate()
  const params = useQuery();
  const isCreate = window.location.pathname.includes('/create')

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError, getValues, trigger }: any = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });

  const breadCrumbList = [
    { title: <Link to="/">Dashboard</Link> },
    { title: <Link to="/insurances">Insurance</Link> },
    { title: id ? 'Edit' : 'Create' }
  ];

  useEffect(() => {
    if (id) {
      fetchInsuranceData();
    }
  }, [id]);

  useEffect(() => {
    if (watch('medallionNumberId')) {
      fetchMedallionData();
    } else {
      setValue('requestDate', null)
      setMedallionNumberSingleData({})

    }
  }, [watch('medallionNumberId')]);

  useEffect(() => {


    if (params.get('medallion_id') && params.get('page') == 'renew_insurance' && medallionNumberData.length > 0) {
      const fetchInsuranceRenewData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/insurances/${params.get('insurance_id')}`);
          const insuranceData = response.data.data.insurance;
          setRenewInsuranceData(insuranceData)
        } catch (error: any) {
          console.error("Error fetching insurance renew data:", error);
        } finally {
          setLoading(false);
        }
      };
      setValue('medallionNumberId', Number(params.get('medallion_id')))
      fetchInsuranceRenewData()
    }

  }, [params.get('medallion_id'), medallionNumberData])


  useEffect(() => {
    if (getValues('requestDate')) {
      calculatePrices();
      fetchCollisionRates();
      fetchPaceProgramRates();
    } else {
      setAffiliationPrices([]);
      setAffiliationCalculationPrices([]);
      setLiabilityCalculationPrices([]);
    }
  }, [watch('requestDate'), watch('effectiveDate'), medallionNumberSingleData]);

  const fetchCollisionRates = async () => {
    try {
      setLoading(true);

      const requestYear = dayjs(getValues("requestDate")).year();
      const vehicleYear = medallionNumberSingleData?.vehicle?.vehicleYear?.year;
      // if (!requestYear || !vehicleYear) {
      //     throw new Error("Invalid request or vehicle year");
      // }
      if (vehicleYear) {
        const response = await axios.get(`/collision-rates`, {
          params: {
            pageSize: 99999,
            forYear: requestYear,
            vehicleYear: vehicleYear,
          },
        });

        setCollisionRatesData(response?.data?.data || null);
      }

    } catch (error: any) {
      console.error("Error fetching collision rates:", error.message);
      message.error("Failed to fetch collision rates. Please try again.");
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
      console.error("Error fetching paceProgram rates:", error);
      message.error("Failed to fetch paceProgram rates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (medallionNumberSingleData?.id) {
      calculatePrices();
    }
  }, [medallionNumberSingleData?.id])


  const fetchInsuranceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/insurances/${id}`);
      const insuranceData = response.data.data.insurance;
      setValue('medallionNumberId', insuranceData?.medallion?.id)
      setData(insuranceData);
      Object.keys(insuranceData).forEach(key => {
        if (key == 'requestDate' || key == 'effectiveDate' || key == 'surrenderDate') {
          if (insuranceData[key]) {
            setValue(key, dayjs(insuranceData[key]).format('MM-DD-YYYY'));
          }
        } else {
          setValue(key, insuranceData[key]);
        }

      });
    } catch (error) {
      console.error("Error fetching insurance data:", error);
      message.error("Failed to fetch insurance data. Please try again.");
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
      if (!response.data.data.medallionNumber?.vehicle?.vehicleYear?.year) {
        setIsVehicleErrorModalOpen(true);
      }
    } catch (error: any) {
      console.error("Error fetching medallion data:", error);
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

    const year = startDate?.year();
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
    const totalPayableAffiliationAmount = affiliationCalculationPrices?.reduce((sum, item: any) => sum + item.payableAmount, 0) || 0;
    const totalAffiliationAmount = Number(affiliationPrices?.affiliation?.sellingPrice || 0);

    const totalPayableLiabilityAmount = liabilityCalculationPrices?.reduce((sum, item: any) => sum + item.payableAmount, 0) || 0;
    const totalLiabilityAmount = liabilityCalculationPrices?.reduce((sum, item: any) => sum + item.perAmount, 0) || 0;

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


  const onSubmit = async (data: Record<string, any>) => {
    setLoading(true);

    if (medallionNumberSingleData?.corporation?.isCmg) {
      setPaceProgramCalculation({});
    }

    if (params.get('insurance_id') && params.get('page') == 'renew_insurance') {
      data.insurance_id = params.get('insurance_id');
    }

    const isEditing = Boolean(id);
    const endpoint = isEditing ? `/insurances/${id}` : 'insurances/store';
    const method: 'post' | 'patch' = isEditing ? 'patch' : 'post';

    try {
      const response = await axios[method](endpoint, data);

      if (response.data.status === 1) {
        notification.success({
          message: 'Success',
          description: response.data.message,
        });
        // InsuranceExportService.exportMainData([response.data.data?.data]);
        navigate('/insurances');

      }
    } catch (error: any) {
      console.error('Unexpected Error:', error);
      if (error.response) {
        formFieldErrors(error, setError);
      } else {
        console.error('Unexpected Error:', error);
        notification.error({
          message: 'Error',
          description: 'An unexpected error occurred. Please try again.',
        });
      }
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
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    if (!isCreate && medallionNumberSingleData?.vehicle && !medallionNumberSingleData?.vehicle?.vehicleYear?.year) {
      setIsVehicleErrorModalOpen(true);
    }
  }, [medallionNumberSingleData])

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

  return (
    <>


      <Spin spinning={loading}>
        <Form
          name="insuranceForm"
          layout="vertical"
          autoComplete="off"
        >
          <Banner
            breadCrumb={breadCrumbList}
            title={
              <>
                {id ? "Edit Insurance" : "Create Insurance"} <Status status={data?.status} />
              </>
            }
            data={data}
            extraButton={
              <>
                <Col xs={24} sm={24} md={24} style={{ textAlign: 'end' }} >
                  {medallionNumberSingleData?.vehicle?.vehicleYear?.year &&
                    <Space size={[8, 16]}>
                      <Button type="primary" size="large" onClick={async () => {
                        const isValid = await trigger(); // yup validation run karega
                        if (isValid) {
                          setIsModalOpen(true);
                        } else {
                          console.log("Validation failed:", errors);
                        }
                      }}>
                        {id ? 'Save & Send Insurance' : 'Create Insurance'}
                      </Button>
                    </Space>
                  }
                </Col>
              </>
            }
          />
          <Row gutter={[16, 16]}>
            {/* Left Column */}
            <Col xs={24} lg={10}>
              <MedallionDetails
                control={control}
                errors={errors}
                setMedallionNumberData={setMedallionNumberData}
                medallionNumberData={medallionNumberData}
                medallionNumberSingleData={medallionNumberSingleData}
                setIsAffiliationPriceModalOpen={setIsAffiliationPriceModalOpen}
                insuranceData={data}
                setValue={setValue}
                renewInsuranceData={renewInsuranceData}
              />

              <PolicyDetails
                control={control}
                errors={errors}
                disabled={!medallionNumberSingleData.id}
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
                insuranceData={data}
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
          <ConfirmationModal
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onConfirm={handleSubmit(onSubmit)}
            loading={loading}
            setValue={setValue}
          />
        </Form>
      </Spin>
      {/* Affiliation Price Modal */}
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
    </>
  );
};

export default CreateOrEdit;