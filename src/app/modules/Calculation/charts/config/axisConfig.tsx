import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const CustomAxisTick = ({ x, y, payload }: any) => (
  <Text
    style={{
      transform: `translate(${x}px, ${y}px)`,
      fontSize: 12,
      textAnchor: 'middle',
    }}
  >
    {payload.value}
  </Text>
);

export const axisProps = {
  tick: CustomAxisTick,
  axisLine: { stroke: '#666' },
  tickLine: { stroke: '#666' },
};