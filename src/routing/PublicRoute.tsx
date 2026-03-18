import { Outlet, Navigate } from 'react-router-dom';
import LocalStorageService from '../utils/localStorageService';

const PublicRoute: React.FC<any> = (props: any) => {
    const isAuthenticated = LocalStorageService.getAccessToken();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}

export default PublicRoute;
