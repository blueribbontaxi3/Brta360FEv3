import React from 'react';
import { Progress, Steps } from 'antd';
import { CarOutlined } from '@ant-design/icons';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Steps component is 0-based, so subtract 1 for current
  const stepItems = Array.from({ length: totalSteps }, (_, idx) => ({
    title: `Step ${idx + 1}`,
    icon: idx === currentStep - 1 ? <CarOutlined /> : undefined,
  }));

  return (
    <div style={{ maxWidth: 500, margin: '0 auto 24px' }}>
      <Progress
        percent={Math.round((currentStep / totalSteps) * 100)}
        showInfo={false}
        strokeColor="#1677ff"
        style={{ marginBottom: 16 }}
      />
      <Steps
        current={currentStep - 1}
        items={stepItems}
        size="small"
        responsive={false}
      />
    </div>
  );
};

export default ProgressBar;