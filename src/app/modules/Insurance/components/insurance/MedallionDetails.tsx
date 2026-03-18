import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { DateField } from '@atoms/FormElement';
import MedallionNumberSelect from '@atoms/MedallionNumberSelect';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import _ from "lodash";
import MediaCard from '@pages/MediaManager/MediaCard';
const { Text, Link } = Typography;

export const MedallionDetails = ({ control, errors, setValue, setMedallionNumberData, medallionNumberData, medallionNumberSingleData, renewInsuranceData, insuranceData }: any) => {
  const [isRequestDate, setIsRequestDate] = useState(true)
  const [isEffectiveDate, setIsEffectiveDate] = useState(true)
  const [isSurrenderDate, setIsSurrenderDate] = useState(true)
  const [insuranceDate, setInsuranceDate]: any = useState(null)
  const isInsured = insuranceData?.status == 'insured'
  const isRequest = insuranceData?.status == 'request'
  const isFlatCancel = insuranceData?.status == 'flat_cancel';
  const isPreRequest = insuranceData?.status == 'pre_request'

  const isEdit = window.location.pathname.includes('/edit');
  const isCreate = window.location.pathname.includes('/create');
  useEffect(() => {

    if (isPreRequest) {
      setIsRequestDate(false)
      setIsEffectiveDate(true)
      setIsSurrenderDate(true)

    } else if (isFlatCancel) {
        setIsRequestDate(false)
        setIsEffectiveDate(true)
        setIsSurrenderDate(true)

      } else if (isRequest && !isEdit) {
        setIsRequestDate(true)
        setIsEffectiveDate(false)
        setIsSurrenderDate(true)
      } else if (isInsured && !isEdit) {
        setIsRequestDate(true)
        setIsEffectiveDate(true)
        setIsSurrenderDate(false)
      } if (isRequest && isEdit) {
        setIsRequestDate(false)
        setIsEffectiveDate(true)
      } else if (isInsured && isEdit) {
        setIsRequestDate(true)
        setIsEffectiveDate(false)
        setIsSurrenderDate(true)
      } else if (isCreate) {
        setIsRequestDate(false)
        setIsEffectiveDate(true)
        setIsSurrenderDate(true)
      }

    const dates: any[] = [];
    const coverageAllData = _.orderBy(insuranceData?.insuranceCoverage, ['id'], ['desc']);

    const collisionData = coverageAllData?.find((i: any) => i.type === 'collision');

    if (isInsured && collisionData && insuranceData?.collision == 'Added') {
      dates.push({ collision: collisionData?.startDate });
    } else if (isInsured && collisionData) {
      dates.push({ collision: collisionData?.endDate });
    }

    const workManCompData = coverageAllData?.find((i: any) => i.type === 'workmanComp');
    if (isInsured && workManCompData && insuranceData?.workmanComp == 'Added') {
      dates.push({ workmanComp: workManCompData?.startDate });
    } else if (isInsured && workManCompData) {
      dates.push({ workmanComp: workManCompData?.endDate });
    }

    const paceProgramData = coverageAllData?.find((i: any) => i.type === 'paceProgram');
    if (isInsured && paceProgramData && insuranceData?.paceProgram == 'Added') {
      dates.push({ paceProgram: paceProgramData?.startDate });
    } else if (isInsured && paceProgramData) {
      dates.push({ paceProgram: paceProgramData?.endDate });
    }
    const maxDate = dates.reduce((max, obj) => {
      const dateValue: any = Object.values(obj)?.[0]; // Extracting date from object
      return dateValue > max ? dateValue : max;
    }, "0000-00-00"); // Initial min value
    setInsuranceDate(maxDate);

  }, [medallionNumberSingleData?.id, insuranceData?.id])

  let medallionWithAssign = 'no';
  if (isEdit) {
    medallionWithAssign = 'yes'
  } else if (insuranceData?.id && (isRequest || isInsured)) {
    medallionWithAssign = 'yes'
  }
  return (
    <Card size="small" title={<span><SafetyCertificateOutlined /> Medallion Details</span>}>
      <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
        <MedallionNumberSelect
          control={control}
          errors={errors}
          setMedallionNumberData={setMedallionNumberData}
          medallionNumberData={medallionNumberData}
          colProps={{ xs: 24, sm: 24, md: 24, lg: 14, xl: 14, }}
          disabled={isRequestDate || isFlatCancel}
          medallionWithAssign={medallionWithAssign}
          renewInsuranceData={renewInsuranceData}
          insuranceData={insuranceData}
        />
        <Col xs={24} sm={12} md={4} lg={4} xl={4} style={{ display: 'inline-block', alignItems: "center", flexWrap: "wrap", alignContent: "center" }}>
          <MediaCard
            name="attachmentFile"
            buttonText="Upload Doc"
            allowedTypes={"images"}
            previewSize={'100px'}
            media_relations={((isRequest || isInsured) && !isEdit) ? [] : insuranceData?.media_relations}
            onChange={(media: any) => {
              setValue('attachmentFile', media)
            }}
          />
          <Text type="danger">
            {errors?.attachmentFile && errors?.attachmentFile?.message}
          </Text>
        </Col>
        {
          (!isInsured || (isEdit && isInsured)) &&

          <Col xs={24} sm={12} md={4} lg={4} xl={4} style={{ display: 'inline-block', alignItems: "center", flexWrap: "wrap", alignContent: "center" }}>
            <MediaCard
              name="liabilityFile"
              buttonText="Liability Doc"
              allowedTypes={"images"}
              previewSize={'100px'}
              media_relations={((isRequest || isInsured) && !isEdit) ? [] : insuranceData?.media_relations}
              onChange={(media: any) => {
                setValue('liabilityFile', media)
              }}
            />
            <Text type="danger">
              {errors?.liabilityFile && errors?.liabilityFile?.message}
            </Text>
          </Col>
        }
        {/* {(isRequest || (isEdit && isInsured)) && <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <MediaCard
            name="hardCardFile"
            buttonText="Upload Hard Card"
            allowedTypes={"images"}
            previewSize={'120px'}
            media_relations={insuranceData?.media_relations}
            onChange={(media: any) => {
              console.log("media", media)
              setValue('hardCardFile', media)
            }}
          />
        </Col>}
        {(isInsured && !isEdit) && <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <MediaCard
            name="surrenderFile"
            buttonText="Surrender File"
            allowedTypes={"images"}
            previewSize={'120px'}
            media_relations={insuranceData?.media_relations}
            onChange={(media: any) => {
              setValue('surrenderFile', media)
            }}
          />
        </Col>} */}

      </Row>
      <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>

          <DateField
            label="Request Date"
            fieldName="requestDate"
            control={control}
            iProps={{
              placeholder: "Request Date",
              size: "middle",
              format: "MM-DD-YYYY",
              disabledDate: (currentDate: any) => {
                if (renewInsuranceData?.status === "surrender" && renewInsuranceData?.surrenderDate) {

                  const requestYear = dayjs(renewInsuranceData?.surrenderDate).year();
                  return (
                    currentDate.startOf("day") <=
                    dayjs(renewInsuranceData?.surrenderDate).startOf("day")
                  );
                }
                return false; // Else sab allowed
              },
              // extra: renewInsuranceData?.surrenderDate && <Text type="warning">You cannot select a request date before the surrender date (<Text>{dayjs(renewInsuranceData?.surrenderDate).format("MM-DD-YYYY")}</Text>). Only dates after this date within the same year are allowed.`</Text>
            }}
            errors={errors}
            disabled={isRequestDate}
          />

        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <DateField
            label="Effective Date"
            fieldName="effectiveDate"
            control={control}
            iProps={{
              placeholder: "Effective Date",
              size: "middle",
              format: "MM-DD-YYYY",
              disabledDate: (currentDate: any) => {
                const requestYear = dayjs(insuranceData.requestDate).year();

                if (insuranceData.status === "request") {
                  return (
                    currentDate.startOf("day") < dayjs(insuranceData.requestDate).startOf("day") ||
                    currentDate.year() !== requestYear // Sirf requestDate ka year allow hoga
                  );
                }

                return (
                  currentDate.startOf("day") < dayjs(insuranceData.requestDate).startOf("day"));
              },
            }}
            errors={errors}
            disabled={isEffectiveDate}
          />


        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <DateField
            label="Surrender Date"
            fieldName="surrenderDate"
            control={control}
            iProps={{
              placeholder: "Surrender Date",
              size: "middle",
              format: "MM-DD-YYYY",
              disabledDate: (currentDate: any) => {
                const effectiveDate = insuranceData?.effectiveDate;
                const referenceDate = effectiveDate;
                const referenceYear = dayjs(referenceDate).year();
                // Insurance date logic
                if (insuranceDate && isInsured) {
                  return (
                    currentDate &&
                    (currentDate.year() !== referenceYear || currentDate.isBefore(dayjs(insuranceDate), "day"))
                  );
                }
                return (
                  currentDate &&
                  (currentDate.year() !== referenceYear || currentDate.isBefore(dayjs(referenceDate), "day"))
                );
              },
            }}
            errors={errors}
            disabled={isSurrenderDate}
          />
        </Col>
      </Row>
    </Card >
  )
}
