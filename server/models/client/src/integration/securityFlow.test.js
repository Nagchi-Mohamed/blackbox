import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecuritySettings from '../pages/SecuritySettings';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' }
  }),
}));

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      id: 'user123',
      email: 'user@example.com',
      multiFactor: { enrolled: false }
    },
    enable2FA: jest.fn().mockResolvedValue({ verificationId: 'mock-verification-id' }),
    verify2FACode: jest.fn().mockResolvedValue(true),
    updateRecoveryOptions: jest.fn().mockResolvedValue({ success: true }),
    getLoginHistory: jest.fn().mockResolvedValue({
      items: [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          deviceType: 'desktop',
          location: 'New York, NY',
          ipAddress: '192.168.1.1',
          success: true
        }
      ],
      totalPages: 1
    })
  }),
  AuthProvider: ({ children }) => children
}));

describe('Security Settings Integration', () => {
  const renderSecuritySettings = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <SecuritySettings />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('complete 2FA setup flow', async () => {
    renderSecuritySettings();
    
    // Enable 2FA
    const enableButton = screen.getByText('twoFactor.setupTitle');
    fireEvent.click(enableButton);
    
    // Verify phone input appears
    const phoneInput = await screen.findByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    const sendCodeButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(sendCodeButton);
    
    // Verify code input appears
    const codeInput = await screen.findByLabelText('twoFactor.codeLabel');
    await userEvent.type(codeInput, '123456');
    
    const verifyButton = screen.getByText('twoFactor.verifyButton');
    fireEvent.click(verifyButton);
    
    // Verify success state
    await waitFor(() => {
      expect(screen.getByText('twoFactor.successMessage')).toBeInTheDocument();
    });
  });

  test('account recovery update flow', async () => {
    renderSecuritySettings();
    
    // Edit recovery email
    const editButton = screen.getByLabelText('accountRecovery.editEmail');
    fireEvent.click(editButton);
    
    const emailInput = screen.getByLabelText('accountRecovery.emailLabel');
    await userEvent.type(emailInput, 'recovery@example.com');
    
    const saveButton = screen.getByText('accountRecovery.saveButton');
    fireEvent.click(saveButton);
    
    // Verify successful update
    await waitFor(() => {
      expect(screen.getByText('accountRecovery.successMessage')).toBeInTheDocument();
    });
  });

  test('notification preferences flow', async () => {
    renderSecuritySettings();
    
    // Toggle notification settings
    const newDeviceToggle = screen.getByLabelText('notifications.newDevice');
    fireEvent.click(newDeviceToggle);
    
    // Verify state change
    await waitFor(() => {
      expect(newDeviceToggle).not.toBeChecked();
    });
  });

  test('login history display', async () => {
    renderSecuritySettings();
    
    // Verify login history table appears
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });
  });

  test('error handling in 2FA setup', async () => {
    // Mock enable2FA to reject
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: {
        id: 'user123',
        email: 'user@example.com',
        multiFactor: { enrolled: false }
      },
      enable2FA: jest.fn().mockRejectedValue(new Error('Failed to enable 2FA')),
      verify2FACode: jest.fn().mockResolvedValue(true),
      updateRecoveryOptions: jest.fn().mockResolvedValue({ success: true }),
      getLoginHistory: jest.fn().mockResolvedValue({
        items: [],
        totalPages: 0
      })
    }));
    
    renderSecuritySettings();
    
    const enableButton = screen.getByText('twoFactor.setupTitle');
    fireEvent.click(enableButton);
    
    const phoneInput = await screen.findByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    const sendCodeButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(sendCodeButton);
    
    await waitFor(() => {
      expect(screen.getByText('twoFactor.errorMessage')).toBeInTheDocument();
    });
  });

  test('error handling in recovery options update', async () => {
    // Mock updateRecoveryOptions to reject
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: {
        id: 'user123',
        email: 'user@example.com',
        multiFactor: { enrolled: false }
      },
      enable2FA: jest.fn().mockResolvedValue({ verificationId: 'mock-verification-id' }),
      verify2FACode: jest.fn().mockResolvedValue(true),
      updateRecoveryOptions: jest.fn().mockRejectedValue(new Error('Failed to update')),
      getLoginHistory: jest.fn().mockResolvedValue({
        items: [],
        totalPages: 0
      })
    }));
    
    renderSecuritySettings();
    
    const editButton = screen.getByLabelText('accountRecovery.editEmail');
    fireEvent.click(editButton);
    
    const emailInput = screen.getByLabelText('accountRecovery.emailLabel');
    await userEvent.type(emailInput, 'recovery@example.com');
    
    const saveButton = screen.getByText('accountRecovery.saveButton');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('accountRecovery.errorMessage')).toBeInTheDocument();
    });
  });
}); 