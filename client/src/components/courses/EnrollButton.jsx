import React, { useState } from 'react';
import { Button, message } from 'antd';
import api from '../../api';

const EnrollButton = ({ courseId, isEnrolled, onEnrollSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      message.success('Successfully enrolled in course!');
      onEnrollSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      type="primary"
      onClick={handleEnroll}
      loading={loading}
      disabled={isEnrolled}
    >
      {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
    </Button>
  );
};

export default EnrollButton; 