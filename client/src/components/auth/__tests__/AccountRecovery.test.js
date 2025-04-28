import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AccountRecovery from '../AccountRecovery';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      id: 'user123',
      email: 'user@example.com',
      recoveryEmail: 'recovery@example.com',
      recoveryPhone: '+1234567890'
    },
    updateRecoveryOptions: jest.fn().mockResolvedValue({ success: true })
  }),
}));

describe('AccountRecovery Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders recovery options correctly', () => {
    render(<AccountRecovery />);
    
    expect(screen.getByText('accountRecovery.title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('recovery@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
  });

  test('handles email input changes', async () => {
    render(<AccountRecovery />);
    
    const emailInput = screen.getByLabelText('accountRecovery.emailLabel');
    await userEvent.type(emailInput, 'new@example.com');
    
    expect(emailInput.value).toBe('new@example.com');
  });

  test('handles phone input changes', async () => {
    render(<AccountRecovery />);
    
    const phoneInput = screen.getByLabelText('accountRecovery.phoneLabel');
    await userEvent.type(phoneInput, '+9876543210');
    
    expect(phoneInput.value).toBe('+9876543210');
  });

  test('shows loading state when saving', async () => {
    render(<AccountRecovery />);
    
    const saveButton = screen.getByText('accountRecovery.saveButton');
    fireEvent.click(saveButton);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows success message after saving', async () => {
    render(<AccountRecovery />);
    
    const emailInput = screen.getByLabelText('accountRecovery.emailLabel');
    const saveButton = screen.getByText('accountRecovery.saveButton');
    
    await userEvent.type(emailInput, 'new@example.com');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('accountRecovery.successMessage')).toBeInTheDocument();
    });
  });

  test('shows error message when saving fails', async () => {
    // Mock updateRecoveryOptions to reject
    jest.spyOn(require('../../../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: {
        id: 'user123',
        email: 'user@example.com',
        recoveryEmail: 'recovery@example.com',
        recoveryPhone: '+1234567890'
      },
      updateRecoveryOptions: jest.fn().mockRejectedValue(new Error('Update failed'))
    }));
    
    render(<AccountRecovery />);
    
    const saveButton = screen.getByText('accountRecovery.saveButton');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('accountRecovery.errorMessage')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<AccountRecovery />);
    
    const emailInput = screen.getByLabelText('accountRecovery.emailLabel');
    const saveButton = screen.getByText('accountRecovery.saveButton');
    
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.click(saveButton);
    
    expect(screen.getByText('accountRecovery.invalidEmail')).toBeInTheDocument();
  });

  test('validates phone format', async () => {
    render(<AccountRecovery />);
    
    const phoneInput = screen.getByLabelText('accountRecovery.phoneLabel');
    const saveButton = screen.getByText('accountRecovery.saveButton');
    
    await userEvent.type(phoneInput, 'invalid-phone');
    fireEvent.click(saveButton);
    
    expect(screen.getByText('accountRecovery.invalidPhone')).toBeInTheDocument();
  });

  test('handles empty recovery options', () => {
    // Mock empty recovery options
    jest.spyOn(require('../../../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: {
        id: 'user123',
        email: 'user@example.com'
      },
      updateRecoveryOptions: jest.fn().mockResolvedValue({ success: true })
    }));
    
    render(<AccountRecovery />);
    
    expect(screen.getByPlaceholderText('accountRecovery.emailPlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('accountRecovery.phonePlaceholder')).toBeInTheDocument();
  });
}); 