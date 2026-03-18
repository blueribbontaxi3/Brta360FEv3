import React from 'react';
import { Image } from 'antd';
import { FileImageOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined, FilePptOutlined, FileOutlined, FileTextOutlined } from '@ant-design/icons';
import DefaultImage from '../../../assets/logo.png';


const getIconByMimeType = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) return <FileImageOutlined />;
    if (mimeType?.includes('pdf')) return <FilePdfOutlined
        style={{
            fontSize: "70px",
            color: "red",
        }}
    />;
    if (mimeType?.includes('word')) return <FileWordOutlined />;
    if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return <FileExcelOutlined />;
    if (mimeType?.includes('powerpoint') || mimeType?.includes('presentation')) return <FilePptOutlined />;
    return  <FileTextOutlined
    style={{
      fontSize: "50px",
      color: "#faad14",
    }}
  />;
};

export const FilePreview: React.FC<any> = ({ file, preview = false, style = {} }) => {
    if (!file) {
        return <img src={DefaultImage} alt="Default" style={{ ...style, objectFit: 'cover' }} />;
    }

    if (file?.mime_type?.startsWith('image/')) {
        return (
            <Image
                alt={file.name}
                src={file.url}
                preview={preview}
                style={{ ...style, objectFit: 'cover' }}
            />
        );
    }

    return (
        <div style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#8c8c8c'
        }}>
            {getIconByMimeType(file.mime_type)}
        </div>
    );
};