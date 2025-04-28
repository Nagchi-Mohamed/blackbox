import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useTranslation } from 'react-i18next';

export default function TwoFactorSetup() {
  const { t } = useTranslation();
  const { enable2FA, verify2FACode, is2FAEnabled } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved
      }
    });
  };

  const handleEnable2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }

      const result = await enable2FA(phoneNumber, window.recaptchaVerifier);
      if (result.success) {
        setVerificationId(result.verificationId);
        setStep(2);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verify2FACode(verificationId, verificationCode);
      if (result.success) {
        setStep(3);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (is2FAEnabled) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-800">
          {t('auth.2fa.enabled')}
        </h3>
        <p className="mt-2 text-sm text-green-600">
          {t('auth.2fa.enabledDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {step === 1 && (
        <form onSubmit={handleEnable2FA} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              {t('auth.2fa.phoneNumber')}
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="+1234567890"
              required
            />
          </div>

          <div id="recaptcha-container"></div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('auth.2fa.enable')}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              {t('auth.2fa.verificationCode')}
            </label>
            <input
              type="text"
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="123456"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('auth.2fa.verify')}
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800">
            {t('auth.2fa.setupComplete')}
          </h3>
          <p className="mt-2 text-sm text-green-600">
            {t('auth.2fa.setupCompleteDescription')}
          </p>
        </div>
      )}
    </div>
  );
} 