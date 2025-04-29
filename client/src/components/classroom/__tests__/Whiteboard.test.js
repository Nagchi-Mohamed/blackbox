import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Whiteboard from '../Whiteboard';

describe('Whiteboard Component', () => {
  test('should render whiteboard with tools', () => {
    render(<Whiteboard />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
  });

  test('should allow drawing on canvas', () => {
    render(<Whiteboard />);
    const canvas = screen.getByTestId('whiteboard-canvas');
    
    // Simulate drawing
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    // Verify canvas has content
    const context = canvas.getContext('2d');
    expect(context.getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0)).toBeTruthy();
  });

  test('should clear canvas when clear button clicked', () => {
    render(<Whiteboard />);
    const canvas = screen.getByTestId('whiteboard-canvas');
    
    // Draw something first
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });
    fireEvent.mouseUp(canvas);

    // Clear the canvas
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    // Verify canvas is empty
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    expect(imageData.data.every(channel => channel === 0)).toBeTruthy();
  });
}); 