import React, { useEffect, useState } from "react";
import { Card, Descriptions, Typography, Space, Empty, Result, Spin, Divider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Title } = Typography;

const VehicleDetails = ({ data, loading = false }: any) => {
 

  // Helper to render a section only if data exists
  const renderSection = (title: string, items: any[]) =>
    items.some((item) => item.value) ? (
      <>
        <Divider orientation="left" style={{ margin: "2px 0" }}>
          <Title level={5} style={{ margin: 0 }}>{title}</Title>
        </Divider>
        <Descriptions bordered size="small" column={2}>
          {items.map(
            (item) =>
              item.value && (
                <Descriptions.Item key={item.label} label={item.label}>
                  {item.value}
                </Descriptions.Item>
              )
          )}
        </Descriptions>
      </>
    ) : null;

  return (
    <Card
      style={{ marginTop: 10 }}
      title={`Vehicle Details${data?.intro?.vin ? ` - VIN: ${data.intro.vin}` : ""}`}
    >
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
       
      >
        {!loading && data && data.basic ? (
          <Space direction="vertical" style={{ width: "100%" }} size="small">
            {/* Basic Information */}
            {renderSection("Basic Information", [
              { label: "Make", value: data.basic.make },
              { label: "Model", value: data.basic.model },
              { label: "Year", value: data.basic.year },
              { label: "Trim", value: data.basic.trim },
              { label: "Body Type", value: data.basic.body_type },
              { label: "Vehicle Type", value: data.basic.vehicle_type },
            ])}

            {/* Engine Information */}
            {data.engine &&
              renderSection("Engine Information", [
                { label: "Engine Size", value: data.engine.engine_size ? `${data.engine.engine_size} L` : null },
                { label: "Description", value: data.engine.engine_description },
                { label: "Capacity", value: data.engine.engine_capacity ? `${data.engine.engine_capacity} cc` : null },
              ])}

            {/* Manufacturer Information */}
            {data.manufacturer &&
              renderSection("Manufacturer Information", [
                { label: "Manufacturer", value: data.manufacturer.manufacturer },
                { label: "Region", value: data.manufacturer.region },
                { label: "Country", value: data.manufacturer.country },
                { label: "Plant City", value: data.manufacturer.plant_city },
              ])}

            {/* Dimensions */}
            {data.dimensions &&
              renderSection("Dimensions", [
                { label: "GVWR", value: data.dimensions.gvwr },
              ])}

            {/* Drivetrain */}
            {data.drivetrain &&
              renderSection("Drivetrain", [
                { label: "Drive Type", value: data.drivetrain.drive_type },
              ])}

            {/* Fuel Information */}
            {data.fuel &&
              renderSection("Fuel Information", [
                { label: "Fuel Type", value: data.fuel.fuel_type },
              ])}
          </Space>
        ) : !loading && data?.status === 500 ? (
          <Result status="500" title="500" subTitle={data?.data?.message || "Internal Server Error"} />
        ) : !loading ? (
          <Empty description="No vehicle details found." />
        ) : null}
      </Spin>
    </Card>
  );
};

export default VehicleDetails;
