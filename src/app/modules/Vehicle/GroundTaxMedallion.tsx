import React from "react";
import {
  Modal,
  Descriptions,
  Table,
  Tag,
  Flex,
  Badge,
  Typography,
  Divider,
} from "antd";
import MedallionNumberTag from "@atoms/MedallionNumberTag";
import { usdFormat } from "utils/helper";

const GroundTaxMedallion = ({
  data,
  open,
  setOpen,
}: {
  data: any;
  open: boolean;
  setOpen: any;
}) => {
  // Table columns for records
  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <Tag
          color={text === "insured" ? "green" : "red"}
          style={{ textTransform: "capitalize" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Effective Date",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
    },
    {
      title: "Surrender Date",
      dataIndex: "surrenderDate",
      key: "surrenderDate",
      render: (val: string) => val || "-",
    },
    {
      title: "Months",
      dataIndex: "months",
      key: "months",
      render: (months: any[]) => (
        <Flex wrap="wrap" gap="5px" style={{ maxWidth: 250 }}>
          {months.map((m) => {
            const monthStr = typeof m === 'object' ? m.month : m;
            return <Tag key={monthStr}>{monthStr}</Tag>;
          })}
        </Flex>
      ),
    },
  ];

  // Descriptions
  const descriptionItems = [
    { label: "Medallion Number", children: <MedallionNumberTag medallion={data?.records?.[0]?.medallion} /> },
    { label: "Ground Tax", children: usdFormat(data.groundTax) },
    { label: "WAV Fee", children: usdFormat(data.wavFee) },
    // { label: "Monthly Tax", children: `$${data.monthlyTax}` },
    { label: "Total Tax", children: usdFormat(data.totalTax) },
    {
      label: (
        <Badge count={data.uniqueMonths.length}>
          <Typography.Text>Unique Months</Typography.Text>
        </Badge>
      ),
      children: <Flex gap={5} wrap="wrap" style={{ width: '400px' }}>{
        data.uniqueMonths.map((m: any) => {
          const monthStr = typeof m === 'object' ? m.month : m;
          return (
            <Tag key={monthStr} color="blue">
              {monthStr}
            </Tag>
          );
        })
      }</Flex>,
    },
    ...(data.vehicle
      ? [
        {
          label: "Vehicle",
          children: `${data.vehicle.vehicleMake?.name} ${data.vehicle.vehicleModel?.name} (${data.vehicle.vehicleYear?.year})`,
        },
        { label: "VIN", children: data.vehicle.vinNumber },
        { label: "Type", children: data.vehicle.vehicleType?.name },
      ]
      : []),
  ];

  return (
    <Modal
      title={`Medallion #${data.medallionNumber}`}
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      footer={null}
      width={700}
      centered
    >
      {/* Top Info */}
      <Descriptions bordered column={1} items={descriptionItems} size="small" />
      <Divider />
      {/* Records Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data.records}
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default GroundTaxMedallion;
