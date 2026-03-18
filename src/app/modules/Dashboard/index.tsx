import React, { useState } from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { Column, Line, Pie } from '@ant-design/charts';
import { useSelector } from 'react-redux';
import InsuranceChart from './InsuranceChart';
import axios from '../../../utils/axiosInceptor';
import { usdFormat } from 'utils/helper';
import { DashboardCard } from './DashboardCard';
import { DashboardInsuranceTotal } from './DashboardInsuranceTotal';
import { DashboardLiabilityTotal } from './DashboardLiabilityTotal';
import InsuranceActivitiesTable from './InsuranceActivitiesTable';
import { DashboardWorkmanCompTotal } from './DashboardWorkmanCompTotal';
const { Content } = Layout;

const Dashboard = () => {
  const authPermissions: any = useSelector(
    (state: any) => state?.user_login
  );
  let dashboardName = authPermissions?.auth_user?.data?.user?.name;



  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{dashboardName}</h1>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={4}>
            <DashboardInsuranceTotal />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <DashboardLiabilityTotal />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <DashboardWorkmanCompTotal type={'affiliation'} cardTitle={'Affiliation'} strokeColor={"#bdbc14"} />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <DashboardWorkmanCompTotal type={'workmanComp'} cardTitle={'Workman Comp'} strokeColor={"#00c8a1"} />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <DashboardWorkmanCompTotal type={'collision'} cardTitle={'Collision'} strokeColor={"#bdbc14"} />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <DashboardWorkmanCompTotal type={'pace_program'} cardTitle={'Pace Program'} strokeColor={"#bdbc14"} />
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Card size='small' title="Last 7 Days Activities" styles={{
              body: {
                padding: 0
              }
            }}>
              <InsuranceActivitiesTable />
            </Card>
          </Col>
          <Col xs={24} sm={24} lg={16}>
            <InsuranceChart />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
