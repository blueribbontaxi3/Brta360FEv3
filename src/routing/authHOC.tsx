// withAuthorization.tsx
import React from 'react';
import { Result, Button, Spin } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import LocalStorageService from '../utils/localStorageService';
import { isAnyPermission } from '../utils/helper';
import SelectRole from '@modules/Dashboard/SelectRole';
import { useSelector } from 'react-redux';

interface Props {
    authPermission: any;
}

const withAuthorization = (Component: React.ComponentType<any>, requiredPermissions: string[], authPermission: any, authUserRole: any = null) => {
    const WrapperComponent: React.FC<Props> = (props) => {
        const navigate = useNavigate();

        const isAuthenticated: any = LocalStorageService.getAccessToken();
        const authUser: any = useSelector((state: any) => state?.user_login?.auth_user);

        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }

        if (!authUser) {
            return (
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin size="large" tip="Loading User Profile..." />
                </div>
            );
        }
        if (!isAnyPermission(authPermission, requiredPermissions)) {
            if (authUserRole && authUserRole?.length === 0) {
                return <SelectRole />;
            }
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary" onClick={() => navigate('/dashboard')}>Back Home</Button>}
                />
            );
        }

        return <Component {...props} />;
    };

    return <WrapperComponent authPermission={authPermission} />;
};

export default withAuthorization;
