const sendAchievementNotification = (wss, userId, achievement) => {
  wss.clients.forEach((client) => {
    if (client.userId === userId) {
      client.send(JSON.stringify({
        type: 'achievement',
        data: achievement
      }));
    }
  });
};

module.exports = {
  sendAchievementNotification
};