const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
  getLoginHistory,
  updateRecoveryOptions,
  getSecuritySettings,
  revokeSession
} = require('../controllers/securityController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Security
 *   description: User security management
 */

/**
 * @swagger
 * /security/login-history:
 *   get:
 *     summary: Get user login history
 *     tags: [Security]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Login history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LoginHistory'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/login-history', authenticate, authorize('user'), getLoginHistory);

/**
 * @swagger
 * /security/recovery-options:
 *   put:
 *     summary: Update account recovery options
 *     tags: [Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *             example:
 *               email: "recovery@example.com"
 *               phone: "+1234567890"
 *     responses:
 *       200:
 *         description: Recovery options updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 updatedFields:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/recovery-options', authenticate, authorize('user'), updateRecoveryOptions);

/**
 * @swagger
 * /security/settings:
 *   get:
 *     summary: Get security settings
 *     tags: [Security]
 *     responses:
 *       200:
 *         description: Security settings retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recoveryEmail:
 *                   type: string
 *                 recoveryPhone:
 *                   type: string
 *                 twoFactorEnabled:
 *                   type: boolean
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/settings', authenticate, authorize('user'), getSecuritySettings);

/**
 * @swagger
 * /security/sessions/{sessionId}:
 *   delete:
 *     summary: Revoke a session
 *     tags: [Security]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID to revoke
 *     responses:
 *       200:
 *         description: Session revoked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Cannot revoke current session
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete('/sessions/:sessionId', authenticate, authorize('user'), revokeSession);

module.exports = router; 