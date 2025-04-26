import React from 'react';
import { Tag } from 'antd';

const statusColors = {
  active: 'blue',
  completed: 'green',
  dropped: 'red'
};

const EnrollmentStatus = ({ status }) => (
  <Tag color={statusColors[status] || 'default'}>
    {status?.toUpperCase()}
  </Tag>
);

export default EnrollmentStatus; 