import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h4">{t('profile_page_title')}</Typography>
      {/* Add profile content here */}
    </div>
  );
};

export default Profile;
