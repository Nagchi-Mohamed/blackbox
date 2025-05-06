import React from 'react';
import { render, screen } from '@testing-library/react';
import ExercisesManagement from '../../components/admin/ExercisesManagement';

describe('ExercisesManagement', () => {
  test('renders ExercisesManagement component', () => {
    render(<ExercisesManagement />);
    expect(screen.getByText(/Exercises Management/i)).toBeInTheDocument();
  });
});
