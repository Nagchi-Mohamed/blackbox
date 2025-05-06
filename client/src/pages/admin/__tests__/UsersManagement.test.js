import React from 'react';
import { render, screen } from '@testing-library/react';
import UsersManagement from '../../components/admin/UsersManagement';

describe('UsersManagement', () => {
  test('renders UsersManagement component', () => {
    render(<UsersManagement />);
    expect(screen.getByText(/Users Management/i)).toBeInTheDocument();
  });
});
