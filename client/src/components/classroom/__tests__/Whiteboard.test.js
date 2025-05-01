import React from 'react';
import { render, screen } from '@testing-library/react';
import Whiteboard from '../Whiteboard';

describe('Whiteboard Component', () => {
  it('renders without crashing', () => {
    render(<Whiteboard roomId="test-room" />);
    expect(screen.getByTestId('whiteboard-container')).toBeInTheDocument();
  });

  // Add more tests for drawing functionality, etc.
});