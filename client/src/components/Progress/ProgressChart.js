import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ progressData }) => {
  const { t } = useTranslation();
  
  return (
    <div className="progress-chart">
      <h3>{t('progress.title')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={progressData}>
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;