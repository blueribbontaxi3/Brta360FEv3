import React from "react";
import { Modal } from "antd";
import { QuestionCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { isObject } from "utils/helper";

export const Popup = (props: any) => {
  const { onCancel, content, title, closable, open, width } = props;

  return (
    <Modal
      centered
      maskClosable={false}
      closable={closable}
      wrapClassName="check"
      open={isObject(open) ? open.visible : open}
      title={title && title}
      footer={null}
      width={width}
      onCancel={onCancel}
    >
      {content}
    </Modal >
  );
};

export function PopupConfirm(props: any) {
  Modal.confirm({
    centered: true,
    maskClosable: false,
    closable: false,
    autoFocusButton: null,
    icon: <QuestionCircleOutlined />,
    ...props,
  });
}

export function PopupSuccess(props: any) {
  Modal.success({
    centered: true,
    maskClosable: false,
    closable: false,
    autoFocusButton: null,
    icon: <CheckCircleOutlined />,
    ...props,
  });
}
