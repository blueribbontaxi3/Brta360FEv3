import __ from 'lodash';

export const getPermissions = () => {
  const permissions: any = [
    {
      name: 'Dashboard',
      permissions: ['List'],
    },
    {
      name: 'Members',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Corporations',
      permissions: ['Create', 'Update', 'Delete', 'List', 'Member', 'Affiliation', 'Discount', 'Officer'],
    },
    {
      name: 'Medallions',
      permissions: ['Create', 'Update', 'Delete', 'List', 'Transfer'],
    },
    {
      name: 'Vehicles',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'GroundTax',
      permissions: ['List'],
    },
    {
      name: 'Insurance',
      permissions: ['Create', 'Update', 'Delete', 'List', 'CollisionRate', 'PaceProgramRate', 'Previous', 'Discount', 'Medallion', 'Insured', 'Surrender', 'Balance'],
    },
    {
      name: 'InsurancePayment',
      permissions: ['Create'],
    },
    {
      name: 'InsuranceRenew',
      permissions: ['Renew', 'List'],
    },
    {
      name: 'InsuranceBalance',
      permissions: ['List'],
    },
    {
      name: 'Calculation',
      permissions: ['Show'],
    },
    {
      name: 'Media',
      permissions: ['Create', 'Delete', 'List'],
    },
    // {
    //   name: 'Officers',
    //   permissions: ['Create', 'Update', 'Delete', 'List'],
    // },
    {
      name: 'Discounts',
      permissions: ['Update', 'List'],
    },
    {
      name: 'CollisionRates',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'PaceProgramRates',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Affiliations',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Transponder',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'TaxRates',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Tickets',
      permissions: ['Create', 'Update', , 'List'],
    },
    {
      name: 'Users',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Roles',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Drivers',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
    {
      name: 'Vendors',
      permissions: ['Create', 'Update', 'Delete', 'List'],
    },
  ];

  return permissions;
};

export const findPermissionByName = (name: any) => {
  const permissions: any = getPermissions();
  const data: any = __.find(permissions, (permission) => permission?.name === name);
  return data?.permissions;
};


