import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    handleClose();
    navigate('/login');
  };

  const handleSignUp = () => {
    handleClose();
    navigate('/register');
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <IconButton
        aria-label="settings"
        aria-controls={open ? 'settings-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleSettingsClick}
        color="inherit"
        size="large"
      >
        <SettingsIcon />
      </IconButton>

      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'settings-button',
        }}
      >
        {isAuthenticated ? (
          <>
            <MenuItem disabled>
              <Typography variant="subtitle1">Welcome, {currentUser?.username}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogin}>Log In</MenuItem>
            <MenuItem onClick={handleSignUp}>Sign Up</MenuItem>
          </>
        )}
      </Menu>
    </nav>
  );
};

export default Navbar;
