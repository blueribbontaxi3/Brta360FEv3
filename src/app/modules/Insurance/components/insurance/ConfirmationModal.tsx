import { Modal, Checkbox, Button, Typography } from "antd";
import { useEffect, useState } from "react";
import { MailOutlined, CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const ConfirmationModal = ({ visible, onCancel, onConfirm, loading, setValue }: { visible: boolean, onCancel: () => void, onConfirm: () => void, loading: any, setValue: any }) => {
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
        setIsChecked(false);
    }, [visible]);
    
    return (
        <Modal
            title={
                <span>
                    <MailOutlined style={{ marginRight: 8 }} />
                    Mail Send
                </span>
            }
            open={visible} loading={loading}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" danger onClick={onCancel} icon={<CloseCircleOutlined />}>
                    Cancel
                </Button>,
                <Button disabled={loading} key="submit" type="primary" onClick={onConfirm} icon={<CheckCircleOutlined />}>
                    OK
                </Button>,
            ]}
        >
            <Title level={5} type="warning">Do you want to send the email? If yes, please check the checkbox below to confirm.</Title>
            <br />
            <Checkbox onChange={(e) => {
                setIsChecked(e.target.checked);
                if (!e.target.checked) {
                    setValue('sendMail', false);
                } else {
                    setValue('sendMail', true);
                }
            }} checked={isChecked}>
                Please check this to confirm
            </Checkbox>
        </Modal>
    );
};

export default ConfirmationModal;
