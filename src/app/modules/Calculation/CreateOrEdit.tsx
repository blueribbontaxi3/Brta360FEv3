import React, { useEffect, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, InputNumber, Row, Space, Spin, Table, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Banner from '../../molecules/Banner';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InputField, InputPassword, SelectField, TextAreaField } from '../../atoms/FormElement';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../../../utils/axiosInceptor';
import ImageUpload from '../../molecules/Image/ImageUpload';
import { formFieldErrors } from 'utils/helper';
import AdvanceTable from '@molecules/AdvanceTable';

const CreateOrEdit = (props: any) => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const breadCrumbList: any = [
    {
      title: (
        <>
          <Link to="/">
            <HomeOutlined />
            <span>Dashboard</span>
          </Link>
        </>
      ),
    },
    {
      title: (<Link to="/service-requests">Book Amenities</Link>),
    }
  ];

  const schema = yup
    .object()
    .shape({
      // status: yup.string().required('Status  is a required field'),
    })
    .required();

  const { control, watch, handleSubmit, formState: { errors }, setValue, setError }: any = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setLoading(true)

  }

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      fixed: 'left',
    },
    {
      title: 'Per Amount',
      dataIndex: 'perAmount',
      key: 'perAmount',
    },
    {
      title: 'Total Days',
      dataIndex: 'totalDays',
      key: 'totalDays',
    },
    {
      title: 'Per Day Amount',
      dataIndex: 'perDayAmount',
      key: 'perDayAmount',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Payable Amount',
      dataIndex: 'payableAmount',
      key: 'payableAmount',
    },
    {
      title: 'Payable Days Count',
      dataIndex: 'payableDaysCount',
      key: 'payableDaysCount',
    },
    {
      title: 'Payable Start Date',
      dataIndex: 'payableStartDate',
      key: 'payableStartDate',
    },
    {
      title: 'Payable End Date',
      dataIndex: 'payableEndDate',
      key: 'payableEndDate',
    },
  ];

  const monthData: any = [
    {
      key: '1',
      month: 'January',
      perAmount: 0,
      totalDays: 31,
      perDayAmount: 0,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      payableAmount: 0,
      payableDaysCount: 0,
      payableStartDate: 0,
      payableEndDate: 0,
    },
    // ... Add other months similarly
  ];

  return (
    <>
      {/* <Banner breadCrumb={breadCrumbList} title="Calculation" /> */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card style={{ marginBottom: '20px' }}>
              <Row gutter={16}>
                <Col span={6}>
                  <DatePicker placeholder="Start Date" style={{ width: '100%' }} />
                </Col>
                <Col span={6}>
                  <DatePicker placeholder="End Date" style={{ width: '100%' }} />
                </Col>
                <Col span={6}>
                  <InputNumber placeholder="Amount" style={{ width: '100%' }} />
                </Col>
                <Col span={6}>
                  <Button type="primary" style={{ width: '100%' }}>Calculate</Button>
                </Col>
              </Row>
            </Card>
            <Card>
              {/* <AdvanceTable
                data={monthData}
                loading={loading}
                columns={columns}
                setTableParams={setTableParams}
                tableParams={tableParams}
                handleTableChange={handleTableChange}
                handelDateRange={handelDateRange}
              /> */}
            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default CreateOrEdit;
