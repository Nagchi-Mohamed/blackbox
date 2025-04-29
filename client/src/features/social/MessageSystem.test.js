import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessageSystem from './MessageSystem';
import { useTranslation } from 'react-i18next';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

describe('MessageSystem Component', () => {
  const mockCurrentUser = {
    uid: 'test-user-id',
    displayName: 'Test User'
  };

  const mockMessages = [
    {
      id: '1',
      text: 'Hello',
      senderId: 'test-user-id',
      senderName: 'Test User',
      timestamp: { toDate: () => new Date() }
    },
    {
      id: '2',
      text: 'Hi there',
      senderId: 'other-user-id',
      senderName: 'Other User',
      timestamp: { toDate: () => new Date() }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock onSnapshot to simulate real-time updates
    onSnapshot.mockImplementation((q, callback) => {
      callback({ docs: mockMessages.map(msg => ({ id: msg.id, data: () => msg })) });
      return () => {};
    });
  });

  test('renders message list', async () => {
    render(<MessageSystem currentUser={mockCurrentUser} />);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there')).toBeInTheDocument();
    });
  });

  test('sends new message', async () => {
    render(<MessageSystem currentUser={mockCurrentUser} />);

    const input = screen.getByPlaceholderText('chat.typeMessage');
    const sendButton = screen.getByText('chat.send');

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(sendButton);

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        text: 'New message',
        senderId: 'test-user-id',
        senderName: 'Test User'
      })
    );
  });

  test('disables send button when message is empty', () => {
    render(<MessageSystem currentUser={mockCurrentUser} />);

    const sendButton = screen.getByText('chat.send');
    expect(sendButton).toBeDisabled();
  });

  test('shows loading state initially', () => {
    render(<MessageSystem currentUser={mockCurrentUser} />);
    expect(screen.getByText('common.loading')).toBeInTheDocument();
  });

  test('displays messages with correct styling based on sender', async () => {
    render(<MessageSystem currentUser={mockCurrentUser} />);

    await waitFor(() => {
      const userMessage = screen.getByText('Hello').closest('div');
      const otherMessage = screen.getByText('Hi there').closest('div');

      expect(userMessage).toHaveStyle({ backgroundColor: 'primary.main' });
      expect(otherMessage).toHaveStyle({ backgroundColor: 'grey.200' });
    });
  });
}); 