import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemText, Divider, Menu, MenuItem, Avatar, Button, CssBaseline } from '@mui/material';
import { Menu as MenuIcon, Notifications } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import LanguageSelector from '../common/LanguageSelector';
import ThemeToggle from '../common/ThemeToggle';

const MainLayout = () => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['home', 'courses', 'exercises', 'forum', 'classroom', 'social'].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={t(`navigation.${text}`)} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            MathSphere
          </Typography>
          <ThemeToggle />
          <LanguageSelector />
          {currentUser ? (
            <>
              <IconButton color="inherit">
                <Notifications />
              </IconButton>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <Avatar 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => navigate('/profile')}>
                  {t('user.profile')}
                </MenuItem>
                <MenuItem onClick={() => navigate('/security')}>
                  {t('user.security')}
                </MenuItem>
                <MenuItem onClick={() => navigate('/settings')}>
                  {t('user.settings')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  {t('user.logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => navigate('/auth')}
            >
              {t('auth.login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout; 