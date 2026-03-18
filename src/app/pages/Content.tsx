import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Space, theme } from 'antd';

const Content: React.FC = (props: any) => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {props.children}
        </div>
    );
};

export default Content;