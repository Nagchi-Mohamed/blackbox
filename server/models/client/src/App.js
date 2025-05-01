import AgoraRTC from 'agora-rtc-sdk-ng';
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
import TeacherDashboard from './features/teacher/TeacherDashboard';
import './lib/i18n';
import './App.css';
import { themes } from './theme';
import { Box } from '@mui/material';
import { ClassroomProvider } from './components/classroom/ClassroomProvider';
import ClassroomLayout from './components/classroom/ClassroomLayout';
import AgoraRTC from 'agora-rtc-sdk-ng';

function App() {
  const { i18n } = useTranslation();
  const themeMode = 'light';
  
  useEffect(() => {
    // Initialize Agora RTC when app loads
    AgoraRTC.setLogLevel(4); // Set appropriate log level
  }, []);

  return (
    <ThemeProvider theme={themes[themeMode]}>
      <Box sx={{ 
        direction: i18n.dir(),
        fontFamily: i18n.language === 'ar' ? "'Tajawal', sans-serif" : "'Roboto', sans-serif"
      }}>
        <AuthProvider>
          <Router>
            <MainLayout>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route 
                  path="/classroom" 
                  element={
                    <ProtectedRoute>
                      <ClassroomProvider>
                        <ClassroomLayout />
                      </ClassroomProvider>
                    </ProtectedRoute>
                  } 
                />
                <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
                <Route 
                  path="/teacher" 
                  element={
                    <RoleRoute requiredRoles={{ isTeacher: true }}>
                      <TeacherDashboard />
                    </RoleRoute>
                  } 
                />
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
            </MainLayout>
          </Router>
        </AuthProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;