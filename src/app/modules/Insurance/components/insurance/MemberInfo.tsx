import React, { useState } from 'react';
import { Button, Card, Descriptions, Modal, Spin, Typography } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';
import EmailLink from '@atoms/EmailLink';
import PhoneLink from '@atoms/PhoneLink';

interface Member {
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  fullAddress?: string;
}


export const MemberInfo: React.FC<any> = ({ data }: any) => {
  const member = data || {};
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const onViewAddress = () => {
    setIsAddressModalOpen(true);
  };

  const encodedAddress = encodeURIComponent(member.fullAddress || '');

  return (
    <Card
      size="small"
      title={
        <Typography.Text>
          <IdcardOutlined className="mr-2" />
          Member Information
        </Typography.Text>
      }
      className="mb-4"
      extra={
        member.fullAddress && (
          <Button type="primary" size="small" onClick={onViewAddress}>
            View Map
          </Button>
        )
      }
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Full Name">
          {member.fullName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {member.emailAddress ? <EmailLink email={member.emailAddress} /> : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Phone Number">
          {member.phoneNumber ? <PhoneLink phone={member.phoneNumber} /> : '-'}
        </Descriptions.Item>
      </Descriptions>
      <Modal
        title="Address"
        open={isAddressModalOpen}
        onCancel={() => setIsAddressModalOpen(false)}
        footer={null}
        width={700}
      >
        {member.fullAddress ? (

          <iframe
            title="Google Maps"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
          ></iframe>

        ) : (
          <Typography.Text>No address available</Typography.Text>
        )}
      </Modal>
    </Card>
  );
};
