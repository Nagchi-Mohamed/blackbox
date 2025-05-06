import { 
  AppBar, 
  Toolbar, 
  Typography, 
  useMediaQuery,
  Tooltip,
  Box,
  Select,
  MenuItem
} from '@mui/material';
import { Brightness4 } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import LanguageSelector from './LanguageSelector';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BrainyMath
          </Typography>
          
          {!isMobile && (
            <>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: 16 }}>
                {t('home')}
              </Link>
              <Link to="/classrooms" style={{ textDecoration: 'none', color: 'inherit', marginRight: 16 }}>
                {t('classrooms')}
              </Link>
              <Link to="/groups" style={{ textDecoration: 'none', color: 'inherit', marginRight: 16 }}>
                {t('groups')}
              </Link>
              <Link to="/forum" style={{ textDecoration: 'none', color: 'inherit', marginRight: 16 }}>
                {t('forum_label')}
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit', marginRight: 16 }}>
                {t('contact')}
              </Link>
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <LanguageSelector />
              <Select
                value={themeMode}
                onChange={(e) => toggleTheme(e.target.value)}
                sx={{ color: 'white', minWidth: 100 }}
                IconComponent={Brightness4}
              >
                <MenuItem value="light">{t('light')}</MenuItem>
                <MenuItem value="dark">{t('dark')}</MenuItem>
                <MenuItem value="blue">{t('blue')}</MenuItem>
              </Select>
          </Box>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
};

export default Layout;
