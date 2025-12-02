/**
 * 状态标签组件
 */

import React from 'react';
import { Tag } from 'antd';
import type { TagProps } from 'antd';

interface StatusTagProps extends Omit<TagProps, 'color'> {
  status: number | string;
  statusMap: Record<string | number, { label: string; color: string }>;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, statusMap, ...rest }) => {
  const config = statusMap[status];
  
  if (!config) {
    return <Tag color="default">未知</Tag>;
  }

  return (
    <Tag color={config.color} {...rest}>
      {config.label}
    </Tag>
  );
};

export default StatusTag;
