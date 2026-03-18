import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Typography, Upload } from 'antd';
import { UploadProps } from 'antd/lib';
import { getMediaBaseUrl } from '../../../configs/env.config';

const { Paragraph } = Typography;

const Single = (props: any) => {
  const { image, setImage, title, fileType, beforeUpload } = props;
  const [loading, setLoading] = useState(false);

  const handleChange: UploadProps['onChange'] = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const { data } = info?.file?.response;
      if (data) {
        setImage(data);
        setLoading(false);
      }
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // Using environment variable for base URL
  const baseUrl = getMediaBaseUrl();

  return (
    <>

      {title && <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>}
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        action={baseUrl + '/api/v1/media'}
        onChange={handleChange}
        multiple={true}
      >
        {image ? <img src={image?.url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </>
  );
};

export default Single;