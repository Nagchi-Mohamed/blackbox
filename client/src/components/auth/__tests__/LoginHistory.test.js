import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginHistory from '../LoginHistory';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { id: 'user123' },
    getLoginHistory: jest.fn().mockResolvedValue({
      items: [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          deviceType: 'desktop',
          location: 'New York, NY',
          ipAddress: '192.168.1.1',
          success: true
        },
        {
          id: 2,
          timestamp: new Date().toISOString(),
          deviceType: 'mobile',
          location: 'San Francisco, CA',
          ipAddress: '10.0.0.1',
          success: false
        }
      ],
      totalPages: 1
    })
  }),
}));

describe('LoginHistory Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<LoginHistory />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays login history data', async () => {
    render(<LoginHistory />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // Header + 2 rows
  });

  test('displays correct device icons', async () => {
    render(<LoginHistory />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const desktopIcon = screen.getByTestId('desktop-icon');
    const mobileIcon = screen.getByTestId('mobile-icon');
    
    expect(desktopIcon).toBeInTheDocument();
    expect(mobileIcon).toBeInTheDocument();
  });

  test('displays correct status indicators', async () => {
    render(<LoginHistory />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const successChip = screen.getByTestId('success-chip');
    const failureChip = screen.getByTestId('failure-chip');
    
    expect(successChip).toBeInTheDocument();
    expect(failureChip).toBeInTheDocument();
  });

  test('handles empty login history', async () => {
    // Mock empty history
    jest.spyOn(require('../../../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: { id: 'user123' },
      getLoginHistory: jest.fn().mockResolvedValue({
        items: [],
        totalPages: 0
      })
    }));

    render(<LoginHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('loginHistory.noHistory')).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    // Mock error
    jest.spyOn(require('../../../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: { id: 'user123' },
      getLoginHistory: jest.fn().mockRejectedValue(new Error('Failed to fetch'))
    }));

    render(<LoginHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('loginHistory.error')).toBeInTheDocument();
    });
  });

  test('handles pagination', async () => {
    const mockGetLoginHistory = jest.fn().mockResolvedValue({
      items: [],
      totalPages: 3
    });

    jest.spyOn(require('../../../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: { id: 'user123' },
      getLoginHistory: mockGetLoginHistory
    }));

    render(<LoginHistory />);
    
    await waitFor(() => {
      expect(mockGetLoginHistory).toHaveBeenCalledWith(1);
    });
  });
}); 