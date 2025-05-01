import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  Alert
} from '@mui/material';
import {
  DesktopWindows as DesktopIcon,
  PhoneIphone as MobileIcon,
  Tablet as TabletIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailureIcon
} from '@mui/icons-material';

const LoginHistory = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        // Add your API call here to fetch login history
        const mockHistory = [
          {
            id: 1,
            date: new Date(),
            device: 'Desktop (Chrome)',
            location: 'New York, US',
            ip: '192.168.1.1',
            status: 'success'
          },
          {
            id: 2,
            date: new Date(Date.now() - 86400000),
            device: 'Mobile (Safari)',
            location: 'London, UK',
            ip: '192.168.1.2',
            status: 'failure'
          }
        ];
        setLoginHistory(mockHistory);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, [currentUser, t]);

  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('mobile')) {
      return <MobileIcon />;
    } else if (device.toLowerCase().includes('tablet')) {
      return <TabletIcon />;
    }
    return <DesktopIcon />;
  };

  const getStatusIcon = (status) => {
    return status === 'success' ? (
      <SuccessIcon color="success" />
    ) : (
      <FailureIcon color="error" />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('security.loginHistory.title')}
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('security.loginHistory.date')}</TableCell>
              <TableCell>{t('security.loginHistory.device')}</TableCell>
              <TableCell>{t('security.loginHistory.location')}</TableCell>
              <TableCell>{t('security.loginHistory.ip')}</TableCell>
              <TableCell>{t('security.loginHistory.status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loginHistory.map((login) => (
              <TableRow key={login.id}>
                <TableCell>
                  {new Date(login.date).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getDeviceIcon(login.device)}
                    {login.device}
                  </Box>
                </TableCell>
                <TableCell>{login.location}</TableCell>
                <TableCell>
                  <Tooltip title={t('security.loginHistory.ipTooltip')}>
                    <span>{login.ip}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {getStatusIcon(login.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default LoginHistory; 