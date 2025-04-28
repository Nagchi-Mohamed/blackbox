describe('Security Features', () => {
  beforeEach(() => {
    cy.login('testuser@mathsphere.com', 'securePassword123');
    cy.visit('/security');
  });

  it('should complete 2FA setup', () => {
    // Mock API responses
    cy.intercept('POST', '/api/security/2fa/enable', {
      statusCode: 200,
      body: { success: true, verificationId: 'mock-verification-id' }
    }).as('enable2FA');
    
    cy.intercept('POST', '/api/security/2fa/verify', {
      statusCode: 200,
      body: { success: true }
    }).as('verify2FA');

    cy.contains('Enable 2FA').click();
    cy.get('#phone-input').type('+1234567890');
    cy.contains('Send Verification Code').click();
    
    cy.wait('@enable2FA').then(() => {
      cy.get('#verification-code').type('123456');
      cy.contains('Verify Code').click();
      
      cy.wait('@verify2FA').then(() => {
        cy.contains('Two-factor authentication is enabled').should('be.visible');
        cy.contains('Generate Backup Codes').should('be.enabled');
      });
    });
  });

  it('should update account recovery options', () => {
    cy.intercept('PUT', '/api/security/recovery-options', {
      statusCode: 200,
      body: { success: true, updatedFields: ['email'] }
    }).as('updateRecovery');

    cy.contains('Edit').first().click();
    cy.get('#recovery-email').clear().type('recovery@example.com');
    cy.contains('Save').click();
    
    cy.wait('@updateRecovery').then(() => {
      cy.contains('Recovery email updated successfully').should('be.visible');
    });
  });

  it('should display login history', () => {
    cy.intercept('GET', '/api/security/login-history', {
      fixture: 'loginHistory.json'
    }).as('getHistory');

    cy.wait('@getHistory').then(() => {
      cy.get('table').should('exist');
      cy.contains('New York, NY').should('exist');
      cy.contains('San Francisco, CA').should('exist');
    });
  });

  it('should revoke active sessions', () => {
    cy.intercept('DELETE', '/api/security/sessions/*', {
      statusCode: 200,
      body: { success: true }
    }).as('revokeSession');

    cy.get('[data-testid="revoke-session"]').first().click();
    cy.contains('Yes, revoke').click();
    
    cy.wait('@revokeSession').then(() => {
      cy.contains('Session revoked successfully').should('be.visible');
    });
  });

  it('should handle 2FA setup errors', () => {
    cy.intercept('POST', '/api/security/2fa/enable', {
      statusCode: 400,
      body: { error: 'Invalid phone number' }
    }).as('enable2FAError');

    cy.contains('Enable 2FA').click();
    cy.get('#phone-input').type('invalid-phone');
    cy.contains('Send Verification Code').click();
    
    cy.wait('@enable2FAError').then(() => {
      cy.contains('Invalid phone number').should('be.visible');
    });
  });

  it('should handle recovery options update errors', () => {
    cy.intercept('PUT', '/api/security/recovery-options', {
      statusCode: 400,
      body: { error: 'Invalid email format' }
    }).as('updateRecoveryError');

    cy.contains('Edit').first().click();
    cy.get('#recovery-email').clear().type('invalid-email');
    cy.contains('Save').click();
    
    cy.wait('@updateRecoveryError').then(() => {
      cy.contains('Invalid email format').should('be.visible');
    });
  });

  it('should handle session revocation errors', () => {
    cy.intercept('DELETE', '/api/security/sessions/*', {
      statusCode: 400,
      body: { error: 'Cannot revoke current session' }
    }).as('revokeSessionError');

    cy.get('[data-testid="revoke-session"]').first().click();
    cy.contains('Yes, revoke').click();
    
    cy.wait('@revokeSessionError').then(() => {
      cy.contains('Cannot revoke current session').should('be.visible');
    });
  });

  it('should update notification preferences', () => {
    cy.intercept('PUT', '/api/security/notifications', {
      statusCode: 200,
      body: { success: true }
    }).as('updateNotifications');

    cy.get('[data-testid="notification-toggle"]').first().click();
    
    cy.wait('@updateNotifications').then(() => {
      cy.get('[data-testid="notification-toggle"]').first().should('not.be.checked');
    });
  });

  it('should handle notification preferences update errors', () => {
    cy.intercept('PUT', '/api/security/notifications', {
      statusCode: 400,
      body: { error: 'Failed to update preferences' }
    }).as('updateNotificationsError');

    cy.get('[data-testid="notification-toggle"]').first().click();
    
    cy.wait('@updateNotificationsError').then(() => {
      cy.contains('Failed to update preferences').should('be.visible');
    });
  });
}); 