import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Space, Spin, notification, Input, Switch, Collapse, Tooltip, Checkbox, Affix, Typography, Tree } from 'antd';
import { HomeOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosService from 'utils/axiosInceptor';
import { formFieldErrors } from 'utils/helper';
import { getPermissions } from 'utils/permissions';
import Banner from 'app/molecules/Banner';
import { InputField, SwitchField } from '@atoms/FormElement';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ImportOutlined,
  ExportOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

export const getActionIcon = (action: string) => {
  if (action?.toLowerCase() === 'create') {
    return <PlusOutlined />;
  } else if (action?.toLowerCase() === 'edit' || action.toLowerCase() === 'update') {
    return <EditOutlined />;
  } else if (action?.toLowerCase() === 'delete') {
    return <DeleteOutlined />;
  } else if (action?.toLowerCase() === 'view') {
    return <EyeOutlined />;
  } else if (action?.toLowerCase() === 'import') {
    return <ImportOutlined />;
  } else if (action?.toLowerCase() === 'export') {
    return <ExportOutlined />;
  } else if (action?.toLowerCase() === 'list') {
    return <UnorderedListOutlined />;
  }
};
const { Text } = Typography;
const { Panel } = Collapse;

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const shouldRenderPermissions = (id: any, q: any) => {
  const inRange = id >= 1 && id <= 6;
  const hasLock = q.get('lock');
  console.log("hasLock", hasLock)
  return hasLock || !inRange;
};

const CreateOrEdit = () => {
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [filteredPermissionsSections, setFilteredPermissionsSections] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(null);
  const [rolePermissions, setRolePermissions] = useState<any>({});
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [top, setTop] = React.useState<number>(10);

  // Define validation schema
  const schema = yup.object().shape({
    name: yup.string().required('Role name is required'),
    // status: yup.boolean().optional()
  });


  let query = useQuery();

  // Initialize react-hook-form
  const { control, handleSubmit, formState: { errors }, setValue, setError } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  // Fetch role data if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosService.get(`roles/${id}`)
        .then((response) => {
          const data = response.data?.data;
          setValue('name', data.name);
          setData(data)
          if (data?.permissions?.length > 0) {
            setRolePermissions(data.permissions.reduce((acc: any, perm: any) => {
              const [module, action] = perm.name.split(' ');
              acc[module] = acc[module] || [];
              acc[module].push(action);
              return acc;
            }, {}));
          }
        })
        .catch((error) => notification.error({ message: 'Error', description: error.message }))
        .finally(() => setLoading(false));
    }
  }, [id, setValue]);

  useEffect(() => {
    console.log("rolePermissions", rolePermissions)
  }, [rolePermissions])

  // Permissions Sections
  const permissionsSections = [
    {
      title: 'User Management',
      permissions: getPermissions().slice(0, 4),
    },
    {
      title: 'Operational Modules',
      permissions: getPermissions().slice(4, 13),
    },
    {
      title: 'Settings',
      permissions: getPermissions().slice(13),
    },
  ];

  // Filter Permissions
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPermissionsSections(permissionsSections);
    } else {
      const lowerCaseSearchTerm = searchTerm?.toLowerCase();
      const filteredSections = permissionsSections.map((section) => ({
        ...section,
        permissions: section.permissions.filter((module: any) =>
          module.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          module?.permissions?.some((perm: string) =>
            perm?.toLowerCase().includes(lowerCaseSearchTerm)
          )
        ),
      })).filter((section) => section.permissions.length > 0);

      setFilteredPermissionsSections(filteredSections);
    }
  }, [searchTerm]);

  // Submit Handler
  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true);
    try {
      const permissions = Object.entries(rolePermissions).flatMap(([module, actions]: any) =>
        actions.map((action: string) => `${module} ${action}`)
      );

      const payload = {
        name: data.name,
        permissions,
        status: (data.status == 'active' || data.status == 'true' || data.status == true) ? 'active' : 'inactive',
      };

      if (id) {
        await axiosService.put(`roles/${id}`, payload);
        notification.success({ message: 'Success', description: 'Role updated successfully!' });
      } else {
        await axiosService.post('roles/store', payload);
        notification.success({ message: 'Success', description: 'Role created successfully!' });
      }

      navigate('/roles');
    } catch (error: any) {
      if (error?.response?.status === 422) {
        formFieldErrors(error, setError);
      } else {
        notification.error({ message: 'Error', description: 'Failed to save role.' });
      }
      console.error("Error saving role:", error);
    } finally {
      setLoading(false);
    }
  };

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
      title: (<Link to="/roles">Roles</Link>),
    },
    {
      title: id ? 'Edit' : 'Create',
    }
  ];

  return (
    <>
      <Banner breadCrumb={breadCrumbList} title={id ? 'Edit Role' : 'Create Role'} data={data} />
      <Spin spinning={loading}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} autoComplete="off">

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} xl={8}>
              <Affix offsetTop={top}>
                <Card title="Role Information">
                  <InputField
                    label="Role Name"
                    fieldName="name"
                    control={control}
                    initValue=""
                    iProps={{
                      placeholder: "Role Name",
                      size: "large",
                      disabled: id >= 1 && id <= 6, // Read-only for specific IDs
                    }}
                    errors={errors}
                  />
                  {/* <SwitchField
                    label="Status"
                    fieldName="status"
                    control={control}
                    iProps={{
                      checkedChildren: "Active",
                      unCheckedChildren: "Inactive",
                    }}
                    errors={errors}
                  /> */}
                  {shouldRenderPermissions(id, query) && <Col span={24}>
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                      <Space>
                        <Button type="primary" size="large" htmlType="submit">
                          {id ? 'Update' : 'Create'}
                        </Button>
                      </Space>
                    </div>
                  </Col>
                  }
                </Card>
              </Affix>
            </Col>
            <Col xs={24} sm={24} md={12} xl={16}>
              <Card>
                <ul>
                  {Object.entries(rolePermissions).map(([key, values]: any) => (
                    <li key={key}>
                      <strong>{key}:</strong> {values.join(", ")}
                    </li>
                  ))}
                </ul>
              </Card>
              {shouldRenderPermissions(id, query) && (
                <Card title="Permissions">
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search permissions"
                    allowClear
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '16px' }}
                  />
                  <Collapse defaultActiveKey={['0']}>
                    {filteredPermissionsSections.map((section: any, index: any) => (
                      <Panel header={section.title} key={index}>
                        <Row gutter={[8, 8]}>
                          {section.permissions.map((module: any) => (
                            <Col span={12} key={module.name}>
                              <Form.Item label={`${module.name}`}>
                                <Checkbox.Group
                                  options={module.permissions.map((perm: string) => ({
                                    label: <> <Text type={perm == 'Delete' ? 'danger' : 'secondary'}>{perm} {getActionIcon(perm)}</Text></>,
                                    value: perm,
                                  }))}
                                  value={rolePermissions[module.name] || []}
                                  onChange={(checkedValues) => {
                                    setRolePermissions((prev: any) => ({
                                      ...prev,
                                      [module.name]: checkedValues,
                                    }));
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          ))}
                        </Row>
                      </Panel>
                    ))}
                  </Collapse>
                </Card>
              )}

            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default CreateOrEdit;
