describe('Visual Regression Tests', () => {
  beforeEach(() => {
    cy.login('testuser@mathsphere.com', 'securePassword123');
  });

  it('should match security settings page', () => {
    cy.visit('/security');
    cy.percySnapshot('Security Settings Page', {
      widths: [1280, 375],
      minHeight: 1024
    });
  });

  it('should match 2FA setup modal', () => {
    cy.visit('/security');
    cy.get('[data-testid="enable-2fa"]').click();
    cy.percySnapshot('2FA Setup Modal', {
      coverage: {
        content: ['#2fa-modal'],
        padding: '20px'
      }
    });
  });

  it('should match account recovery section', () => {
    cy.visit('/security');
    cy.get('[data-testid="recovery-section"]').scrollIntoView();
    cy.percySnapshot('Account Recovery Section', {
      coverage: {
        content: ['#recovery-section'],
        padding: '20px'
      }
    });
  });

  it('should match notification preferences section', () => {
    cy.visit('/security');
    cy.get('[data-testid="notifications-section"]').scrollIntoView();
    cy.percySnapshot('Notification Preferences Section', {
      coverage: {
        content: ['#notifications-section'],
        padding: '20px'
      }
    });
  });

  it('should match login history section', () => {
    cy.visit('/security');
    cy.get('[data-testid="login-history-section"]').scrollIntoView();
    cy.percySnapshot('Login History Section', {
      coverage: {
        content: ['#login-history-section'],
        padding: '20px'
      }
    });
  });

  it('should match error states', () => {
    cy.visit('/security');
    cy.get('[data-testid="enable-2fa"]').click();
    cy.get('#phone-input').type('invalid-phone');
    cy.contains('Send Verification Code').click();
    cy.percySnapshot('2FA Setup Error State', {
      coverage: {
        content: ['#2fa-modal'],
        padding: '20px'
      }
    });
  });

  it('should match success states', () => {
    cy.visit('/security');
    cy.get('[data-testid="enable-2fa"]').click();
    cy.get('#phone-input').type('+1234567890');
    cy.contains('Send Verification Code').click();
    cy.get('#verification-code').type('123456');
    cy.contains('Verify Code').click();
    cy.percySnapshot('2FA Setup Success State', {
      coverage: {
        content: ['#2fa-modal'],
        padding: '20px'
      }
    });
  });

  it('should match loading states', () => {
    cy.visit('/security');
    cy.get('[data-testid="enable-2fa"]').click();
    cy.get('#phone-input').type('+1234567890');
    cy.contains('Send Verification Code').click();
    cy.percySnapshot('2FA Setup Loading State', {
      coverage: {
        content: ['#2fa-modal'],
        padding: '20px'
      }
    });
  });

  it('should match mobile view', () => {
    cy.viewport('iphone-x');
    cy.visit('/security');
    cy.percySnapshot('Security Settings Page Mobile', {
      widths: [375],
      minHeight: 667
    });
  });

  it('should match tablet view', () => {
    cy.viewport('ipad-2');
    cy.visit('/security');
    cy.percySnapshot('Security Settings Page Tablet', {
      widths: [768],
      minHeight: 1024
    });
  });
}); 