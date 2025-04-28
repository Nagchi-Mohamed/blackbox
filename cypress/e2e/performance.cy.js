describe('Performance Tests', () => {
  beforeEach(() => {
    cy.login('testuser@mathsphere.com', 'securePassword123');
  });

  it('should pass lighthouse audit for security page', () => {
    cy.visit('/security');
    
    cy.lighthouse({
      performance: 85,
      accessibility: 95,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 3000,
      'cumulative-layout-shift': 0.1,
      'total-blocking-time': 500
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    });
  });

  it('should pass mobile lighthouse audit', () => {
    cy.viewport('iphone-x');
    cy.visit('/security');
    
    cy.lighthouse({
      performance: 70,
      accessibility: 90,
      'first-contentful-paint': 3000,
      'largest-contentful-paint': 4000
    }, {
      formFactor: 'mobile',
      screenEmulation: { disabled: true }
    });
  });

  it('should pass performance audit for 2FA setup flow', () => {
    cy.visit('/security');
    cy.get('[data-testid="enable-2fa"]').click();
    
    cy.lighthouse({
      performance: 80,
      accessibility: 95,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 3000
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    });
  });

  it('should pass performance audit for account recovery flow', () => {
    cy.visit('/security');
    cy.get('[data-testid="recovery-section"]').scrollIntoView();
    
    cy.lighthouse({
      performance: 80,
      accessibility: 95,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 3000
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    });
  });

  it('should pass performance audit for notification preferences', () => {
    cy.visit('/security');
    cy.get('[data-testid="notifications-section"]').scrollIntoView();
    
    cy.lighthouse({
      performance: 80,
      accessibility: 95,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 3000
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    });
  });

  it('should pass performance audit for login history', () => {
    cy.visit('/security');
    cy.get('[data-testid="login-history-section"]').scrollIntoView();
    
    cy.lighthouse({
      performance: 80,
      accessibility: 95,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 3000
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    });
  });

  it('should pass performance audit for error states', () => {
    cy.visit('/security');
    cy.get('[data-testid="enable-2fa"]').click();
    cy.get('#phone-input').type('invalid-phone');
    cy.contains('Send Verification Code').click();
    
    cy.lighthouse({
      performance: 80,
      accessibility: 95,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 3000
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    });
  });

  it('should pass performance audit for success states', () => {
    cy.visit('/security');
    cy.get('[data-testid="enable-2fa"]').click();
    cy.get('#phone-input').type('+1234567890');
    cy.contains('Send Verification Code').click();
    cy.get('#verification-code').type('123456');
    cy.contains('Verify Code').click();
    
    cy.lighthouse({
      performance: 80,
      accessibility: 95,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 3000
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    });
  });

  it('should pass performance audit for loading states', () => {
    cy.visit('/security');
    cy.get('[data-testid="enable-2fa"]').click();
    cy.get('#phone-input').type('+1234567890');
    cy.contains('Send Verification Code').click();
    
    cy.lighthouse({
      performance: 80,
      accessibility: 95,
      'first-contentful-paint': 2000,
      'largest-contentful-paint': 3000
    }, {
      formFactor: 'desktop',
      screenEmulation: { disabled: true }
    });
  });
}); 
 