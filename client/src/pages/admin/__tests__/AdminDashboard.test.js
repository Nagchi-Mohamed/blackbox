import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';

describe('AdminDashboard', () => {
  test('renders LessonsManagement by default and switches tabs', () => {
    render(<AdminDashboard />);

    // Check Lessons tab is active and LessonsManagement is rendered
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lessons/i })).toBeDisabled();
    expect(screen.getByText(/Lessons Management/i)).toBeInTheDocument();

    // Click Exercises tab and check ExercisesManagement is rendered
    fireEvent.click(screen.getByRole('button', { name: /Exercises/i }));
    expect(screen.getByRole('button', { name: /Exercises/i })).toBeDisabled();
    expect(screen.getByText(/Exercises Management/i)).toBeInTheDocument();

    // Click Users tab and check UsersManagement is rendered
    fireEvent.click(screen.getByRole('button', { name: /Users/i }));
    expect(screen.getByRole('button', { name: /Users/i })).toBeDisabled();
    expect(screen.getByText(/Users Management/i)).toBeInTheDocument();
  });
});
