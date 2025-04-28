import { useState, useEffect } from 'react';
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
  const { currentUser, generate2FABackupCodes } = useAuth();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateNewCodes = async () => {
    setLoading(true);
    setError('');
    try {
      const { success, codes, error } = await generate2FABackupCodes(currentUser);
      if (!success) throw error;
      setCodes(codes);
      setCopied(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (open && currentUser?.multiFactor?.enrolled) {
      generateNewCodes();
    }
  }, [open]);

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
                        onClick={copyToClipboard}
                        disabled={codes.length === 0}
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
                  {codes.map((code, index) => (
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
        <Button onClick={onClose}>
          {t('common.close')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            window.print();
          }}
          disabled={codes.length === 0}
        >
          {t('security.backupCodes.print')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BackupCodes; 