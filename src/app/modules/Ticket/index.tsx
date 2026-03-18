import React, { useEffect, useState } from 'react';
import { Card, notification, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import Banner from '../../molecules/Banner';
import axios from '../../../utils/axiosInceptor';
import { isPermission } from 'utils/helper';
import { useSelector } from 'react-redux';
import KanbanBoard from './components/KanbanBoard';

const Ticket = () => {
  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );

  return (
    <>
      <Banner
        title="Tickets"
        breadCrumb={[
          { title: "Home", path: "/" },
          { title: "Tickets" },
        ]}
        buttonTitle={'Create'}
        buttonUrl={'/ticket/create'}
        permission={'Tickets Create'}
      />
      <Card bodyStyle={{ padding: '0 16px' }}>
        <KanbanBoard />
      </Card>
    </>
  );
};

export default Ticket;
