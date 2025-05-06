import React, { useState } from 'react';
import LessonsManagement from '../../components/Admin/LessonsManagement.js';
import ExercisesManagement from '../../components/Admin/ExercisesManagement.js';
import UsersManagement from '../../components/Admin/UsersManagement.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('lessons')} disabled={activeTab === 'lessons'}>
          Lessons
        </button>
        <button onClick={() => setActiveTab('exercises')} disabled={activeTab === 'exercises'}>
          Exercises
        </button>
        <button onClick={() => setActiveTab('users')} disabled={activeTab === 'users'}>
          Users
        </button>
      </nav>
      <div>
        {activeTab === 'lessons' && <LessonsManagement />}
        {activeTab === 'exercises' && <ExercisesManagement />}
        {activeTab === 'users' && <UsersManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
