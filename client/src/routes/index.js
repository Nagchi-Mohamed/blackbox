import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from '../components/common/Navbar';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Courses from '../pages/courses/Courses';
import CourseDetail from '../pages/courses/CourseDetail';
import Classroom from '../pages/classroom/Classroom';
import Enrollments from '../pages/enrollments/Enrollments';
import ProtectedRoute from './ProtectedRoute';

const { Content } = Layout;

const AppRoutes = () => {
  return (
    <Layout className="app-layout">
      <Navbar />
      <Content className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/classroom/:id" element={<Classroom />} />
            <Route path="/enrollments" element={<Enrollments />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default AppRoutes; 