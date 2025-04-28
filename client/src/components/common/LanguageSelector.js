import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Translate } from '@mui/icons-material';
import { useState } from 'react';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleCloseMenu();
  };

  return (
    <>
      <Tooltip title={t('settings.language')}>
        <IconButton onClick={handleOpenMenu} color="inherit">
          <Translate />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => changeLanguage('en')}>
          {t('languages.english')}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('fr')}>
          {t('languages.french')}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('ar')}>
          {t('languages.arabic')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSelector; 