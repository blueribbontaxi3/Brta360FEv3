import { Outlet, Navigate } from 'react-router-dom';
import LocalStorageService from '../utils/localStorageService';

const PrivateRoute: React.FC<any> = (props: any) => {
    const isAuthenticated = LocalStorageService.getAccessToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
