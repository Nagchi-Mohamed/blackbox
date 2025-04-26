import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AppRoutes from './routes';
import './styles/global.css';

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ConfigProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ConfigProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
