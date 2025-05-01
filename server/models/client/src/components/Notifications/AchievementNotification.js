import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AchievementNotification = ({ achievement }) => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="achievement-notification">
      <div className="notification-icon">
        <img src={achievement.icon} alt={achievement.name[i18n.language]} />
      </div>
      <div className="notification-content">
        <h3>{t('notifications.newAchievement')}</h3>
        <p>{achievement.name[i18n.language]}</p>
      </div>
    </div>
  );
};

export default AchievementNotification;