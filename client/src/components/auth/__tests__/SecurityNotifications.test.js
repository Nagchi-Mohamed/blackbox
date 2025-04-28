import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityNotifications from '../SecurityNotifications';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('SecurityNotifications Component', () => {
  beforeEach(() => {
    // Clear localStorage mock
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn(() => null);
  });

  test('renders notification toggles', () => {
    render(<SecurityNotifications />);
    
    expect(screen.getByText('notifications.title')).toBeInTheDocument();
    expect(screen.getByText('notifications.newDevice')).toBeInTheDocument();
    expect(screen.getByText('notifications.loginAttempt')).toBeInTheDocument();
    expect(screen.getByText('notifications.passwordChange')).toBeInTheDocument();
    expect(screen.getByText('notifications.twoFactorChange')).toBeInTheDocument();
  });

  test('loads saved preferences', () => {
    const savedPrefs = {
      newDevice: false,
      loginAttempt: true,
      passwordChange: false,
      twoFactorChange: true
    };
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(savedPrefs));
    
    render(<SecurityNotifications />);
    
    const newDeviceToggle = screen.getByLabelText('notifications.newDevice');
    const loginAttemptToggle = screen.getByLabelText('notifications.loginAttempt');
    const passwordChangeToggle = screen.getByLabelText('notifications.passwordChange');
    const twoFactorChangeToggle = screen.getByLabelText('notifications.twoFactorChange');
    
    expect(newDeviceToggle).not.toBeChecked();
    expect(loginAttemptToggle).toBeChecked();
    expect(passwordChangeToggle).not.toBeChecked();
    expect(twoFactorChangeToggle).toBeChecked();
  });

  test('saves preference changes', () => {
    render(<SecurityNotifications />);
    
    const newDeviceToggle = screen.getByLabelText('notifications.newDevice');
    fireEvent.click(newDeviceToggle);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'notificationPrefs',
      expect.stringContaining('"newDevice":false')
    );
  });

  test('handles invalid saved preferences', () => {
    Storage.prototype.getItem = jest.fn(() => '{invalid json');
    
    render(<SecurityNotifications />);
    
    // All toggles should be in default state (checked)
    const toggles = screen.getAllByRole('checkbox');
    expect(toggles.every(toggle => toggle.checked)).toBe(true);
  });

  test('handles localStorage errors', () => {
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error('Storage error');
    });
    
    render(<SecurityNotifications />);
    
    const newDeviceToggle = screen.getByLabelText('notifications.newDevice');
    fireEvent.click(newDeviceToggle);
    
    // Component should not crash
    expect(screen.getByText('notifications.title')).toBeInTheDocument();
  });

  test('maintains state between renders', () => {
    const { rerender } = render(<SecurityNotifications />);
    
    const newDeviceToggle = screen.getByLabelText('notifications.newDevice');
    fireEvent.click(newDeviceToggle);
    
    // Rerender component
    rerender(<SecurityNotifications />);
    
    // State should be preserved
    expect(newDeviceToggle).not.toBeChecked();
  });

  test('displays correct toggle labels', () => {
    render(<SecurityNotifications />);
    
    expect(screen.getByText('notifications.newDevice')).toBeInTheDocument();
    expect(screen.getByText('notifications.loginAttempt')).toBeInTheDocument();
    expect(screen.getByText('notifications.passwordChange')).toBeInTheDocument();
    expect(screen.getByText('notifications.twoFactorChange')).toBeInTheDocument();
  });

  test('handles multiple preference changes', () => {
    render(<SecurityNotifications />);
    
    const newDeviceToggle = screen.getByLabelText('notifications.newDevice');
    const loginAttemptToggle = screen.getByLabelText('notifications.loginAttempt');
    
    fireEvent.click(newDeviceToggle);
    fireEvent.click(loginAttemptToggle);
    
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(newDeviceToggle).not.toBeChecked();
    expect(loginAttemptToggle).not.toBeChecked();
  });
}); 