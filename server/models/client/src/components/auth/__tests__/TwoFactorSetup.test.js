import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TwoFactorSetup from '../TwoFactorSetup';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    enable2FA: jest.fn().mockResolvedValue({ verificationId: 'test-verification-id' }),
    verify2FACode: jest.fn().mockResolvedValue(true),
  }),
}));

// Mock the RecaptchaVerifier
const mockRecaptchaVerifier = {
  clear: jest.fn(),
  render: jest.fn(),
};

global.RecaptchaVerifier = jest.fn(() => mockRecaptchaVerifier);

describe('TwoFactorSetup Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders initial setup form', () => {
    render(<TwoFactorSetup />);
    
    expect(screen.getByText('twoFactor.setupTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('twoFactor.phoneLabel')).toBeInTheDocument();
    expect(screen.getByText('twoFactor.enableButton')).toBeInTheDocument();
  });

  test('handles phone number input', async () => {
    render(<TwoFactorSetup />);
    
    const phoneInput = screen.getByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    expect(phoneInput.value).toBe('+1234567890');
  });

  test('shows loading state when enabling 2FA', async () => {
    render(<TwoFactorSetup />);
    
    const phoneInput = screen.getByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    const enableButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(enableButton);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows verification code input after enabling 2FA', async () => {
    render(<TwoFactorSetup />);
    
    const phoneInput = screen.getByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    const enableButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(enableButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText('twoFactor.codeLabel')).toBeInTheDocument();
    });
  });

  test('handles verification code input', async () => {
    render(<TwoFactorSetup />);
    
    // First enable 2FA
    const phoneInput = screen.getByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    const enableButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(enableButton);
    
    // Then enter verification code
    await waitFor(() => {
      const codeInput = screen.getByLabelText('twoFactor.codeLabel');
      userEvent.type(codeInput, '123456');
      expect(codeInput.value).toBe('123456');
    });
  });

  test('shows success message after verification', async () => {
    render(<TwoFactorSetup />);
    
    // Enable 2FA
    const phoneInput = screen.getByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    const enableButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(enableButton);
    
    // Verify code
    await waitFor(async () => {
      const codeInput = screen.getByLabelText('twoFactor.codeLabel');
      await userEvent.type(codeInput, '123456');
      
      const verifyButton = screen.getByText('twoFactor.verifyButton');
      fireEvent.click(verifyButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('twoFactor.successMessage')).toBeInTheDocument();
    });
  });

  test('shows error message when verification fails', async () => {
    // Mock verify2FACode to reject
    jest.spyOn(require('../../../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      enable2FA: jest.fn().mockResolvedValue({ verificationId: 'test-verification-id' }),
      verify2FACode: jest.fn().mockRejectedValue(new Error('Invalid code')),
    }));
    
    render(<TwoFactorSetup />);
    
    // Enable 2FA
    const phoneInput = screen.getByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    const enableButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(enableButton);
    
    // Verify code
    await waitFor(async () => {
      const codeInput = screen.getByLabelText('twoFactor.codeLabel');
      await userEvent.type(codeInput, '123456');
      
      const verifyButton = screen.getByText('twoFactor.verifyButton');
      fireEvent.click(verifyButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('twoFactor.errorMessage')).toBeInTheDocument();
    });
  });

  test('validates phone number format', async () => {
    render(<TwoFactorSetup />);
    
    const phoneInput = screen.getByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, 'invalid-phone');
    
    const enableButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(enableButton);
    
    expect(screen.getByText('twoFactor.invalidPhone')).toBeInTheDocument();
  });

  test('validates verification code format', async () => {
    render(<TwoFactorSetup />);
    
    // Enable 2FA
    const phoneInput = screen.getByLabelText('twoFactor.phoneLabel');
    await userEvent.type(phoneInput, '+1234567890');
    
    const enableButton = screen.getByText('twoFactor.enableButton');
    fireEvent.click(enableButton);
    
    // Try invalid code
    await waitFor(async () => {
      const codeInput = screen.getByLabelText('twoFactor.codeLabel');
      await userEvent.type(codeInput, '12345'); // Too short
      
      const verifyButton = screen.getByText('twoFactor.verifyButton');
      fireEvent.click(verifyButton);
      
      expect(screen.getByText('twoFactor.invalidCode')).toBeInTheDocument();
    });
  });
}); 