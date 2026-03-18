import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  DatePicker,
  Input,
  Button,
  Table,
  Collapse,
  Statistic,
  Row,
  Col,
  Progress,
  Spin,
  Cascader,
  ConfigProvider,
  Alert,
  Space,
  Divider,
  Typography,
  notification,
} from "antd";
import axios from "../../../utils/axiosInceptor";
import { MemberInfo } from "@modules/Insurance/components/insurance/MemberInfo";
import { CorporationInfo } from "@modules/Insurance/components/insurance/CorporationInfo";
import { VehicleInfo } from "@modules/Insurance/components/insurance/VehicleInfo";
import { calculateMonthlyData } from 'utils/paymentCalculator';
import InsurancePayableTable from "./InsurancePayableTable";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { DateField, InputField, InputNumberField, SelectField, TextAreaField } from "@atoms/FormElement";
import { filterSelectedMedallionMonths, formFieldErrors, parseNumber, usdFormat } from "utils/helper";
import * as yup from 'yup';
import _ from 'lodash';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { Text, Title } = Typography;

const { Option } = Select;
const { Panel } = Collapse;

const InsurancePayment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading]: any = useState(false);
  const [members, setMembers]: any = useState([]);
  const [calculationSummary, setCalculationSummary]: any = useState([]);
  const [data, setData]: any = useState([]);

  const [selectedMember, setSelectedMember]: any = useState(null);
  const [selectedCorporation, setSelectedCorporation]: any = useState(null);
  const [selectedMedallion, setSelectedMedallion]: any = useState(null);
  const [selectedDataRowKeys, setSelectedDataRowKeys] = useState<any[]>([]);
  const [detailedBreakdown, setDetailedBreakdown] = useState<Record<string, number>>({});
  const [payableAmountError, setPayableAmountError]: any = useState(false);
  const [totalPayableAmount, setTotalPayableAmount]: any = useState(0);
  const [mergedMedallionData, setMergedMedallionData] = useState<any[]>([]);
  const [insuranceIds, setInsuranceIds] = useState<any[]>([]);
  const [insuranceItemsData, setInsuranceItemsData] = useState<any[]>([]);
  const [corporationBalance, setCorporationBalance] = useState<any>(0);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {

    try {
      setLoading(true);
      const res = await axios.get("insurances-payment/member");
      setMembers(res?.data?.data?.results)
      setData(formatForCascader(res?.data?.data?.results) || []);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatForCascader = (data: any) => {
    return data.map((member: any) => ({
      value: member.id,
      label: member.fullName,
      children: member.corporation?.map((corp: any) => ({
        value: corp.id,
        label: corp.corporationName,
        children: corp.corpMedallion?.map((med: any) => ({
          value: med.id,
          label: med.medallionNumber.toString()
        })) || [],
      })) || [],
    }));
  };

  const onChange = (value: any, selectedOptions: any) => {
    setTotalPayableAmount(0)
    let memberId = value?.[0]
    let corporationId = value?.[1]
    let medallionId = value?.[2]
    setSelectedDataRowKeys([])
    let member = members.find((item: any) => item.id == memberId)
    setSelectedMember(member)
    let corporation = null;
    if (corporationId) {
      corporation = member?.corporation?.find((item: any) => item.id == corporationId)
      setValue('amount', null)
    }
    setSelectedCorporation(corporation)


    let medallionNumber;
    if (medallionId && corporation) {
      medallionNumber = corporation?.corpMedallion?.filter((item: any) => item.id == medallionId)
    } else {
      medallionNumber = corporation?.corpMedallion;
    }

    setSelectedMedallion(medallionNumber)
  };

  const paymentSchema = yup.object().shape({
    date: yup
      .date()
      .required("Date is required")
      .typeError("Invalid date format (MM-DD-YYYY expected)"),

    paymentType: yup
      .string()
      .required("Payment type is required"),

    amount: yup
      .number()
      .typeError("Amount must be a number")
      .transform((value, originalValue) => originalValue === "" ? undefined : value)
      .nullable()
      .test(
        "is-required-if-balance-low",
        "Amount is required",
        function (value: any) {
          const { corporationBalance, amountPayableExpectedMonth }: any = this.parent;
          const parsedBalance: any = parseFloat(corporationBalance || 0);
          const parsedPayable: any = parseFloat(amountPayableExpectedMonth || 0);
          const parsedValue: any = parseFloat(value || 0);

          // If balance is enough, amount is not required
          if (parsedBalance >= parsedPayable) return true;

          // Else amount is required
          return parsedValue > 0;
        }
      )
  });

  const { control, watch, clearErrors, handleSubmit, formState: { errors }, setValue, setError, getValues }: any = useForm({
    resolver: yupResolver(paymentSchema),
    mode: 'all',
    defaultValues: {},
  });

  // const fetchInsuranceCoverage = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get("/insurances/coverage", {
  //       params: {
  //         medallion_id: selectedMedallion?.id,
  //         medallion_number: selectedMedallion?.medallionNumber
  //       }
  //     });
  //     setCoverage(res?.data?.data?.results)
  //   } catch (err) {
  //     console.error("Error fetching coverage:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  useEffect(() => {
    const calculate = async () => {
      let allCoverageItems: any[] = [];

      if (!selectedMedallion) return false;
      // Step 1: Merge all insuranceCoverage across medallions
      selectedMedallion.forEach((medallion: any) => {
        const coverage = medallion?.insurances?.[0]?.insuranceCoverage || [];
        allCoverageItems.push(
          ...coverage.map((item: any) => ({
            ...item,
            medallionNumber: medallion?.medallionNumber,
          }))
        );
      });

      if (allCoverageItems.length === 0) return;

      // Step 2: Calculate monthly breakdowns
      const calculations = await Promise.all(
        allCoverageItems.map(async (item: any) => {
          const monthlyData = await calculateMonthlyData({
            startDate: item.startDate,
            endDate: item.endDate,
            amount: item.totalAmount,
          });

          return monthlyData.map((i: any) => ({
            ...i,
            type: item?.type,
            medallionNumber: item?.medallionNumber,
          }));
        })
      );

      const flattened = calculations.flat();

      // Step 3: Group by medallionId → month
      const groupedByMedallion: any = {};

      flattened.forEach(item => {
        const medallionNumber = item.medallionNumber;
        const month = item.month;
        const typeKey = item.type?.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '') || 'Unknown';

        // Init medallion group
        if (!groupedByMedallion[medallionNumber]) {
          groupedByMedallion[medallionNumber] = {};
        }

        // Init month group inside medallion
        if (!groupedByMedallion[medallionNumber][month]) {
          groupedByMedallion[medallionNumber][month] = {
            month,
            items: [],
            typeTotals: {},
            totalAmounts: 0,
            medallionNumber: medallionNumber,
            insuranceIds: insuranceIds

          };
        }

        // Add item
        groupedByMedallion[medallionNumber][month].items.push(item);

        // Sum payableAmount per type
        if (!groupedByMedallion[medallionNumber][month].typeTotals[typeKey]) {
          groupedByMedallion[medallionNumber][month].typeTotals[typeKey] = 0;
        }
        groupedByMedallion[medallionNumber][month].typeTotals[typeKey] += item.payableAmount || 0;
        groupedByMedallion[medallionNumber][month].totalAmounts += item.payableAmount || 0;


      });

      // Step 4: Convert grouped data into array format if needed
      const result = Object.entries(groupedByMedallion).map(([medallionNumber, months]: any) => ({
        medallionNumber,
        months: Object.values(months), // convert month objects to array
      }));
      setCalculationSummary(result);

      // Step 5: Total sum
      const totalPayableAmountSum = flattened.reduce(
        (sum, item) => sum + (item.payableAmount || 0),
        0
      );

      setTotalPayableAmount(totalPayableAmountSum);
    };

    calculate();
  }, [selectedMedallion]);


  useEffect(() => {
    //calculateSelectedMonth();

    let medallionNumbers = Object.keys(selectedDataRowKeys)?.map(id => +id);
    let medallionNumberData = selectedMedallion?.filter((item: any) => {
      return medallionNumbers?.includes(item.medallionNumber);
    }).map((item: any) => {
      return {
        medallionNumber: item.medallionNumber,
        insuranceId: item.insurances?.[0]?.id,
      }
    });


    if (selectedMedallion) {
      let insuranceData = selectedMedallion.map((item: any) => {
        return {
          medallionNumber: item.medallionNumber,
          insuranceId: item.insurances?.[0]?.id,
        }
      });

      setInsuranceIds(insuranceData)
    }
    
    let selectedMedallionSummaryData = filterSelectedMedallionMonths(calculationSummary, selectedDataRowKeys);

    const merged = selectedMedallionSummaryData.map(flatItem => {
      const matched = medallionNumberData.find(
        (m: any) => {
          return parseInt(m.medallionNumber) === parseInt(flatItem.medallionNumber)
        }
      );

      return {
        ...flatItem,
        insuranceId: matched.insuranceId
      }
    });


    setMergedMedallionData(merged)

  }, [selectedDataRowKeys]);


  const fetchInsurancePaymentItems = async () => {
    try {
      setLoading(true);

      const ids = insuranceIds.map((item: any) => item.insuranceId); // Extract only insuranceId
      const res = await axios.get("insurances-payment/items", {
        params: { insuranceIds: ids } // Correct way to send array in query string
      });

      setInsuranceItemsData(res.data?.data?.items);

    } catch (err) {
      console.error("Error fetching insurance payment items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (insuranceIds && insuranceIds.length > 0) {
      fetchInsurancePaymentItems()
    }
  }, [insuranceIds])

  const fetchCorporationBalance = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`insurances-payment/balance/${selectedCorporation?.id}`);
      setCorporationBalance(res?.data?.data?.balance)
      setValue('balance', res?.data?.data?.balance)
      setValue('corporationBalance', res?.data?.data?.balance)
    } catch (err) {
      console.error("Error fetching corporation balance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCorporation?.id) {
      fetchCorporationBalance()
    }
  }, [selectedCorporation])

  const isPaidByMonthAndInsurance = (month: string, medallionNumber: number): boolean => {
    return insuranceItemsData.some(
      (item: any) => item.month === month && item.medallionNumber === medallionNumber
    );
  };




  const getTotalAmountSum = (data: any[]) => {
    return data.reduce((acc, medallion) => {
      const monthSum = medallion.months.reduce((monthAcc: number, monthItem: any) => {
        return monthAcc + (monthItem.totalAmounts || 0);
      }, 0);
      return acc + monthSum;
    }, 0);
  };


  useEffect(() => {
    let grandTotal = getTotalAmountSum(mergedMedallionData);
    setValue('amountPayableExpectedMonth', usdFormat(grandTotal, false));

  }, [mergedMedallionData])


  const calculateSelectedMonth = () => {
    const filteredData = calculationSummary.filter((item: any) =>
      selectedDataRowKeys.includes(item.month)
    );

    let grandTotal = 0;
    let detailedSums: Record<string, number> = {};

    filteredData.forEach((item: any) => {
      Object.entries(item.typeTotals).forEach(([key, value]: [string, any]) => {
        detailedSums[key] = (detailedSums[key] || 0) + value;
        grandTotal += value;
      });
    });

    setValue('amountPayableMonth', usdFormat(grandTotal, false));
    setValue('amountPayableExpectedMonth', usdFormat(grandTotal, false));
    setValue('payableSelectAmount', filteredData);
    // setValue('balance', usdFormat(grandTotal, false));
    // setDetailedBreakdown(detailedSums); // optional: to store per-key breakdown in a state
  }
  useEffect(() => {
    const payableAmount: any = parseNumber(getValues('amountPayableExpectedMonth') || '0');
    const enteredAmount: any = parseNumber(getValues('amount') || '0');
    const defaultBalance: any = parseNumber(corporationBalance || '0'); // <- Default balance
    const selectedRowKeysLength = Object.keys(selectedDataRowKeys).length;

    const totalAvailable = enteredAmount + defaultBalance;
    const remaining = totalAvailable - payableAmount;

    if (selectedRowKeysLength === 0) {
      clearErrors('amount');
      if (selectedMedallion) {
        setPayableAmountError(`Please select at-least one month`);
      } else {
        setPayableAmountError(false);
      }
      setValue('amountRemaining', usdFormat(0, false));
      setValue('balance', usdFormat(remaining, false));
      return;
    }

    if (totalAvailable < payableAmount) {
      // Underpaid
      setValue('amountRemaining', usdFormat(Math.abs(remaining), false));
      setPayableAmountError(`Amount + balance should be at least ${usdFormat(payableAmount, false)}`);
      setValue('balance', usdFormat(0, false));
    } else {
      // Correct or Overpaid
      clearErrors('amount');
      if (selectedMedallion && selectedRowKeysLength == 0) {
        setPayableAmountError(`Please select at-least one month`);
      } else {
        setPayableAmountError(false);
      }
      setValue('amountRemaining', usdFormat(0, false));
      setValue('balance', usdFormat(remaining, false)); // Remaining becomes future balance
    }
  }, [watch('amount'), mergedMedallionData]);




  useEffect(() => {
    console.log("errors", errors)
  }, [errors])

  const flattenMedallionMonths = (data: any) => {
    return data.flatMap((medallion: any) => {
      return medallion.months.map((monthData: any) => ({
        ...monthData,
        insuranceId: medallion.insuranceId,
        medallionNumber: parseInt(medallion.medallionNumber), // Ensure it's a number
      }));
    });
  };


  const filter = (inputValue: string, path: any) =>
    path.some(
      (option: any) =>
        option?.label?.toLowerCase()?.indexOf(inputValue?.toLowerCase()) > -1
    );

  const onSubmit = (data: any) => {
    data.payableAmount = parseNumber(data.amountPayableExpectedMonth)
    data.balance = parseNumber(data.balance);
    data.date = dayjs(data.date).format('YYYY-MM-DD');
    data.memberId = selectedMember.id;
    data.corporationId = selectedCorporation.id;

    let mergeData = { ...data, ...{ item: flattenMedallionMonths(mergedMedallionData) } };

    axios.post(`insurances-payment`, mergeData).then((r) => {
      setLoading(false)
      if (r.data.status === 1) {
        notification.success({
          message: 'Success',
          description: r.data.message,
          duration: 5,
        });
      }
    }).catch((e) => {
      formFieldErrors(e, setError)
      setLoading(false)
    });


    // data.amountPayableMonth = parseFloat(usdFormat(data.amountPayableMonth, false))
    // data.balance = parseFloat(usdFormat(data.balance, false))
    // data.amountRemaining = parseFloat(usdFormat(data.amountRemaining, false))
    // console.log("===========", data)
  };


  return (
    <Card title="Insurance Payment" bordered={false}>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" style={{ marginBottom: 24 }} onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col xs={24} sm={12}  lg={6}>
              <Form.Item label="Member / Corporation / Medallion">
                <ConfigProvider
                  theme={{
                    components: {
                      Cascader: {
                        dropdownHeight: 300
                      },
                    },
                  }}
                >
                  <Cascader
                    allowClear
                    options={data}
                    onChange={onChange}
                    placeholder="Please select"
                    showSearch={{ filter }}
                    onSearch={(value) => console.log(value)}
                    changeOnSelect={true}
                  // dropdownRender={customDropdownRender}
                  />

                </ConfigProvider>

              </Form.Item>

              <label style={{ fontWeight: 500 }}>Total  Amount</label>
              <Statistic
                value={usdFormat(totalPayableAmount)}
                precision={2}
                valueRender={(value: any) => {
                  return <Title style={{ marginTop: 0, color: '#047857' }}>{value}</Title>
                }}
              />
            </Col>
            <Col xs={24}  sm={12}  lg={6}>
              <MemberInfo data={selectedMember} />
            </Col>
            <Col xs={24} sm={12}  lg={6}>
              <CorporationInfo data={selectedCorporation} />
            </Col>
            <Col xs={24} sm={12}  lg={6}>
              <VehicleInfo data={selectedMedallion?.vehicle} />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            {Object.entries(detailedBreakdown).map(([key, value]) => (
              <Col key={key} xs={24} sm={12}  lg={6}>
                <Card title={_.capitalize(key)} bordered={false}>
                  {usdFormat(value)}
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}  lg={6}>
              <DateField
                label="Date"
                fieldName={`date`}
                control={control}
                iProps={{
                  placeholder: "Select Date",
                  size: "medium",
                  format: "MM-DD-YYYY"
                }}
                errors={errors}
              />
            </Col>
            <Col xs={24} sm={12}  lg={5}>
              <SelectField
                label="Payment Type"
                fieldName="paymentType"
                allowClear={true}
                control={control}
                iProps={{
                  placeholder: 'Select Payment Type',
                }}
                errors={errors}
                options={
                  [
                    {
                      value: 'Cash',
                      label: 'Cash',
                    },
                    {
                      value: 'Cheque',
                      label: 'Cheque',
                    },
                    {
                      value: 'Credit Card',
                      label: 'Credit Card',
                    }
                  ]
                }
              />
            </Col>
            <Col xs={24} sm={12}  lg={4}>
              <InputNumberField
                label="Amount"
                fieldName={`amount`}
                control={control}
                iProps={{ placeholder: "Enter Amount", addonBefore: "$", min: 0 }}
                errors={errors}
              />
            </Col>
            <Col xs={24} sm={12}  lg={3}>
              <InputField
                label="Remaining"
                fieldName="amountRemaining"
                control={control}
                iProps={{
                  placeholder: "Remaining amount",
                  addonBefore: "$",
                  disabled: true
                }}
                errors={errors}
              />
            </Col>
            <Col xs={24} sm={12}  lg={3}>
              <div style={{ marginTop: 22 }}>
                <label style={{ fontWeight: 500 }}>Payable Amount</label>
                <Statistic
                  value={watch("amountPayableExpectedMonth")}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#3f8600', fontSize: 18 }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12}  lg={3}>
              <div style={{ marginTop: 22 }}>
                <label style={{ fontWeight: 500 }}>Balance</label>
                <Statistic
                  value={watch("balance")}
                  precision={2}
                  prefix="$"
                  valueStyle={{ color: '#3f8600', fontSize: 18 }}
                />
              </div>
            </Col>
            {/* <Col span={3}>
              <Text>✅ <strong>Selected Months:</strong> {selectedRowKeys.join(', ')}</Text><br />
            </Col> */}
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <TextAreaField
                label="Remarks"
                fieldName="remarks"
                control={control}
                errors={errors}
              />
            </Col>
          </Row>
          {payableAmountError && <><Alert message={payableAmountError} type="error" />          <Divider /></>
          }

          {
            !payableAmountError && <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">Submit</Button>
              </Col>
            </Row>
          }
        </Form>

        {
          selectedMedallion?.length > 0 &&
          <>
            <Collapse accordion>
              {selectedMedallion.map((med: any) => (
                <Panel header={`Medallion No: ${med?.medallionNumber}`} key={med?.medallionNumber}
                // extra={selectedDataRowKeys?.[med?.medallionNumber]?.months?.join(', ')}
                >
                  <InsurancePayableTable
                    medallionNumber={med?.medallionNumber}
                    data={calculationSummary}
                    setSelectedDataRowKeys={setSelectedDataRowKeys}
                    isPaidByMonthAndInsurance={isPaidByMonthAndInsurance}
                  />
                </Panel>
              ))}
            </Collapse>
            <Divider />
          </>
        }
      </Spin>
    </Card >
  );
};

export default InsurancePayment;