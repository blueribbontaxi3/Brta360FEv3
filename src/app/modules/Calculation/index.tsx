import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, DatePicker, Input, Modal, notification, Popconfirm, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import moment from 'moment';
import AdvanceTable from '../../molecules/AdvanceTable';
import { isPermission } from 'utils/helper';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Status from '@atoms/Status';
import _ from 'lodash';
import { PaymentTable } from './PaymentTable';
import { PaymentCalculator } from './PaymentCalculator';
import { PaymentCharts } from './PaymentCharts';

dayjs.extend(utc);
const { Text } = Typography;

const Calculation = () => {

  const [monthData, setMonthData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Row>
      <Col span={24}>
        <PaymentCalculator onCalculate={setMonthData} />

        <Button type='primary' onClick={showModal}>
          Chart
        </Button>

        <Modal width={'90%'} title="Chart" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <PaymentCharts data={monthData} />
        </Modal>
        <PaymentTable data={monthData} />
      </Col>
    </Row>
  );
};

export default Calculation;
