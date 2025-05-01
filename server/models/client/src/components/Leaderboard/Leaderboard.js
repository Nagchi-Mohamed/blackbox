import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setTopUsers(data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>{t('leaderboard.title')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('leaderboard.rank')}</th>
            <th>{t('leaderboard.user')}</th>
            <th>{t('leaderboard.score')}</th>
            <th>{t('leaderboard.achievements')}</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.user.username}</td>
              <td>{user.score}</td>
              <td>{user.achievementsCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;