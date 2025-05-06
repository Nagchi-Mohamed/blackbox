import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme';
import { AuthProvider } from './context/AuthContext';
import { LessonsProvider } from './context/LessonsContext';
import { ThemeContext } from './context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFoundPage from './pages/NotFoundPage';
import GroupsPage from './pages/GroupsPage';
import ForumPage from './pages/ForumPage';
import ContactPage from './pages/ContactPage';
import ClassroomPage from './pages/ClassroomPage';
import ClassroomDetailPage from './pages/ClassroomDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Add this import
import { ClassroomProvider } from './components/classroom/ClassroomProvider'; // Changed from default import
import ClassroomLayout from './components/classroom/ClassroomLayout'; // And this one
import LessonsPage from './pages/LessonsPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [themeMode, setThemeMode] = React.useState('light');

  const toggleTheme = (mode) => {
    setThemeMode(mode);
  };

  const theme = React.useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <LessonsProvider>
                <Layout>
                  <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/classrooms" element={<ClassroomPage />} />
                  <Route path="/classrooms/:id" element={<ClassroomDetailPage />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/forum" element={<ForumPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/lessons" element={<LessonsPage />} />
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/classroom" 
                    element={
                      <ProtectedRoute>
                        <ClassroomProvider>
                          <ClassroomLayout />
                        </ClassroomProvider>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
              </LessonsProvider>
            </AuthProvider>
          </ThemeProvider>
        </Router>
      </ThemeContext.Provider>
    </I18nextProvider>
  );
}

export default App;
