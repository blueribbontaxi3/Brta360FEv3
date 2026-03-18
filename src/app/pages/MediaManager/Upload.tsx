import React, { useState } from 'react';
import { Upload, Card, Button, message, Modal, Space, Typography } from 'antd';
import { ExclamationCircleFilled, FileImageOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import LocalStorageService from 'utils/localStorageService';
import { useMutation } from '@tanstack/react-query';
import axios from "../../../utils/axiosInceptor";
import { getMediaBaseUrl } from '../../../configs/env.config';

const { Dragger } = Upload;

interface MediaItem {
  id: number;
  name: string;
  url: string;
  mime_type: string;
}

const { Title } = Typography;

const MediaUpload: any = (props: any) => {
  const eventMediaUpload = props?.eventMediaUpload;
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const navigate = props?.navigate;

  // Using environment variable for base URL
  const baseUrl = getMediaBaseUrl();
  const token = LocalStorageService.getAccessToken();

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: `${baseUrl}/api/v1/media`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    showUploadList: true,
    progress: {
      showInfo: true,
      strokeLinecap: 'round'
    },
    onChange(info) {
      const { status, response } = info.file;
      if (status === 'done') {
        if (response && response.status === 1) {
          const newMedia = {
            id: response?.data?.id,
            name: response?.data.name,
            url: response?.data.url,
            mime_type: response.data.mime_type,
          };
          if (eventMediaUpload) {
            eventMediaUpload(response?.data);
          }
          setMediaList((prev) => [...prev, newMedia]);
          message.success(`${info.file.name} uploaded successfully.`);
        } else {
          message.error(`Failed to upload ${info.file.name}.`);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} upload failed.`);
      }
    },
    onRemove: async (file) => {
      const removedItem = file?.response?.data;

      if (removedItem) {
        const userConfirmed = await new Promise((resolve) => {
          Modal.confirm({
            title: 'Do you want to delete this item?',
            icon: <ExclamationCircleFilled />,
            content: `Are you sure you want to delete ${removedItem.name}?`,
            onOk() {
              resolve(true);
            },
            onCancel() {
              resolve(false);
            },
          });
        });

        if (userConfirmed) {
          setMediaList((prevList) =>
            prevList.filter((media) => media.id !== removedItem.id)
          );
          message.success(`Removed ${removedItem.name} successfully.`);
          return true;
        } else {
          message.info('Deletion cancelled.');
          return false;
        }
      }

      return false;
    }
  };

  const { mutate: deleteMutate }: any = useMutation({
    mutationFn: async (body: any) => {
      return await axios.delete(`/media`, { data: body });
    },
    onSuccess: (data: any) => {
      message.success(`${data?.data?.message}`);
    },
    onError: (error: any) => {
      message.error(`Error: ${error.response?.data?.message || "Something went wrong"}`);
    },
  });

  const confirmDelete: any = (item: any) => {
    const dataArray = Array.isArray(item) ? item : [item];
    deleteMutate({
      data: {
        ids: dataArray,
      },
    });
  };

  return (
    <>
      <Space>
        <Title level={3} style={{ marginTop: 0 }}>Upload New Media</Title>
        {navigate && (
          <Button
            type="primary"
            icon={<FileImageOutlined />}
            onClick={() => navigate("/media-manager/list")}
          >
            Library
          </Button>
        )}
      </Space>
      <Card>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag files here to upload</p>
          <p className="ant-upload-hint">
            Support for single or bulk upload. Strictly prohibit uploading company data or other banned files.
          </p>
        </Dragger>
      </Card>
    </>
  );
};

export default MediaUpload;
