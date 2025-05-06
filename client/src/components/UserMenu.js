import { useState } from 'react';
import { IconButton, Menu, MenuItem, Avatar, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const UserMenu = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ p: 0 }}>
        <Avatar 
          alt={currentUser?.name} 
          src={currentUser?.avatar}
          sx={{ 
            bgcolor: theme.palette.secondary.main,
            width: 32, 
            height: 32 
          }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          }
        }}
      >
        <MenuItem onClick={handleClose}>
          <Typography variant="body2">{t('user.profile')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Typography variant="body2">{t('user.settings')}</Typography>
        </MenuItem>
        <MenuItem onClick={logout}>
          <Typography variant="body2">{t('user.logout')}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;