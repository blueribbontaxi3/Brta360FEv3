import React from 'react';
import { Badge, Card, Col, Row, Space, Spin, Tag, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import WorkmanComp from './WorkmanComp';
import Collision from './Collision';
import PaceProgram from './PaceProgram';
import _ from "lodash";
import { Link } from 'react-router-dom';

export const InsuranceOptions = (props: any) => {
  const isCreate = window.location.pathname.includes('/create')
  const isEdit = window.location.pathname.includes('/edit')
  const isFlatCancel = props?.insuranceData?.status == 'flat_cancel';
  const isMedallionSingleData = props?.medallionNumberSingleData?.id;
  const isCoverageData = props?.insuranceData?.insuranceCoverage?.length > 0;
  const isCollisionRatesData = props?.collisionRatesData?.items?.length > 0;
  let isCollisionLoading = isMedallionSingleData && isCoverageData && isCollisionRatesData

  if (isCreate || isFlatCancel) {
    isCollisionLoading = true
  }

  if (props?.collisionRatesData?.items?.length == 0) {
    isCollisionLoading = false
  }

  const workmanCompAllData = _.orderBy(props?.insuranceData?.insuranceCoverage, ['id'], ['desc'])?.filter((i: any) => i.type === 'workmanComp');
  const workmanCompLastData = workmanCompAllData?.[0];
  let workmanCompSecondLastData = workmanCompAllData?.[1];
  if (props?.insuranceData?.workmanComp == null) {
    workmanCompSecondLastData = workmanCompAllData?.[0];
  }

  const collisionAllData = _.orderBy(props?.insuranceData?.insuranceCoverage, ['id'], ['desc'])?.filter((i: any) => i.type === 'collision');
  const collisionLastData = collisionAllData?.[0];
  let collisionSecondLastData = collisionAllData?.[1];
  if (props?.insuranceData?.collision == null) {
    collisionSecondLastData = collisionAllData?.[0];
  }

  const paceProgramAllData = _.orderBy(props?.insuranceData?.insuranceCoverage, ['id'], ['desc'])?.filter((i: any) => i.type === 'paceProgram');
  const paceProgramLastData = paceProgramAllData?.[0];
  let paceProgramSecondLastData = paceProgramAllData?.[1];
  if (props?.insuranceData?.paceProgram == null) {
    paceProgramSecondLastData = paceProgramAllData?.[0];
  }

  return (

    <Card size="small" extra={<Space>
      <Tag icon={<CheckCircleOutlined />} color="success">Liability</Tag>
      <Tag icon={<CheckCircleOutlined />} color="success">Affiliation</Tag>
    </Space>} title={<span><CheckCircleOutlined /> Insurance Options</span>}>
      <Space direction="vertical" style={{ width: '100%' }}>

        <Row gutter={[8, 8]}>


          <Col xs={24} sm={24} md={24}>
            <WorkmanComp
              {...props}
              isCreate={isCreate}
              isEdit={isEdit}
              workmanCompLastData={workmanCompLastData}
              workmanCompAllData={workmanCompAllData}
              workmanCompSecondLastData={workmanCompSecondLastData}
            />
          </Col>

          <Col xs={24} sm={24} md={12}>
            {
              (!isCollisionLoading) ? (
                <Spin spinning={isCollisionLoading}>
                  <div style={{ height: "100px" }}>
                    {isCollisionRatesData ? (
                      "Collision Loading..."
                    ) : (
                      <Typography.Text type="danger">
                        Collision coverage can’t be added because the collision rates are not available
                        for the selected vehicle year or insurance year.{" "}
                        <Link to="/collision-rates/create" style={{ marginLeft: 5 }}>
                          Add Collision Rate
                        </Link>
                      </Typography.Text>
                    )}
                  </div>
                </Spin>
              ) : (
                <Collision
                  {...props}
                  isCreate={isCreate}
                  isEdit={isEdit}
                  collisionLastData={collisionLastData}
                  collisionAllData={collisionAllData}
                  collisionSecondLastData={collisionSecondLastData}
                />
              )
            }


            {/* {
              isCollisionRatesData ?
                <>

                </> : <Spin spinning={false}>
                  <div style={{ height: '100px' }}>
                   
                  </div>
                </Spin>
            } */}
          </Col>
          {props?.medallionNumberSingleData?.corporation?.isCmg == false && props?.paceProgramRatesData?.items?.length > 0 && <Col xs={24} sm={24} md={12}>

            <PaceProgram
              {...props}
              isCreate={isCreate}
              isEdit={isEdit}
              paceProgramLastData={paceProgramLastData}
              paceProgramAllData={paceProgramAllData}
              paceProgramSecondLastData={paceProgramSecondLastData}
            />
          </Col>}

        </Row>
      </Space>
    </Card>
  )
}