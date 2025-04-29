import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const MainLayout = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenu}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            {t('common.welcome')}
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Button color="inherit" onClick={() => navigate('/classroom')}>
              {t('navigation.classroom')}
            </Button>
            <Button color="inherit" onClick={() => navigate('/exercises')}>
              {t('navigation.exercises')}
            </Button>
          </Box>

          <IconButton color="inherit">
            <Notifications />
          </IconButton>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {currentUser?.photoURL ? (
              <Avatar
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
          {t('user.profile')}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/security'); }}>
          {t('user.security')}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
          {t('user.settings')}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
          {t('user.logout')}
        </MenuItem>
      </Menu>

      <Menu
        id="mobile-menu"
        anchorEl={mobileMenuAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMobileMenuClose}
      >
        <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/classroom'); }}>
          {t('navigation.classroom')}
        </MenuItem>
        <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/exercises'); }}>
          {t('navigation.exercises')}
        </MenuItem>
      </Menu>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 