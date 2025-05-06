import { Badge, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const notifications = []; // TODO: Connect to real notifications

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <List sx={{ width: 300 }}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListItem key={notification.id}>
                <ListItemText 
                  primary={notification.title}
                  secondary={notification.message}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No new notifications" />
            </ListItem>
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationBell;