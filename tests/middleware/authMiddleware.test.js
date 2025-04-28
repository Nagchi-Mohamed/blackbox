const { authenticate, authorize } = require('../../src/middleware/authMiddleware');
const { getAuthToken } = require('../testSetup');

describe('Authentication Middleware', () => {
  let token;
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(async () => {
    const auth = await getAuthToken();
    token = auth.token;
    
    mockReq = {
      header: jest.fn()
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  test('should reject requests without token', async () => {
    mockReq.header.mockReturnValue(undefined);
    
    await authenticate(mockReq, mockRes, nextFunction);
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: { code: 'missing-token', message: 'Authentication required' }
    });
  });

  test('should reject invalid tokens', async () => {
    mockReq.header.mockReturnValue('Bearer invalidtoken');
    
    await authenticate(mockReq, mockRes, nextFunction);
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: { code: 'auth-failed', message: 'Please authenticate' }
    });
  });

  test('should allow valid tokens', async () => {
    mockReq.header.mockReturnValue(`Bearer ${token}`);
    
    await authenticate(mockReq, mockRes, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
    expect(mockReq).toHaveProperty('token', token);
    expect(mockReq).toHaveProperty('user');
  });

  describe('Role-based Authorization', () => {
    test('should allow authorized roles', () => {
      const authMiddleware = authorize('user');
      mockReq.user = { roles: ['user'] };
      
      authMiddleware(mockReq, mockRes, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });

    test('should reject unauthorized roles', () => {
      const authMiddleware = authorize('admin');
      mockReq.user = { roles: ['user'] };
      
      authMiddleware(mockReq, mockRes, nextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: { code: 'forbidden', message: 'Insufficient permissions' }
      });
    });
  });
}); 