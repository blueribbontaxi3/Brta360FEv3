import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Image, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { getMediaBaseUrl } from '../../../configs/env.config';

const getBase64 = (file: any) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Gallery = (props: any) => {
  const { title, beforeUpload, fileList, setFileList } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const modifiedFileList = newFileList.map((file: any) => {
      if (file.response && file.status === 'done') {
        const { data } = file.response;

        return {
          uid: file.uid,
          url: data?.url,
          id: data?.id,
          status: file.status,
          name: data?.name,
        };
      }
      return file;
    });

    setFileList(modifiedFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const baseUrl = getMediaBaseUrl();

  return (
    <Card title={title}>
      <Upload
        action={`${baseUrl}/api/v1/media`}
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: setPreviewOpen,
            afterOpenChange: (visible) =>
              !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </Card>
  );
};

export default Gallery;
