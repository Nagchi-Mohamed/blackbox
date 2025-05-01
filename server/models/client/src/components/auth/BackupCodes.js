import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
  Box,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { ContentCopy, Refresh, DoneAll } from '@mui/icons-material';

const BackupCodes = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateNewCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Generate 10 backup codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase() + 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
      setCopied(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && currentUser?.multiFactor?.enrolled) {
      generateNewCodes();
    }
  }, [open, currentUser?.multiFactor?.enrolled, generateNewCodes]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Backup Codes</title></head>
        <body>
          <h1>Your Backup Codes</h1>
          <pre>${backupCodes.join('\n')}</pre>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('security.backupCodes.title')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            {t('security.backupCodes.warning')}
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    {t('security.backupCodes.yourCodes')}
                  </Typography>
                  <Box>
                    <Tooltip title={t('security.backupCodes.copy')}>
                      <IconButton 
                        onClick={handleCopy}
                        disabled={backupCodes.length === 0}
                      >
                        {copied ? <DoneAll color="success" /> : <ContentCopy />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('security.backupCodes.refresh')}>
                      <IconButton 
                        onClick={generateNewCodes}
                        disabled={loading}
                      >
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Box 
                  component="div"
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    fontFamily: 'monospace',
                    fontSize: '1.1rem'
                  }}
                >
                  {backupCodes.map((code, index) => (
                    <div key={index}>{code}</div>
                  ))}
                </Box>
              </Paper>

              <Typography variant="body2" color="text.secondary">
                {t('security.backupCodes.instructions')}
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.close')}
        </Button>
        <Button
          onClick={handlePrint}
          disabled={loading || backupCodes.length === 0}
        >
          {t('security.backupCodes.print')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BackupCodes; 