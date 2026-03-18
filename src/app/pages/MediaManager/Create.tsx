import React from 'react';
import MediaUpload from './Upload';
import MediaListing from './Listing';
import { useNavigate } from 'react-router-dom';

const CreateMediaManagerPage = (props: any) => {
  const navigate = useNavigate();
  return   <MediaUpload {...props} navigate={navigate} />
};

export default CreateMediaManagerPage;
