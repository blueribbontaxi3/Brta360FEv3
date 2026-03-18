import React from 'react';
import { TooltipProps } from 'recharts';
import { Typography } from 'antd';

const { Text } = Typography;

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label 
}) => {
  if (!active || !payload) return null;

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      padding: '8px 12px', 
      border: '1px solid #ccc',
      borderRadius: 4 
    }}>
      <Text strong>{label}</Text>
      {payload.map((entry:any, index:any) => (
        <div key={index} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
};