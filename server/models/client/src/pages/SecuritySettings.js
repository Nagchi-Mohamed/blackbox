import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  CircularProgress
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TwoFactorAuth from '../components/auth/TwoFactorAuth';
import AccountDeletion from '../components/auth/AccountDeletion';
import SessionManagement from '../components/auth/SessionManagement';
import BackupCodes from '../components/auth/BackupCodes';
import SecurityNotifications from '../components/auth/SecurityNotifications';
import LoginHistory from '../components/auth/LoginHistory';
import AccountRecovery from '../components/auth/AccountRecovery';
import { useAuth } from '../contexts/AuthContext';

export default function SecuritySettings() {
  const { t } = useTranslation();
  const { is2FAEnabled } = useAuth();
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        setLoading(true);
        // Add your API calls here to load security settings
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadSecuritySettings();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('security.title')}
      </Typography>

      <AccountRecovery />

      <SessionManagement />

      <SecurityNotifications />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('security.twoFactor.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('security.twoFactor.description')}
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon color={is2FAEnabled ? "success" : "action"} />
            </ListItemIcon>
            <ListItemText
              primary={is2FAEnabled ? t('security.twoFactor.enabled') : t('security.twoFactor.disabled')}
              secondary={t('security.twoFactor.status')}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShow2FADialog(true)}
              >
                {is2FAEnabled ? t('security.twoFactor.manage') : t('security.twoFactor.enable')}
              </Button>
              {is2FAEnabled && (
                <Button
                  variant="outlined"
                  onClick={() => setShowBackupCodes(true)}
                >
                  {t('security.twoFactor.backupCodes')}
                </Button>
              )}
            </Box>
          </ListItem>
        </List>
      </Paper>

      <LoginHistory />

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          {t('security.dangerZone')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('security.dangerZoneDescription')}
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <DeleteForeverIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary={t('security.deleteAccount.title')}
              secondary={t('security.deleteAccount.description')}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowDeleteDialog(true)}
            >
              {t('security.deleteAccount.button')}
            </Button>
          </ListItem>
        </List>
      </Paper>

      <Dialog
        open={show2FADialog}
        onClose={() => setShow2FADialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <TwoFactorAuth
          open={show2FADialog}
          onClose={() => setShow2FADialog(false)}
        />
      </Dialog>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <AccountDeletion
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      </Dialog>

      <BackupCodes
        open={showBackupCodes}
        onClose={() => setShowBackupCodes(false)}
      />
    </Container>
  );
} 