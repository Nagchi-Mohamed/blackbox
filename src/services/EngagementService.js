const logger = require('../utils/logger');

class EngagementService {
  constructor() {
    this.sessions = new Map();
  }

  trackEvent(roomId, userId, eventType, data = {}) {
    if (!this.sessions.has(roomId)) {
      this.sessions.set(roomId, new Map());
    }
    
    const roomSessions = this.sessions.get(roomId);
    if (!roomSessions.has(userId)) {
      roomSessions.set(userId, {
        events: [],
        joinedAt: new Date(),
        engagementScore: 0
      });
    }
    
    const session = roomSessions.get(userId);
    session.events.push({
      type: eventType,
      timestamp: new Date(),
      data
    });
    
    // Update engagement score
    session.engagementScore = this.calculateEngagementScore(session.events);
  }

  calculateEngagementScore(events) {
    const weights = {
      'message-sent': 1,
      'problem-solved': 2,
      'question-asked': 1.5,
      'whiteboard-edit': 0.5,
      'video-active': 0.1,
      'disengaged': -2
    };
    
    const timeDecay = (minutes) => Math.exp(-minutes / 30);
    
    const now = new Date();
    return events.reduce((score, event) => {
      const minutesAgo = (now - event.timestamp) / (1000 * 60);
      return score + (weights[event.type] || 0) * timeDecay(minutesAgo);
    }, 0);
  }

  predictDisengagement(roomId) {
    const roomSessions = this.sessions.get(roomId) || new Map();
    const data = Array.from(roomSessions.entries()).map(([userId, session]) => ({
      userId,
      score: session.engagementScore,
      lastEvent: Math.max(...session.events.map(e => e.timestamp))
    }));
    
    if (data.length < 2) return [];
    
    // Simple threshold-based prediction
    const now = new Date();
    const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
    const lowScoreThreshold = -1;
    
    return data
      .filter(d => 
        (now - d.lastEvent) > inactiveThreshold || 
        d.score < lowScoreThreshold
      )
      .map(d => d.userId);
  }

  getEngagementData(roomId) {
    const roomSessions = this.sessions.get(roomId) || new Map();
    return Array.from(roomSessions.entries()).map(([userId, session]) => ({
      userId,
      score: session.engagementScore,
      eventCount: session.events.length,
      lastActive: Math.max(...session.events.map(e => e.timestamp))
    }));
  }
}

module.exports = new EngagementService(); 