const Whiteboard = require('../models/Whiteboard');
const fs = require('fs');
const path = require('path');

let lastCleanupTime = null;
let lastCleanupStatus = null;

function startThumbnailCleanup() {
  // Run cleanup every 24 hours
  setInterval(async () => {
    try {
      await Whiteboard.cleanupOldThumbnails(7); // Clean up thumbnails older than 7 days
      lastCleanupTime = new Date();
      lastCleanupStatus = 'success';
      console.log('Thumbnail cleanup completed successfully');
    } catch (error) {
      lastCleanupStatus = 'error';
      console.error('Error during thumbnail cleanup:', error);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

  // Run initial cleanup
  Whiteboard.cleanupOldThumbnails(7)
    .then(() => {
      lastCleanupTime = new Date();
      lastCleanupStatus = 'success';
      console.log('Initial thumbnail cleanup completed');
    })
    .catch((error) => {
      lastCleanupStatus = 'error';
      console.error('Error during initial thumbnail cleanup:', error);
    });

  console.log('Thumbnail cleanup task started');
}

function getCleanupStatus() {
  return {
    lastCleanupTime,
    lastCleanupStatus,
    tempDirSize: getTempDirSize()
  };
}

function getTempDirSize() {
  try {
    const tempPath = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempPath)) return 0;

    const files = fs.readdirSync(tempPath);
    return files.reduce((total, file) => {
      const stats = fs.statSync(path.join(tempPath, file));
      return total + stats.size;
    }, 0);
  } catch (error) {
    console.error('Error getting temp directory size:', error);
    return -1;
  }
}

module.exports = {
  startThumbnailCleanup,
  getCleanupStatus
}; 