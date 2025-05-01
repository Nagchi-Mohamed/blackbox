import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useAuth } from '../../../contexts/AuthContext';

jest.mock('../../../contexts/AuthContext');

describe('LoginForm', () => {
  it('validates email format', async () => {
    useAuth.mockReturnValue({ login: jest.fn() });
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});