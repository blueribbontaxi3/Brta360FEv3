import { Tag, Image } from "antd";
import Icon, { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import SurrenderIconCustomIcon from '../../assets/surrender.svg?react';
import RequestIconCustomIcon from '../../assets/request.svg?react';
import InsuredIconCustomIcon from '../../assets/insured.svg?react';
import PreRequestIconCustomIcon from '../../assets/pre-request.jpg';
import Renew from '../../assets/renew.png';
import FlatCustomCancel from '../../assets/flat_cancel.svg?react';
import type { GetProps } from 'antd';
import { isPermission } from "utils/helper";

type CustomIconComponentProps = GetProps<typeof Icon>;

const SurrenderIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SurrenderIconCustomIcon} {...props} />
);

const RequestIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={RequestIconCustomIcon} {...props} />
);

const PreRequestIcon = (props: Partial<CustomIconComponentProps>) => (
  <Image
    src={PreRequestIconCustomIcon}
    {...props}
  />
);

const InsuredIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={InsuredIconCustomIcon} {...props} />
);

const FlatCancelIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={FlatCustomCancel} {...props} />
);

const Status = ({ status, onClick, authPermissions }: any) => {
  if (!status) return null;

  // Handle permission-based custom icons first
  if (status === 'flat_cancel') {
    return <FlatCancelIcon style={{ fontSize: 70, cursor: onClick ? "pointer" : "default" }} onClick={onClick} />;
  }

  if (status === 'surrender') {
    return <SurrenderIcon style={{ fontSize: 70 }} />;
  }
  if (status === 'insured') {
    if (!isPermission(authPermissions, "Insurance Surrender")) return <InsuredIcon style={{ fontSize: 70, cursor: onClick ? "pointer" : "default" }} />;
    return <InsuredIcon style={{ fontSize: 70, cursor: onClick ? "pointer" : "default" }} onClick={onClick} />;
  }

  if (status === 'request') {
    if (!isPermission(authPermissions, "Insurance Insured")) return <RequestIcon style={{ fontSize: 70, cursor: onClick ? "pointer" : "default" }} />;
    return <RequestIcon style={{ fontSize: 70, cursor: onClick ? "pointer" : "default" }} onClick={onClick} />;
  }

  if (status === 'pre_request') {
    if (!isPermission(authPermissions, "Insurance Pre Request"))
      return <PreRequestIcon style={{ width: 70, cursor: onClick ? "pointer" : "default" }} />;
    return <PreRequestIcon style={{ width: 70, cursor: onClick ? "pointer" : "default" }} onClick={onClick} />;
  }



  if (status === 'renew') {
    return (
      <Image
        src={Renew}
        alt="Renew"
        style={{ width: 70, height: 70, cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
        preview={false}
      />
    );
  }

  // Default Tag for other statuses
  let color = "";
  let icon = null;
  switch (status?.toLowerCase()) {
    case "active":
    case "true":
      color = "green";
      icon = <CheckCircleOutlined style={{ marginRight: 5 }} />;
      break;
    case "pending":
      color = "#2db7f5";
      break;
    case "in progress":
      color = "gold";
      break;
    case "approved":
    case "open":
      color = "green";
      break;
    case "inactive":
      color = "red";
      icon = <CloseCircleOutlined style={{ marginRight: 5 }} />;
      break;
    case "flat_cancel":
      color = "gray";
      break;
    default:
      color = "default";
      break;
  }


  return (
    <Tag
      color={color}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {icon}
      {status?.toUpperCase() === "TRUE"
        ? "ACTIVE"
        : status?.replace(/[^a-zA-Z0-9]/g, ' ').toUpperCase()}
    </Tag>
  );
}

export default Status;
