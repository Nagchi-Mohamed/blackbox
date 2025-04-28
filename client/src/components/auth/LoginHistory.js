import { useState, useEffect } from 'react';
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
  Chip,
  Tooltip,
  Alert
} from '@mui/material';
import {
  DesktopWindows as DesktopIcon,
  PhoneIphone as MobileIcon,
  Tablet as TabletIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const LoginHistory = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        // In a real app, you would fetch from your backend
        const mockData = [
          {
            id: 1,
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            deviceType: 'desktop',
            location: 'New York, NY',
            ipAddress: '192.168.1.1',
            success: true
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            deviceType: 'mobile',
            location: 'San Francisco, CA',
            ipAddress: '10.0.0.1',
            success: true
          },
          {
            id: 3,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            deviceType: 'tablet',
            location: 'London, UK',
            ipAddress: '172.16.0.1',
            success: false
          }
        ];
        setHistory(mockData);
      } catch (err) {
        setError(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, [currentUser]);

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'desktop': return <DesktopIcon fontSize="small" />;
      case 'mobile': return <MobileIcon fontSize="small" />;
      case 'tablet': return <TabletIcon fontSize="small" />;
      default: return <DesktopIcon fontSize="small" />;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t('security.loginHistory.title')}
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
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
              {history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {entry.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getDeviceIcon(entry.deviceType)}
                      <Box ml={1}>
                        {t(`security.loginHistory.devices.${entry.deviceType}`)}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{entry.location}</TableCell>
                  <TableCell>
                    <Tooltip title={t('security.loginHistory.ipTooltip')}>
                      <Chip label={entry.ipAddress} size="small" />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {entry.success ? (
                      <SuccessIcon color="success" />
                    ) : (
                      <WarningIcon color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default LoginHistory; 