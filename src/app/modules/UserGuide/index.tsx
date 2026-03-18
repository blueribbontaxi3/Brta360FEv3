import React, { useState } from 'react';
import { Layout, Menu, Typography, Card, Anchor, Row, Col, Divider, Table, Tag, List } from 'antd';
import { BookOutlined, UserOutlined, CarOutlined, SafetyCertificateOutlined, FileTextOutlined, TeamOutlined, BankOutlined, SolutionOutlined, LinkOutlined, IdcardOutlined } from '@ant-design/icons';
import Banner from '../../molecules/Banner';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

const UserGuide = () => {
    const [selectedKey, setSelectedKey] = useState('intro');

    const menuItems = [
        { key: 'intro', icon: <BookOutlined />, label: 'Introduction' },
        { key: 'users', icon: <UserOutlined />, label: 'Users' },
        { key: 'insurance', icon: <SafetyCertificateOutlined />, label: 'Insurance' },
        { key: 'medallions', icon: <SafetyCertificateOutlined />, label: 'Medallions' },
        { key: 'vehicles', icon: <CarOutlined />, label: 'Vehicles' },
        { key: 'tickets', icon: <FileTextOutlined />, label: 'Tickets' },
        { key: 'drivers', icon: <IdcardOutlined />, label: 'Drivers' },
        { key: 'corporations', icon: <BankOutlined />, label: 'Corporations' },
        { key: 'members', icon: <TeamOutlined />, label: 'Members' },
        { key: 'roles', icon: <SolutionOutlined />, label: 'Roles' },
        { key: 'affiliations', icon: <LinkOutlined />, label: 'Affiliations' },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case 'intro':
                return (
                    <Card title="Welcome to the User Guide">
                        <Paragraph>
                            This comprehensive guide will help you navigate and utilize the Admin Dashboard effectively.
                            Select a module from the left menu to view detailed documentation.
                        </Paragraph>
                        <Title level={4}>Getting Started</Title>
                        <Paragraph>
                            The dashboard provides a centralized interface for managing all aspects of your transportation business,
                            including users, vehicles, insurance policies, and more.
                        </Paragraph>
                    </Card>
                );
            case 'users':
                return (
                    <Card title="User Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The User Management module allows administrators to manage system users, assign roles, and control access permissions. It supports creating new users, editing existing profiles, and deactivating or deleting users.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Data Structure</Title>
                        <Table
                            dataSource={[
                                { field: 'name', type: 'String', desc: 'Full name of the user.' },
                                { field: 'email', type: 'String', desc: 'Unique email address.' },
                                { field: 'password', type: 'String', desc: 'User password (required for creation).' },
                                { field: 'roleIds', type: 'Array', desc: 'List of Role IDs assigned to the user.' },
                                { field: 'status', type: 'Boolean/String', desc: 'Active (active/1) or Inactive (inactive/0).' },
                                { field: 'memberId', type: 'Number', desc: 'ID of the associated member (conditional).' },
                            ]}
                            columns={[
                                { title: 'Field', dataIndex: 'field', key: 'field', render: (text) => <Text code>{text}</Text> },
                                { title: 'Type', dataIndex: 'type', key: 'type' },
                                { title: 'Description', dataIndex: 'desc', key: 'desc' },
                            ]}
                            pagination={false}
                            size="small"
                            bordered
                        />
                        <Divider />
                        <Title level={4}>CRUD Operations</Title>
                        <List
                            itemLayout="vertical"
                            dataSource={[
                                { title: 'Create User', steps: ['Navigate to /users/create', 'Permissions: Users Create', 'Fill required fields: Name, Email, Password, Roles', 'Submit form'] },
                                { title: 'Edit User', steps: ['Click Edit icon or go to /users/edit/:id', 'Permissions: Users Update', 'Password is optional during edit'] },
                                { title: 'Delete User', steps: ['Click Delete icon', 'Permissions: Users Delete', 'Users marked as isAutoGen cannot be deleted'] },
                            ]}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.title} />
                                    <ul>
                                        {item.steps.map((step, index) => <li key={index}>{step}</li>)}
                                    </ul>
                                </List.Item>
                            )}
                        />
                    </Card>
                );
            case 'insurance':
                return (
                    <Card title="Insurance Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Insurance Management module is a critical component for managing insurance policies for vehicles and medallions. It handles complex financial calculations, policy renewals, and status tracking.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Dependencies</Title>
                        <ul>
                            <li><Text strong>Medallion</Text>: Selecting a Medallion automatically fetches Vehicle, Corporation, and Member.</li>
                            <li><Text strong>Vehicle</Text>: Must have a valid "Vehicle Year".</li>
                        </ul>
                        <Divider />
                        <Title level={4}>Data Structure</Title>
                        <Table
                            dataSource={[
                                { field: 'medallionNumberId', type: 'Number', desc: 'ID of the selected medallion.' },
                                { field: 'vehicleId', type: 'Number', desc: 'ID of the associated vehicle.' },
                                { field: 'requestDate', type: 'Date', desc: 'Date of the insurance request.' },
                                { field: 'effectiveDate', type: 'Date', desc: 'Date the insurance becomes effective.' },
                                { field: 'status', type: 'String', desc: 'Current status (e.g., request, insured).' },
                            ]}
                            columns={[
                                { title: 'Field', dataIndex: 'field', key: 'field', render: (text) => <Text code>{text}</Text> },
                                { title: 'Type', dataIndex: 'type', key: 'type' },
                                { title: 'Description', dataIndex: 'desc', key: 'desc' },
                            ]}
                            pagination={false}
                            size="small"
                            bordered
                        />
                    </Card>
                );
            case 'medallions':
                return (
                    <Card title="Medallion Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Medallion Management module handles the registration and management of medallions. It links medallions to corporations and vehicles and tracks their insurance and workman's compensation status.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Key Features</Title>
                        <ul>
                            <li><Text strong>Workman's Comp Toggle</Text>: Enable/Disable directly from the list.</li>
                            <li><Text strong>Transfer Medallion</Text>: Transfer ownership (only if insurance status is surrender).</li>
                        </ul>
                    </Card>
                );
            case 'vehicles':
                return (
                    <Card title="Vehicle Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Vehicle Management module handles the registration and assignment of vehicles to medallions. It includes features for VIN decoding and duplicate VIN handling.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Features</Title>
                        <ul>
                            <li><Text strong>VIN Decoding</Text>: Automatically fetches vehicle details (Make, Model, Year) from VIN.</li>
                            <li><Text strong>Force Save</Text>: Allows saving duplicate VINs if no active insurance exists.</li>
                            <li><Text strong>Vehicle Release</Text>: Release a vehicle from a medallion (requires surrendered insurance).</li>
                        </ul>
                    </Card>
                );
            case 'tickets':
                return (
                    <Card title="Ticket Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Ticket Management module facilitates communication between users and administrators. It allows users to report issues and administrators to respond.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Features</Title>
                        <ul>
                            <li><Text strong>Conversation History</Text>: View full chat history with attachments.</li>
                            <li><Text strong>Message Highlighting</Text>: Highlight specific messages via URL parameters.</li>
                            <li><Text strong>Status Management</Text>: Track ticket status (Open, Pending, Closed).</li>
                        </ul>
                    </Card>
                );
            case 'drivers':
                return (
                    <Card title="Driver Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Driver Management module handles the registration of drivers, capturing personal info, license details, and documents.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Data Structure</Title>
                        <Table
                            dataSource={[
                                { field: 'firstName', type: 'String', desc: "Driver's first name." },
                                { field: 'lastName', type: 'String', desc: "Driver's last name." },
                                { field: 'dlNumber', type: 'String', desc: "Driver's License Number." },
                                { field: 'ssn', type: 'String', desc: "Social Security Number." },
                            ]}
                            columns={[
                                { title: 'Field', dataIndex: 'field', key: 'field', render: (text) => <Text code>{text}</Text> },
                                { title: 'Type', dataIndex: 'type', key: 'type' },
                                { title: 'Description', dataIndex: 'desc', key: 'desc' },
                            ]}
                            pagination={false}
                            size="small"
                            bordered
                        />
                    </Card>
                );
            case 'corporations':
                return (
                    <Card title="Corporation Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Corporation Management module handles the registration of corporations, linking them to members and managing officers.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Key Features</Title>
                        <ul>
                            <li><Text strong>Officer Management</Text>: Assign users to roles like Agent, President, Secretary.</li>
                            <li><Text strong>Document Uploads</Text>: Manage Articles of Incorporation, Federal ID, etc.</li>
                        </ul>
                    </Card>
                );
            case 'members':
                return (
                    <Card title="Member Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Member Management module handles the registration of members who can own corporations and medallions.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Data Structure</Title>
                        <Table
                            dataSource={[
                                { field: 'firstName', type: 'String', desc: "Member's first name." },
                                { field: 'lastName', type: 'String', desc: "Member's last name." },
                                { field: 'emailAddress', type: 'String', desc: "Contact email." },
                            ]}
                            columns={[
                                { title: 'Field', dataIndex: 'field', key: 'field', render: (text) => <Text code>{text}</Text> },
                                { title: 'Type', dataIndex: 'type', key: 'type' },
                                { title: 'Description', dataIndex: 'desc', key: 'desc' },
                            ]}
                            pagination={false}
                            size="small"
                            bordered
                        />
                    </Card>
                );
            case 'roles':
                return (
                    <Card title="Role Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Role Management module handles the creation and assignment of roles and permissions.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Permissions</Title>
                        <Paragraph>
                            Roles are defined by a set of granular permissions (e.g., <Text code>User Create</Text>, <Text code>Member Delete</Text>).
                            System roles (IDs 1-6) are protected.
                        </Paragraph>
                    </Card>
                );
            case 'affiliations':
                return (
                    <Card title="Affiliation Management">
                        <Title level={4}>Overview</Title>
                        <Paragraph>
                            The Affiliation Management module handles the creation of affiliations and their yearly pricing structures.
                        </Paragraph>
                        <Divider />
                        <Title level={4}>Pricing Structure</Title>
                        <Paragraph>
                            Prices are defined per year for various services:
                        </Paragraph>
                        <ul>
                            <li>Affiliation</li>
                            <li>CMG</li>
                            <li>Liability</li>
                            <li>Pace</li>
                            <li>Workman</li>
                        </ul>
                    </Card>
                );
            default:
                return <Card>Select a module to view details.</Card>;
        }
    };

    return (
        <>
            <Banner
                title="User Guide"
                breadCrumb={[
                    { title: "Home", path: "/" },
                    { title: "User Guide" },
                ]}
            />
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
                <Sider width={250} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        style={{ height: '100%' }}
                        items={menuItems}
                        onClick={(e) => setSelectedKey(e.key)}
                    />
                </Sider>
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    {renderContent()}
                </Content>
            </Layout>
        </>
    );
};

export default UserGuide;
