import React from 'react';
import { useTranslation } from 'react-i18next';

const AchievementCard = ({ achievement }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  return (
    <div className={`achievement-card ${achievement.progress === 100 ? 'unlocked' : 'locked'}`}>
      <div className="achievement-icon">
        <img src={achievement.icon} alt={achievement.name[language]} />
      </div>
      <div className="achievement-details">
        <h3>{achievement.name[language]}</h3>
        <p>{achievement.description[language]}</p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${achievement.progress}%` }}
          ></div>
        </div>
        <span>{achievement.progress}% {t('achievements.complete')}</span>
      </div>
    </div>
  );
};

export default AchievementCard;