import React from 'react';
import MediaUpload from './Upload';
import MediaListing from './Listing';
import { useNavigate } from 'react-router-dom';

const MediaManagerPage = (props: any) => {
  const navigate = useNavigate();
  return   <MediaListing {...props} navigate={navigate} />
};

export default MediaManagerPage;
