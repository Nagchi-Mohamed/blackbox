import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageSystem from '../MessageSystem';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(),
}));

describe('MessageSystem Component', () => {
  const mockUser = {
    uid: 'test123',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg'
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('should render message input and send button', () => {
    render(
      <AuthProvider>
        <MessageSystem currentUser={mockUser} />
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText(/type message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('should send message when form submitted', async () => {
    const testMessage = 'Hello class!';
    
    render(
      <AuthProvider>
        <MessageSystem currentUser={mockUser} />
      </AuthProvider>
    );

    const input = screen.getByPlaceholderText(/type message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: testMessage } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('should display received messages', async () => {
    const mockMessages = [
      {
        id: '1',
        text: 'Hello class!',
        sender: 'Test User',
        timestamp: new Date(),
      }
    ];

    // Mock onSnapshot callback
    const mockOnSnapshot = jest.fn((callback) => {
      callback({ docs: mockMessages.map(msg => ({ id: msg.id, data: () => msg })) });
      return () => {};
    });

    jest.requireMock('firebase/firestore').onSnapshot.mockImplementation(mockOnSnapshot);

    render(
      <AuthProvider>
        <MessageSystem currentUser={mockUser} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hello class!')).toBeInTheDocument();
    });
  });
}); 