import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Whiteboard from './Whiteboard';
import { useTranslation } from 'react-i18next';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// Mock fabric.js
jest.mock('fabric', () => ({
  Canvas: jest.fn().mockImplementation(() => ({
    isDrawingMode: true,
    freeDrawingBrush: {
      width: 2,
      color: '#000000',
    },
    clear: jest.fn(),
    setBackgroundColor: jest.fn(),
    renderAll: jest.fn(),
    dispose: jest.fn(),
  })),
}));

describe('Whiteboard Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders whiteboard container', () => {
    render(<Whiteboard />);
    const container = screen.getByRole('img', { name: /whiteboard/i });
    expect(container).toBeInTheDocument();
  });

  test('renders toolbar buttons', () => {
    render(<Whiteboard />);
    expect(screen.getByText('classroom.tools.pen')).toBeInTheDocument();
    expect(screen.getByText('classroom.tools.eraser')).toBeInTheDocument();
    expect(screen.getByText('classroom.tools.select')).toBeInTheDocument();
    expect(screen.getByText('classroom.tools.clear')).toBeInTheDocument();
  });

  test('changes tool when clicking buttons', () => {
    render(<Whiteboard />);
    const penButton = screen.getByText('classroom.tools.pen');
    const eraserButton = screen.getByText('classroom.tools.eraser');
    const selectButton = screen.getByText('classroom.tools.select');

    fireEvent.click(penButton);
    expect(penButton).toHaveClass('active');

    fireEvent.click(eraserButton);
    expect(eraserButton).toHaveClass('active');

    fireEvent.click(selectButton);
    expect(selectButton).toHaveClass('active');
  });

  test('clears canvas when clicking clear button', () => {
    render(<Whiteboard />);
    const clearButton = screen.getByText('classroom.tools.clear');
    fireEvent.click(clearButton);
    // Add assertions for canvas clear
  });
}); 