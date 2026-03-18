import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { isAnyPermission } from '../../../utils/helper';
import Logo from '../../../assets/logo.png';
import { findPermissionByName } from '../../../utils/permissions';
import Icon, {
  PieChartOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  ToolOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CalculatorOutlined,
  ReloadOutlined,
  CameraOutlined,
  UserOutlined as OfficerOutlined,
  GiftOutlined,
  DollarOutlined,
  RadarChartOutlined,
  TeamOutlined as AffiliationOutlined,
  TabletOutlined,
  ShopOutlined,
  MoneyCollectFilled,
  MoneyCollectOutlined,
  DollarCircleFilled,
  DollarCircleOutlined,
} from '@ant-design/icons';
import AffiliationCustomIcon from '../../../assets/AFFILATION.svg?react';
import DashboardCustomIcon from '../../../assets/DASHBOARD.svg?react';
import MediaCustomIcon from '../../../assets/MEDIA.svg?react';
import MemberCustomIcon from '../../../assets/MEMBERS.svg?react';
import CorporationCustomIcon from '../../../assets/COORPORATION.svg?react';
import MedallionCustomIcon from '../../../assets/Medallion.svg?react';
import VehicleCustomIcon from '../../../assets/VEHICLES.svg?react';
import InsuranceCustomIcon from '../../../assets/INSURANCE.svg?react';
import CalculationCustomIcon from '../../../assets/CALCULATOR.svg?react';
import ToolCustomIcon from '../../../assets/TOOLS.svg?react';
import DiscountCustomIcon from '../../../assets/DISCOUNT.svg?react';
import LogoutCustomIcon from '../../../assets/LOGOUT.svg?react';
import RoleCustomIcon from '../../../assets/ROLES.svg?react';
import UserCustomIcon from '../../../assets/USER.svg?react';
import TransponderCustomIcon from '../../../assets/transponder.svg?react';
import PaceProgramRateCustomIcon from '../../../assets/PACE.svg?react';
import CollisionRateCustomIcon from '../../../assets/COLLISIONRATE.svg?react';
import type { GetProps } from 'antd';
type CustomIconComponentProps = GetProps<typeof Icon>;


const DashboardIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={DashboardCustomIcon} {...props} />
}

const MediaIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={MediaCustomIcon} {...props} />
}

const MemberIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={MemberCustomIcon} {...props} />
}

const CorporationIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={CorporationCustomIcon} {...props} />
}

const MedallionIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={MedallionCustomIcon} {...props} />
}

const VehicleIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={VehicleCustomIcon} {...props} />
}

const InsuranceIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={InsuranceCustomIcon} {...props} />
}

const CalculationIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={CalculationCustomIcon} {...props} />
}

const ToolIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={ToolCustomIcon} {...props} />
}

const DiscountIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={DiscountCustomIcon} {...props} />
}

const LogoutIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={LogoutCustomIcon} {...props} />
}
const RoleIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={RoleCustomIcon} {...props} />
}
const UserIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={UserCustomIcon} {...props} />
}
const TransponderIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={TransponderCustomIcon} {...props} />
}
const PaceProgramRateIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={PaceProgramRateCustomIcon} {...props} />
}
const CollisionRateIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={CollisionRateCustomIcon} {...props} />
}

const AffiliationIcon = (props: Partial<CustomIconComponentProps>) => {
  return <Icon component={AffiliationCustomIcon} {...props} />
}

const { Sider } = Layout;


type MenuItemType = Required<MenuProps>['items'][number];

const LeftSideBar = (props: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation()

  const authPermissions: any = useSelector(
    (state: any) => state?.user_login?.auth_permission
  );
  const permissionsList = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      permissions: ['List'],
      type: 'group',
    },
    {
      title: "FF",
      name: "Media",
      path: "/media-manager/list",
      icon: <MediaIcon />,
      permissions: ["Create", "Update", "Delete", "List"],
    },
    {
      name: 'Members',
      path: '/members',
      icon: <MemberIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Corporations',
      path: '/corporations',
      icon: <CorporationIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Medallions',
      path: '/medallions',
      icon: <MedallionIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Vehicles',
      path: '/vehicles',
      icon: <VehicleIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List', 'Ground Tax List'],
      children: [
        {
          name: 'Vehicles',
          path: '/vehicles',
          icon: <VehicleIcon />,
          permissions: ['Create', 'Update', 'Delete', 'List'],
        },
        {
          name: 'Ground Tax',
          path: '/vehicles-tax-calculation',
          icon: <DollarCircleOutlined />,
          permissions: ['List'],
        },
      ]
    },

    {
      name: 'Insurance',
      path: '/insurances',
      icon: <InsuranceIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Insurance Payment',
      path: '/insurances-payment',
      icon: <InsuranceIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Insurance Renew',
      path: '/insurances-renew',
      icon: <InsuranceIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Insurance Balance',
      path: '/insurances-balance',
      icon: <CalculationIcon />,
      permissions: ['Balance'], // Using 'List' to match Insurance permissions
    },
    {
      name: 'Calculation',
      path: '/calculations',
      icon: <CalculationIcon />,
      permissions: ['Show'],
    },
    {
      name: 'Drivers',
      path: '/drivers',
      icon: <InsuranceIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      type: 'divider',
    },

    {
      name: 'Tools',
      path: '/tools',
      icon: <ToolIcon />,
      permissions: ['List'],
      children: [
        {
          name: 'Affiliations',
          path: '/affiliations',
          icon: <AffiliationIcon />,
          permissions: ['Create', 'Update', 'Delete', 'List'],
        },
        {
          name: 'Discounts',
          path: '/discounts',
          icon: <DiscountIcon />,
          permissions: ['Create', 'Update', 'Delete', 'List'],
        },
        {
          name: 'Collision Rates',
          path: '/collision-rates',
          icon: <CollisionRateIcon />,
          permissions: ['Create', 'Update', 'Delete', 'List'],
        },
        {
          name: 'Pace Program Rates',
          path: '/pace-program-rates',
          icon: <PaceProgramRateIcon />,
          permissions: ['Create', 'Update', 'Delete', 'List'],
        },
        {
          name: 'Transponder',
          path: '/transponder',
          icon: <TransponderIcon />,
          permissions: ['Create', 'Update', 'Delete', 'List'],
        },
        {
          name: 'Tax Rates',
          path: '/tax-rates',
          icon: <PaceProgramRateIcon />,
          permissions: ['Create', 'Update', 'Delete', 'List'],
        },
        {
          name: 'Vendors',
          path: '/vendors',
          icon: <ShopOutlined />,
          permissions: ['Create', 'Update', 'Delete', 'List'],
        },
      ],
    },
    {
      name: 'Users',
      path: '/users',
      icon: <UserIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Roles',
      path: '/roles',
      icon: <RoleIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      type: 'divider',
    },
    {
      name: 'Tickets',
      path: '/tickets',
      icon: <InsuranceIcon />,
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <UserOutlined />,
      permissions: ['View', 'Edit'],
    },
    {
      name: 'Logout',
      path: '/logout',
      icon: <LogoutIcon />,
      permissions: [],
    },
  ];

  interface MenuItem {
    label?: React.ReactNode;
    key?: string;
    icon?: React.ReactNode;
    type?: 'divider';
  }

  function getItem(
    label: React.ReactNode,
    key: string,
    icon: React.ReactNode,
    children?: MenuItemType[]
  ): MenuItemType {
    return {
      label,
      key,
      icon,
      children,
    } as MenuItemType;
  }

  function getDivider(): MenuItem {
    return { type: 'divider' };
  }

  const generateMenuItems = (authPermissions: any): MenuItemType[] => {
    const processItems = (items: typeof permissionsList): MenuItemType[] => {
      return items
        .map((item) => {
          if (item.type === 'divider') return getDivider();

          // If item has children, process them recursively
          let childItems: MenuItemType[] | undefined;
          if (item.children) {
            childItems = processItems(item.children);
          }

          // Check permissions for this item
          const permissions = findPermissionByName(item.name?.replaceAll(/\s/g, ''));
          const hasPermission =
            permissions?.length &&
            isAnyPermission(
              authPermissions,
              permissions.map((p: any) => item.name?.replaceAll(/\s/g, '') + ' ' + p)
            );

          // Determine if the item should be shown
          if (hasPermission || (childItems && childItems.length > 0) || item.name === 'Profile' || item.name === 'Logout') {
            const label = (childItems && childItems.length > 0) ? item.name : <Link to={item.path ?? '/default-path'}>{item.name}</Link>;
            return getItem(label, item.path ?? '/default-path', item.icon, childItems);
          }

          // Otherwise, don't show
          return null;
        })
        .filter((item) => item !== null) as MenuItemType[];
    };

    return processItems(permissionsList);
  };

  const menuItems = generateMenuItems(authPermissions);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Sider width={220} collapsedWidth={40} style={{ background: colorBgContainer }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div>
        <img
          src={Logo}  // Example image URL
          alt="Blue Ribbon Logo"
          style={{
            width: collapsed ? '40px' : '60px',    // Set image width
            display: 'block',  // Needed to allow margin auto to work
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '10px'
          }}
        />
      </div>
      <Menu
        selectedKeys={[location.pathname.replace('/create', 's').replace('/edit', 's').replace(/\/\d+$/, '')]}
        defaultSelectedKeys={['1']}
        mode="inline"
        items={menuItems}
      />;
    </Sider>
  );
};

export default LeftSideBar;
