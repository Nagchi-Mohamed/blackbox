const LoginHistory = require('../models/LoginHistory');
const User = require('../models/User');
const Session = require('../models/Session');
const { validatePhone, validateEmail } = require('../utils/validators');
const logger = require('../utils/logger');

// Rate limiting configuration
const HISTORY_RATE_LIMIT = 50; // 50 requests per window
const RECOVERY_RATE_LIMIT = 5; // More sensitive endpoint

exports.getLoginHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const history = await LoginHistory.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await LoginHistory.countDocuments({ userId: req.user.id });
    
    res.json({
      items: history,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    logger.error('Error fetching login history:', error);
    next(error);
  }
};

exports.updateRecoveryOptions = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    const updates = {};
    
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          error: { code: 'invalid-email', message: 'Invalid email format' } 
        });
      }
      updates.recoveryEmail = email;
    }
    
    if (phone) {
      if (!validatePhone(phone)) {
        return res.status(400).json({ 
          error: { code: 'invalid-phone', message: 'Invalid phone format' } 
        });
      }
      updates.recoveryPhone = phone;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    );
    
    res.json({ 
      success: true,
      updatedFields: Object.keys(updates)
    });
  } catch (error) {
    logger.error('Error updating recovery options:', error);
    next(error);
  }
};

exports.revokeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    
    // Prevent revoking current session
    if (req.session.id === sessionId) {
      return res.status(400).json({
        error: { code: 'current-session', message: 'Cannot revoke current session' }
      });
    }
    
    await Session.deleteOne({ 
      _id: sessionId, 
      userId: req.user.id 
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error revoking session:', error);
    next(error);
  }
};

exports.getSecuritySettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('recoveryEmail recoveryPhone twoFactorEnabled');
    
    res.json({
      recoveryEmail: user.recoveryEmail,
      recoveryPhone: user.recoveryPhone,
      twoFactorEnabled: user.twoFactorEnabled
    });
  } catch (error) {
    logger.error('Error fetching security settings:', error);
    next(error);
  }
}; 