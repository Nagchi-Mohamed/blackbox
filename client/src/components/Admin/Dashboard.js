import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    users: 0,
    activeUsers: 0,
    lessons: 0,
    exercises: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>{t('admin.dashboard')}</h2>
      <div className="dashboard-grid">
        <div className="stats-card">
          <h3>{t('admin.users')}</h3>
          <p>{t('admin.total')}: {stats.users}</p>
          <p>{t('admin.active')}: {stats.activeUsers}</p>
        </div>
        <div className="stats-card">
          <h3>{t('admin.content')}</h3>
          <p>{t('admin.lessons')}: {stats.lessons}</p>
          <p>{t('admin.exercises')}: {stats.exercises}</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.activityData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;