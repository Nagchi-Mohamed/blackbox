import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import WebSocketContext from '../../contexts/WebSocketContext';
import AchievementNotification from './AchievementNotification';

const NotificationCenter = () => {
  const { t } = useTranslation();
  const { notifications } = useContext(WebSocketContext);

  return (
    <div className="notification-center">
      <h3>{t('notifications.title')}</h3>
      {notifications.map((notification, index) => (
        <AchievementNotification 
          key={index} 
          achievement={notification} 
        />
      ))}
    </div>
  );
};

export default NotificationCenter;