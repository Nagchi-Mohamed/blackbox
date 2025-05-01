import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AchievementCard from './AchievementCard';

const AchievementsList = ({ userId }) => {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const response = await fetch(`/api/users/${userId}/achievements`);
      const data = await response.json();
      setAchievements(data);
    };
    fetchAchievements();
  }, [userId]);

  return (
    <div className="achievements-container">
      <h2>{t('achievements.title')}</h2>
      <div className="achievements-grid">
        {achievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

export default AchievementsList;