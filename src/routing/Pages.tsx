import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from '../app/pages/Auth/Login';
import DashboardPage from '../app/pages/Dashboard';
import LocalStorageService from '../utils/localStorageService';
import BaseLayout from '../app/pages/Layout';
import ErrorPage from '../app/pages/ErrorPage';
import { useEffect, useState, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Result } from 'antd';
import withAuthorization from './authHOC';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from '../utils/axiosInceptor';

// Lazy load heavy components
const UserGuidePage = lazy(() => import('app/pages/UserGuide'));
const RolePage = lazy(() => import('../app/pages/Role'));
const UserPage = lazy(() => import('../app/pages/User'));
const ProfilePage = lazy(() => import('../app/pages/Profile'));
const UserCreateOrEditPage = lazy(() => import('../app/pages/User/CreateOrEdit'));
const MemberPage = lazy(() => import('../app/pages/Member'));
const MemberCreateOrEditPage = lazy(() => import('app/modules/Member/CreateOrEdit'));
const RoleCreateOrEditPage = lazy(() => import('app/pages/Role/CreateOrEdit'));
const CorporationPage = lazy(() => import('app/pages/Corporation'));
const CorporationCreateOrEditPage = lazy(() => import('app/pages/Corporation/CreateOrEdit'));
const MedallionCreateOrEditPage = lazy(() => import('@pages/Medallion/CreateOrEdit'));
const MedallionPage = lazy(() => import('@pages/Medallion'));
const VehiclePage = lazy(() => import('@pages/Vehicles'));
const VehicleCreateOrEditPage = lazy(() => import('@pages/Vehicles/CreateOrEdit'));
const AffiliationsPage = lazy(() => import('../app/pages/Affiliations'));
const AffiliationsCreateOrEditPage = lazy(() => import('@pages/Affiliations/CreateOrEdit'));
const CollisionRatesPage = lazy(() => import('@pages/CollisionRates'));
const CollisionRatesCreateOrEditPage = lazy(() => import('@pages/CollisionRates/CreateOrEdit'));
const CalculationPage = lazy(() => import('../app/pages/Calculation'));
const InsurancePage = lazy(() => import('@pages/Insurance'));
const InsuranceCreateOrEditPage = lazy(() => import('@pages/Insurance/CreateOrEdit'));
const InsuranceBalancePage = lazy(() => import('@pages/Insurance/InsuranceBalancePage'));
const DiscountPage = lazy(() => import('@pages/Discount'));
const DiscountCreateOrEditPage = lazy(() => import('@pages/Discount/CreateOrEdit'));
const PaceProgramRatePage = lazy(() => import('@pages/PaceProgramRate'));
const PaceProgramRateCreateOrEditPage = lazy(() => import('@pages/PaceProgramRate/CreateOrEdit'));
const MediaManagerPage = lazy(() => import('@pages/MediaManager'));
const CreateMediaManagerPage = lazy(() => import('@pages/MediaManager/Create'));
const TransponderPage = lazy(() => import('@pages/Transponder'));
const TransponderCreateOrEditPage = lazy(() => import('@pages/Transponder/CreateOrEdit'));
const InsurancePayment = lazy(() => import('@modules/InsurancePayment'));
const InsuranceRenew = lazy(() => import('@modules/InsuranceRenew'));
const DriverCreateOrEditPage = lazy(() => import('@pages/Driver/CreateOrEdit'));
const DriverPage = lazy(() => import('@pages/Driver'));
const DriverForm = lazy(() => import('@pages/DriveForm'));
const DatabaseImportExport = lazy(() => import('@pages/DatabaseSetting'));
const TaxCalculationVehicle = lazy(() => import('@modules/Vehicle/TaxCalculation'));
const TaxRatePage = lazy(() => import('@pages/TaxRate'));
const TaxRateCreateOrEditPage = lazy(() => import('@pages/TaxRate/CreateOrEdit'));
const Register = lazy(() => import('@pages/Auth/Register'));
const TicketPage = lazy(() => import('@pages/Ticket'));
const CreateOrEdit = lazy(() => import('@modules/Ticket/CreateOrEdit'));
const OtpVerificationPage = lazy(() => import('@pages/Auth/Otp'));
const ForgotPasswordPage = lazy(() => import('../app/pages/Auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../app/pages/Auth/ResetPassword'));
const VendorPage = lazy(() => import('@pages/Vendor'));
const VendorCreateOrEditPage = lazy(() => import('@pages/Vendor/CreateOrEdit'));

// Preload critical routes after login to improve navigation speed
const preloadRoutes = () => {
  // Small delay to not block initial render
  setTimeout(() => {
    // Preload most frequently used routes
    import('../app/pages/Member');
    import('app/modules/Member/CreateOrEdit');
    import('app/pages/Corporation');
    import('app/pages/Corporation/CreateOrEdit');
    import('@pages/Medallion');
    import('@pages/Medallion/CreateOrEdit');
    import('@pages/Insurance');
    import('@pages/Insurance/CreateOrEdit');
    import('@pages/Vehicles');
    import('@pages/Vehicles/CreateOrEdit');
  }, 1000);
};

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === ''
let clientId = '804069332719-o1ahlu5fglbsc99f6dajtgp7vrahrh44.apps.googleusercontent.com';
if (isLocalhost) {
  clientId = '342494956964-k822b7ikq57cck2d8n3jfgicl4u3jib3.apps.googleusercontent.com';
}

function Routes() {
  const isAuthenticated = LocalStorageService.getAccessToken();
  const loginPage = <GoogleOAuthProvider clientId={clientId}>
    < Login /></GoogleOAuthProvider>;
  const registerPage = <GoogleOAuthProvider clientId={clientId}>
    < Register /></GoogleOAuthProvider>;

  const dispatch: any = useDispatch();
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`auth/profile`).then((r: any) => {
        dispatch({
          type: 'LOGIN_USER',
          data: r.data,
        });
        let roles = r.data?.data?.user?.roles || []; // Ensure roles is always an array
        const permissionNames = roles.flatMap((role: any) => role.permissions?.map((permission: any) => permission.name) || []);
        dispatch({
          type: 'LOGIN_USER_PERMISSION',
          data: permissionNames,
        });
        const roleNames = roles.map((role: any) => role.name);

        dispatch({
          type: 'LOGIN_USER_ROLE',
          data: roleNames,
        });
        dispatch({
          type: 'LOGIN_USER_MEMBER',
          data: roleNames.includes('Member'),
        });

        dispatch({
          type: 'LOGIN_USER_SUPER_ADMIN',
          data: roleNames.includes('Super Admin'),
        });

        localStorage.setItem('brta360_user', JSON.stringify(r.data?.data));

        // Preload critical routes after successful login
        preloadRoutes();
      }).catch((e: any) => {
        console.error("Error fetching profile:", e);
      });
    }
  }, [isAuthenticated]);


  const authUser: any = useSelector(
    (state: any) => state?.user_login?.auth_user,
  );

  const authUserRole: any = useSelector(
    (state: any) => state?.user_login?.auth_role,
  );
  useEffect(() => {
    setPermissions(authUser?.data?.roles?.[0]?.permissions)
  }, [authUser])


  useEffect(() => {
    dispatch({
      type: 'LOGIN_USER_PERMISSION',
      data: permissions,
    });
  }, [permissions])

  const authPermission: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );
  const authRole: any = useSelector(
    (state: any) => state?.user_login?.auth_role
  );
  const Logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('brta360_user');
    localStorage.removeItem('brta360_admin');
    // Redirect to login page
    window.location.href = '/login';
    return null; // No UI for logout, redirect happens immediately
  };

  const element = createBrowserRouter([
    {
      path: "/",
      element: !isAuthenticated ? loginPage : <Navigate to="/dashboard" />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: !isAuthenticated ? loginPage : <Navigate to="/dashboard" />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/register",
      element: !isAuthenticated ? registerPage : <Navigate to="/dashboard" />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/otp-verify/:token",
      element: !isAuthenticated ? <OtpVerificationPage /> : <Navigate to="/dashboard" />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/forgot-password",
      element: !isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/reset-password",
      element: !isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/dashboard" />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/drive-registration",
      element: <DriverForm />,
    },
    {
      path: "/user-guide",
      element: <UserGuidePage />,
    },
    {
      element: <BaseLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/dashboard",
          element: withAuthorization(DashboardPage, ['Dashboard List'], authPermission, authUserRole),
        },

        {
          path: "/roles",
          element: withAuthorization(RolePage, ['Roles List'], authPermission)
        },
        {
          path: "/roles/create",
          element: withAuthorization(RoleCreateOrEditPage, ['Roles Create'], authPermission)
        },
        {
          path: "/roles/edit/:id",
          element: withAuthorization(RoleCreateOrEditPage, ['Roles Update'], authPermission),
        },
        {
          path: "/users",
          element: withAuthorization(UserPage, ['Users List'], authPermission),
        },
        {
          path: "/users/create",
          element: withAuthorization(UserCreateOrEditPage, ['Users Create'], authPermission),
        },
        {
          path: "/users/edit/:id",
          element: withAuthorization(UserCreateOrEditPage, ['Users Update'], authPermission),
        },
        {
          path: "/profile/",
          element: <ProfilePage />,

          // element: (
          //   !isAuthenticated ? loginPageRedirection : <ProfilePage />
          // ),
        },
        {
          path: "/members",
          element: withAuthorization(MemberPage, ['Members List'], authPermission),
        },
        {
          path: "/member/create",
          element: withAuthorization(MemberCreateOrEditPage, ['Members Create'], authPermission)
        },
        {
          path: "/member/edit/:id",
          element: withAuthorization(MemberCreateOrEditPage, ['Members Update'], authPermission),
        },
        {
          path: "/corporations",
          element: withAuthorization(CorporationPage, ['Corporations List'], authPermission),
        },
        {
          path: "/corporation/create",
          element: withAuthorization(CorporationCreateOrEditPage, ['Corporations Create'], authPermission)
        },
        {
          path: "/corporation/edit/:id",
          element: withAuthorization(CorporationCreateOrEditPage, ['Corporations Update'], authPermission),
        },
        {
          path: "/medallions",
          element: withAuthorization(MedallionPage, ['Medallions List'], authPermission),
        },
        {
          path: "/medallion/create",
          element: withAuthorization(MedallionCreateOrEditPage, ['Medallions Create'], authPermission)
        },
        {
          path: "/medallion/edit/:id",
          element: withAuthorization(MedallionCreateOrEditPage, ['Medallions Update'], authPermission),
        },
        {
          path: "/vehicles",
          element: withAuthorization(VehiclePage, ['Vehicles List'], authPermission),
        },
        {
          path: "/vehicle/create",
          element: withAuthorization(VehicleCreateOrEditPage, ['Vehicles Create'], authPermission)
        },
        {
          path: "/vehicle/edit/:id",
          element: withAuthorization(VehicleCreateOrEditPage, ['Vehicles Update'], authPermission),
        },
        {
          path: "/vehicles-tax-calculation",
          element: withAuthorization(TaxCalculationVehicle, ['GroundTax List'], authPermission),
        },
        {
          path: "/affiliations",
          element: withAuthorization(AffiliationsPage, ['Affiliations List'], authPermission),
        },
        {
          path: "/affiliation/create",
          element: withAuthorization(AffiliationsCreateOrEditPage, ['Affiliations Create'], authPermission)
        },
        {
          path: "/affiliation/edit/:id",
          element: withAuthorization(AffiliationsCreateOrEditPage, ['Affiliations Update'], authPermission),
        },
        {
          path: "/collision-rates",
          element: withAuthorization(CollisionRatesPage, ['CollisionRates List'], authPermission),
        },
        {
          path: "/collision-rates/create",
          element: withAuthorization(CollisionRatesCreateOrEditPage, ['CollisionRates Create'], authPermission)
        },
        {
          path: "/collision-rates/edit/:id",
          element: withAuthorization(CollisionRatesCreateOrEditPage, ['CollisionRates Update'], authPermission),
        },
        {
          path: "/transponder",
          element: withAuthorization(TransponderPage, ['Transponder List'], authPermission),
        },
        {
          path: "/transponder/create",
          element: withAuthorization(TransponderCreateOrEditPage, ['Transponder Create'], authPermission)
        },
        {
          path: "/transponder/edit/:id",
          element: withAuthorization(TransponderCreateOrEditPage, ['Transponder Update'], authPermission),
        },
        {
          path: "/insurances",
          element: withAuthorization(InsurancePage, ['Insurance List'], authPermission),
        },
        {
          path: "/insurance/create",
          element: withAuthorization(InsuranceCreateOrEditPage, ['Insurance Create'], authPermission)
        },
        {
          path: "/insurance/edit/:id",
          element: withAuthorization(InsuranceCreateOrEditPage, ['Insurance Update'], authPermission),
        },
        {
          path: "/insurances-payment",
          element: withAuthorization(InsurancePayment, ['InsurancePayment Create'], authPermission),
        },
        {
          path: "/insurances-balance",
          element: withAuthorization(InsuranceBalancePage, ['Insurance Balance'], authPermission),
        },
        {
          path: "/insurances-renew",
          element: withAuthorization(InsuranceRenew, ['InsuranceRenew Create'], authPermission),
        },

        {
          path: "/calculations",
          element: withAuthorization(CalculationPage, ['Calculation Show'], authPermission)
        },
        {
          path: "/discounts",
          element: withAuthorization(DiscountPage, ['Discounts List'], authPermission),
        },
        {
          path: "/discount/create",
          element: withAuthorization(DiscountCreateOrEditPage, ['Discounts Create'], authPermission)
        },
        {
          path: "/discount/edit/:id",
          element: withAuthorization(DiscountCreateOrEditPage, ['Discounts Update'], authPermission),
        },
        {
          path: "/pace-program-rates",
          element: withAuthorization(PaceProgramRatePage, ['PaceProgramRates List'], authPermission),
        },
        {
          path: "/pace-program-rate/create",
          element: withAuthorization(PaceProgramRateCreateOrEditPage, ['PaceProgramRates Create'], authPermission)
        },
        {
          path: "/pace-program-rate/edit/:id",
          element: withAuthorization(PaceProgramRateCreateOrEditPage, ['PaceProgramRates Update'], authPermission),
        },
        {
          path: "/tax-rates",
          element: withAuthorization(TaxRatePage, ['TaxRates List'], authPermission),
        },
        {
          path: "/tax-rate/create",
          element: withAuthorization(TaxRateCreateOrEditPage, ['TaxRates Create'], authPermission)
        },
        {
          path: "/tax-rate/edit/:id",
          element: withAuthorization(TaxRateCreateOrEditPage, ['TaxRates Update'], authPermission),
        },
        {
          path: "/media-manager",
          element: withAuthorization(CreateMediaManagerPage, ['Media Create'], authPermission),
        },
        {
          path: "/media-manager/list",
          element: withAuthorization(MediaManagerPage, ['Media List'], authPermission),
        },
        {
          path: "/drivers",
          element: withAuthorization(DriverPage, ['Drivers List'], authPermission),
        },
        {
          path: "/driver/create",
          element: withAuthorization(DriverCreateOrEditPage, ['Drivers Create'], authPermission)
        },
        {
          path: "/driver/edit/:id",
          element: withAuthorization(DriverCreateOrEditPage, ['Drivers Update'], authPermission),
        },
        {
          path: "/tickets",
          element: withAuthorization(TicketPage, ['Tickets List'], authPermission),
        },
        {
          path: "/ticket/create",
          element: withAuthorization(CreateOrEdit, ['Tickets Create'], authPermission)
        },
        {
          path: "/ticket/edit/:id",
          element: withAuthorization(CreateOrEdit, ['Tickets Update'], authPermission),
        },
        {
          path: "/vendors",
          element: withAuthorization(VendorPage, ['Vendors List'], authPermission),
        },
        {
          path: "/vendor/create",
          element: withAuthorization(VendorCreateOrEditPage, ['Vendors Create'], authPermission)
        },
        {
          path: "/vendor/edit/:id",
          element: withAuthorization(VendorCreateOrEditPage, ['Vendors Update'], authPermission),
        },
        {
          path: "/database",
          element: <DatabaseImportExport />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
        {
          path: "/403",
          element: <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" href='/dashboard'>Back Home</Button>}
          />,
        },
      ]
    },
  ])

  return element;
}

export default Routes;
