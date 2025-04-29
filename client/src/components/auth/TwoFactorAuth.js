import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { RecaptchaVerifier } from 'firebase/auth';

const TwoFactorAuth = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { enable2FA, verify2FACode } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    if (open) {
      // Initialize reCAPTCHA verifier
      const verifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
      setRecaptchaVerifier(verifier);
    }
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [open, recaptchaVerifier]);

  const handleEnable = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await enable2FA(phoneNumber, recaptchaVerifier);
      if (result.success) {
        setVerificationId(result.verificationId);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await verify2FACode(verificationId, verificationCode);
      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('security.twoFactor.title')}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {!verificationId ? (
          <Box>
            <Typography variant="body1" paragraph>
              {t('security.twoFactor.phoneDescription')}
            </Typography>
            <TextField
              fullWidth
              label={t('security.twoFactor.phoneNumber')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              margin="normal"
            />
            <div id="recaptcha-container" />
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" paragraph>
              {t('security.twoFactor.verificationDescription')}
            </Typography>
            <TextField
              fullWidth
              label={t('security.twoFactor.verificationCode')}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              margin="normal"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={verificationId ? handleVerify : handleEnable}
          variant="contained"
          disabled={loading || (!verificationId && !phoneNumber) || (verificationId && !verificationCode)}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : verificationId ? (
            t('security.twoFactor.verify')
          ) : (
            t('security.twoFactor.enable')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwoFactorAuth; 