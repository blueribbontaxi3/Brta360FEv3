import React, { useEffect, useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Space, theme } from 'antd';
import BaseHeader from '../atoms/Header';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import LeftSideBar from '../atoms/LeftSideBar';
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { notification } from 'antd';

const { Header, Content, Footer } = Layout;


const BaseLayout: React.FC<any> = (props: any) => {
    const { children, load }: any = props;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();


    const [token, setToken] = useState<string | null>(null);

    const antIcon = <LoadingOutlined spin />;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <LeftSideBar />
            <Layout>
                <Space direction="vertical" size="middle">
                    <BaseHeader />
                    <Content style={{ margin: '0 16px' }}>
                        {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb> */}
                        <React.Suspense fallback={
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                                <Spin size="large" />
                            </div>
                        }>
                            <Outlet />
                        </React.Suspense>
                        {/* {token ? <p>Notification token: {token}</p> : <p>No token yet</p>} */}

                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Blue Ribbon ©{new Date().getFullYear()}</Footer>
                </Space>
            </Layout>
        </Layout>
    );
};

export default BaseLayout;