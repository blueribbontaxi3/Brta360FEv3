import React from "react";
import { Card, Descriptions, Table, Divider, Typography, Tag, Space } from "antd";
import {
  CarOutlined,
  HomeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TagOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ApartmentOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const TaxiDetails = ({ data }: any) => {
  const vehicleDataColumns = [
    {
      title: "Closing Date",
      dataIndex: "closing_date",
      key: "closing_date",
      render: (text: any) => dayjs(text).format("MM-DD-YYYY"),
    },
    {
      title: "Public Vehicle Number",
      dataIndex: "public_vehicle_number",
      key: "public_vehicle_number",
    },
    {
      title: "Sale Price",
      dataIndex: "sale_price",
      key: "sale_price",
      render: (text: any) => (text ? <Tag color="green">${text}</Tag> : "-"),
    },
    {
      title: "Seller's Company",
      dataIndex: "sellers_company_name",
      key: "sellers_company_name",
    },
    {
      title: "Buyer's Company",
      dataIndex: "buyers_company_name",
      key: "buyers_company_name",
    },
  ];

  return (
    <Card
      title={<>
        <CarOutlined /> Taxi Details
      </>}
      style={{ marginTop: 10 }}
    >
      <Divider orientation="left">
        <Title level={5} style={{ margin: 0 }}>
          <TagOutlined /> Vehicle Info
        </Title>
      </Divider>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label={<><CarOutlined /> Vehicle Type</>}>
          {data.vehicle_type}
        </Descriptions.Item>
        <Descriptions.Item label={<TagOutlined />}>Public Vehicle Number
          <br />
          <Text type="secondary">{data.public_vehicle_number}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {data.status === "Active" ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : (
            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
          )}{" "}
          {data.status}
        </Descriptions.Item>
        <Descriptions.Item label="Model Year">{data.vehicle_model_year}</Descriptions.Item>
        <Descriptions.Item label="Vehicle Make">{data.vehicle_make}</Descriptions.Item>
        <Descriptions.Item label="Vehicle Model">{data.vehicle_model}</Descriptions.Item>
        <Descriptions.Item label="Color">{data.vehicle_color}</Descriptions.Item>
        <Descriptions.Item label="Fuel Source">{data.vehicle_fuel_source}</Descriptions.Item>
        <Descriptions.Item label="Wheelchair Accessible">
          {data.wheelchair_accessible === "Y" ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : (
            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
          )}{" "}
          {data.wheelchair_accessible === "Y" ? "Yes" : "No"}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" style={{ marginTop: 20 }}>
        <Title level={5} style={{ margin: 0 }}>
          <HomeOutlined /> Company & Affiliation
        </Title>
      </Divider>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label={<ApartmentOutlined />}>Company Name
          <br />
          <Text type="secondary">{data.company_name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={<EnvironmentOutlined />}>Address
          <br />
          <Text type="secondary">
            {data.address
              ? `${data.address}, ${data.city}, ${data.state}, ${data.zip_code}`
              : "-"}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label={<SolutionOutlined />}>Taxi Affiliation
          <br />
          <Text type="secondary">{data.taxi_affiliation}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="License Management">
          {data.taxi_medallion_license_management}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" style={{ marginTop: 20 }}>
        <Title level={5} style={{ margin: 0 }}>
          <TagOutlined /> Vehicle Sale History
        </Title>
      </Divider>
      <Table
        dataSource={data.vehicle_data}
        columns={vehicleDataColumns}
        rowKey="closing_date"
        pagination={false}
        size="small"
        bordered
      />
    </Card>
  );
};

export default TaxiDetails;
