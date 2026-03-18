import React, { useState } from 'react';
import Gallery from './Gallery';
import Single from './Single';
import { Upload, message } from 'antd';
const ImageUpload = (props: any) => {
  const {multiple,fileType} = props;

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith('image/');
    const type = file.type.replace("image/", "");
    const fileTypeArray = fileType.split(',')
    if (!fileTypeArray.includes(type)) {
      message.error(`You can only upload ${fileType} files!`);
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }

    return isImage && isLt2M;
  };

  return (
    <>
      {
        multiple ?
        <Gallery {...props} beforeUpload={beforeUpload}/> :
        <Single {...props} beforeUpload={beforeUpload}/>
      }
    </>
  );
};

export default ImageUpload;