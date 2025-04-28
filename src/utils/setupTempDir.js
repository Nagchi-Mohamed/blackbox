const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const TEMP_DIR = path.join(process.cwd(), 'temp');

/**
 * Create temp directory if it doesn't exist
 */
const setupTempDir = () => {
    try {
        if (!fs.existsSync(TEMP_DIR)) {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
            logger.info('Temp directory created');
        } else {
            logger.info('Temp directory already exists');
        }

        // Verify write permissions
        const testFile = path.join(TEMP_DIR, 'test.txt');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        logger.info('Verified write permissions in temp directory');
    } catch (error) {
        logger.error('Error setting up temp directory:', error);
        throw error;
    }
};

/**
 * Clean up old files in temp directory
 */
const setupThumbnailCleanup = () => {
    try {
        const files = fs.readdirSync(TEMP_DIR);
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        files.forEach(file => {
            const filePath = path.join(TEMP_DIR, file);
            const stats = fs.statSync(filePath);
            const age = now - stats.mtimeMs;

            if (age > maxAge) {
                fs.unlinkSync(filePath);
                logger.info(`Deleted old file: ${file}`);
            }
        });
    } catch (error) {
        logger.error('Error cleaning up temp directory:', error);
    }
};

module.exports = {
    setupTempDir,
    setupThumbnailCleanup
}; 