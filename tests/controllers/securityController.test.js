const { getLoginHistory, updateRecoveryOptions, revokeSession } = require('../../src/controllers/securityController');
const { getAuthToken, mongoose } = require('../testSetup');
const LoginHistory = require('../../src/models/LoginHistory');

describe('Security Controller', () => {
  let mockReq;
  let mockRes;
  let nextFunction;
  let userId;

  beforeEach(async () => {
    const auth = await getAuthToken();
    userId = auth.user._id;
    
    mockReq = {
      user: auth.user,
      query: {},
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();

    // Seed test data
    await LoginHistory.create([
      {
        userId,
        deviceType: 'desktop',
        ipAddress: '192.168.1.1',
        success: true,
        timestamp: new Date()
      },
      {
        userId,
        deviceType: 'mobile',
        ipAddress: '192.168.1.2',
        success: false,
        timestamp: new Date()
      }
    ]);
  });

  afterEach(async () => {
    await LoginHistory.deleteMany({});
  });

  describe('getLoginHistory', () => {
    test('should retrieve login history', async () => {
      mockReq.query = { page: 1, limit: 10 };
      
      await getLoginHistory(mockReq, mockRes, nextFunction);
      
      expect(mockRes.json).toHaveBeenCalled();
      const response = mockRes.json.mock.calls[0][0];
      expect(response.items).toBeInstanceOf(Array);
      expect(response.items.length).toBeGreaterThan(0);
    });

    test('should paginate results', async () => {
      mockReq.query = { page: 1, limit: 1 };
      
      await getLoginHistory(mockReq, mockRes, nextFunction);
      
      const response = mockRes.json.mock.calls[0][0];
      expect(response.items.length).toBe(1);
      expect(response).toHaveProperty('totalPages');
      expect(response).toHaveProperty('currentPage');
    });
  });

  describe('updateRecoveryOptions', () => {
    test('should update recovery email', async () => {
      mockReq.body = { email: 'newrecovery@mathsphere.com' };
      
      await updateRecoveryOptions(mockReq, mockRes, nextFunction);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        updatedFields: ['email']
      });
    });

    test('should reject invalid email', async () => {
      mockReq.body = { email: 'invalid-email' };
      
      await updateRecoveryOptions(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'invalid-email', message: 'Invalid email format' }
      });
    });

    test('should update recovery phone', async () => {
      mockReq.body = { phone: '+1234567890' };
      
      await updateRecoveryOptions(mockReq, mockRes, nextFunction);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        updatedFields: ['phone']
      });
    });

    test('should reject invalid phone', async () => {
      mockReq.body = { phone: 'invalid-phone' };
      
      await updateRecoveryOptions(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'invalid-phone', message: 'Invalid phone format' }
      });
    });
  });

  describe('revokeSession', () => {
    test('should revoke session', async () => {
      mockReq.params = { sessionId: '123' };
      
      await revokeSession(mockReq, mockRes, nextFunction);
      
      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });

    test('should prevent revoking current session', async () => {
      mockReq.params = { sessionId: 'current' };
      mockReq.session = { id: 'current' };
      
      await revokeSession(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'current-session', message: 'Cannot revoke current session' }
      });
    });
  });
}); 