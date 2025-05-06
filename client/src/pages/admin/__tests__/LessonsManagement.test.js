import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonsManagement from '../../components/admin/LessonsManagement';

describe('LessonsManagement', () => {
  test('renders LessonsManagement component', () => {
    render(<LessonsManagement />);
    expect(screen.getByText(/Lessons Management/i)).toBeInTheDocument();
  });
});
