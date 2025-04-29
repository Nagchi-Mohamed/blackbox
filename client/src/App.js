import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Classroom from './pages/Classroom';
import Exercises from './pages/Exercises';
import ProfilePage from './pages/ProfilePage';
import SecuritySettings from './pages/SecuritySettings';
import AdminPage from './pages/AdminPage';
import TeacherPage from './pages/TeacherPage';
import './lib/i18n';
import './App.css';
import FirebaseTest from './components/FirebaseTest';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/classroom" element={<ProtectedRoute><Classroom /></ProtectedRoute>} />
              <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
              <Route 
                path="/admin" 
                element={
                  <RoleRoute requiredRoles={{ isAdmin: true }}>
                    <AdminPage />
                  </RoleRoute>
                } 
              />
              <Route 
                path="/teacher" 
                element={
                  <RoleRoute requiredRoles={{ isTeacher: true }}>
                    <TeacherPage />
                  </RoleRoute>
                } 
              />
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </MainLayout>
          <FirebaseTest />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
