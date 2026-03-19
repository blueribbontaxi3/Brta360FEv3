import React from 'react';

const Content: React.FC = (props: any) => {
  return (
    <div className="app-page-shell">
      <div className="page-content-surface">{props.children}</div>
    </div>
  );
};

export default Content;
