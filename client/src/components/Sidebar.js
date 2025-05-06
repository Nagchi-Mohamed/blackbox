import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home as HomeIcon,
  School as ClassroomsIcon,
  Assignment as ExercisesIcon,
  Person as ProfileIcon
} from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { text: t('navigation.home'), icon: <HomeIcon />, path: '/dashboard' },
    { text: t('navigation.classrooms'), icon: <ClassroomsIcon />, path: '/dashboard/classrooms' },
    { text: t('navigation.exercises'), icon: <ExercisesIcon />, path: '/dashboard/exercises' },
    { text: t('navigation.profile'), icon: <ProfileIcon />, path: '/dashboard/profile' }
  ];

  return (
    <>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );
};

export default Sidebar;