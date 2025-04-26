const fs = require('fs');
const path = require('path');

function setupTempDir() {
  try {
    const tempPath = path.join(__dirname, '../../temp');
    
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
      console.log('Created temp directory for thumbnails');
    } else {
      console.log('Temp directory already exists');
    }

    // Verify write permissions
    const testFile = path.join(tempPath, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('Verified write permissions in temp directory');
  } catch (error) {
    console.error('Error setting up temp directory:', error);
    process.exit(1);
  }
}

function setupThumbnailCleanup() {
  const tempPath = path.join(__dirname, '../../temp');
  
  // Clean up old thumbnails periodically (every hour)
  setInterval(() => {
    try {
      if (fs.existsSync(tempPath)) {
        const files = fs.readdirSync(tempPath);
        const now = Date.now();
        
        files.forEach(file => {
          const filePath = path.join(tempPath, file);
          const stats = fs.statSync(filePath);
          
          // Remove files older than 24 hours
          if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up old thumbnail: ${file}`);
          }
        });
      }
    } catch (error) {
      console.error('Error cleaning up thumbnails:', error);
    }
  }, 60 * 60 * 1000); // Run every hour
}

// Run the setup
setupTempDir();

module.exports = {
  setupTempDir,
  setupThumbnailCleanup
}; 