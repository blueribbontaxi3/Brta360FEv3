import React, { useState } from 'react';
import { Tabs } from 'antd';
import MediaUpload from './Upload';
import MediaListing from './Listing';
import { useNavigate } from 'react-router-dom';

const MediaModalContent: React.FC<any> = (props) => {

    const [newMedia, setNewMedia]: any = useState(null);
    const eventMediaUpload = (data: any) => {
        setNewMedia(data)
    }
    return (
        <Tabs defaultActiveKey="library">
            <Tabs.TabPane tab="Upload Files" key="upload">
                <MediaUpload eventMediaUpload={eventMediaUpload} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Media Library" key="library">
                <MediaListing {...props} newMedia={newMedia} />
            </Tabs.TabPane>
        </Tabs>
    );
};

export default MediaModalContent;
