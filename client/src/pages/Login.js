import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(username, password);
      if (!success) {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>
      <div style={{ marginTop: 20 }}>
        <Button
          variant="outlined"
          onClick={() => window.location.href = '/register'}
          fullWidth
        >
          Sign Up
        </Button>
      </div>
    </Container>
  );
};

export default LoginPage;
