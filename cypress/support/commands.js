// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('#login-button').click();
    cy.url().should('include', '/dashboard');
  });
});

// Custom command for logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.contains('Log Out').click();
  cy.url().should('include', '/login');
});

// Custom command for checking if element is visible and enabled
Cypress.Commands.add('shouldBeVisibleAndEnabled', (selector) => {
  cy.get(selector).should('be.visible').and('not.be.disabled');
});

// Custom command for checking if element is visible and disabled
Cypress.Commands.add('shouldBeVisibleAndDisabled', (selector) => {
  cy.get(selector).should('be.visible').and('be.disabled');
});

// Custom command for checking if element contains text and is visible
Cypress.Commands.add('shouldContainTextAndBeVisible', (selector, text) => {
  cy.get(selector).should('contain', text).and('be.visible');
});

// Custom command for checking if element has specific class
Cypress.Commands.add('shouldHaveClass', (selector, className) => {
  cy.get(selector).should('have.class', className);
});

// Custom command for checking if element has specific attribute
Cypress.Commands.add('shouldHaveAttribute', (selector, attribute, value) => {
  cy.get(selector).should('have.attr', attribute, value);
});

// Custom command for checking if element has specific style
Cypress.Commands.add('shouldHaveStyle', (selector, property, value) => {
  cy.get(selector).should('have.css', property, value);
});

// Custom command for checking if element is in viewport
Cypress.Commands.add('shouldBeInViewport', (selector) => {
  cy.get(selector).should('be.visible').and('not.be.disabled').and('be.inViewport');
});

// Custom command for checking if element is not in viewport
Cypress.Commands.add('shouldNotBeInViewport', (selector) => {
  cy.get(selector).should('not.be.inViewport');
});

// Custom command for checking if element is focused
Cypress.Commands.add('shouldBeFocused', (selector) => {
  cy.get(selector).should('be.focused');
});

// Custom command for checking if element is not focused
Cypress.Commands.add('shouldNotBeFocused', (selector) => {
  cy.get(selector).should('not.be.focused');
});

// Custom command for checking if element is checked
Cypress.Commands.add('shouldBeChecked', (selector) => {
  cy.get(selector).should('be.checked');
});

// Custom command for checking if element is not checked
Cypress.Commands.add('shouldNotBeChecked', (selector) => {
  cy.get(selector).should('not.be.checked');
});

// Custom command for checking if element is selected
Cypress.Commands.add('shouldBeSelected', (selector) => {
  cy.get(selector).should('be.selected');
});

// Custom command for checking if element is not selected
Cypress.Commands.add('shouldNotBeSelected', (selector) => {
  cy.get(selector).should('not.be.selected');
});

// Custom command for checking if element is enabled
Cypress.Commands.add('shouldBeEnabled', (selector) => {
  cy.get(selector).should('not.be.disabled');
});

// Custom command for checking if element is disabled
Cypress.Commands.add('shouldBeDisabled', (selector) => {
  cy.get(selector).should('be.disabled');
});

// Custom command for checking if element is required
Cypress.Commands.add('shouldBeRequired', (selector) => {
  cy.get(selector).should('have.attr', 'required');
});

// Custom command for checking if element is not required
Cypress.Commands.add('shouldNotBeRequired', (selector) => {
  cy.get(selector).should('not.have.attr', 'required');
});

// Custom command for checking if element is readonly
Cypress.Commands.add('shouldBeReadonly', (selector) => {
  cy.get(selector).should('have.attr', 'readonly');
});

// Custom command for checking if element is not readonly
Cypress.Commands.add('shouldNotBeReadonly', (selector) => {
  cy.get(selector).should('not.have.attr', 'readonly');
});

// Custom command for checking if element is valid
Cypress.Commands.add('shouldBeValid', (selector) => {
  cy.get(selector).should('be.valid');
});

// Custom command for checking if element is invalid
Cypress.Commands.add('shouldBeInvalid', (selector) => {
  cy.get(selector).should('be.invalid');
});

// Custom command for checking if element has specific value
Cypress.Commands.add('shouldHaveValue', (selector, value) => {
  cy.get(selector).should('have.value', value);
});

// Custom command for checking if element has specific text
Cypress.Commands.add('shouldHaveText', (selector, text) => {
  cy.get(selector).should('have.text', text);
});

// Custom command for checking if element has specific HTML
Cypress.Commands.add('shouldHaveHtml', (selector, html) => {
  cy.get(selector).should('have.html', html);
});

// Custom command for checking if element has specific inner HTML
Cypress.Commands.add('shouldHaveInnerHtml', (selector, html) => {
  cy.get(selector).should('have.html', html);
});

// Custom command for checking if element has specific outer HTML
Cypress.Commands.add('shouldHaveOuterHtml', (selector, html) => {
  cy.get(selector).should('have.html', html);
});

// Custom command for checking if element has specific data attribute
Cypress.Commands.add('shouldHaveData', (selector, attribute, value) => {
  cy.get(selector).should('have.data', attribute, value);
});

// Custom command for checking if element has specific property
Cypress.Commands.add('shouldHaveProperty', (selector, property, value) => {
  cy.get(selector).should('have.prop', property, value);
});

// Custom command for checking if element has specific computed style
Cypress.Commands.add('shouldHaveComputedStyle', (selector, property, value) => {
  cy.get(selector).should('have.css', property, value);
});

// Custom command for checking if element has specific bounding client rect
Cypress.Commands.add('shouldHaveBoundingClientRect', (selector, property, value) => {
  cy.get(selector).should('have.prop', 'getBoundingClientRect').and('have.property', property, value);
});

// Custom command for checking if element has specific scroll position
Cypress.Commands.add('shouldHaveScrollPosition', (selector, property, value) => {
  cy.get(selector).should('have.prop', 'scroll' + property, value);
});

// Custom command for checking if element has specific scroll size
Cypress.Commands.add('shouldHaveScrollSize', (selector, property, value) => {
  cy.get(selector).should('have.prop', 'scroll' + property, value);
});

// Custom command for checking if element has specific client size
Cypress.Commands.add('shouldHaveClientSize', (selector, property, value) => {
  cy.get(selector).should('have.prop', 'client' + property, value);
});

// Custom command for checking if element has specific offset size
Cypress.Commands.add('shouldHaveOffsetSize', (selector, property, value) => {
  cy.get(selector).should('have.prop', 'offset' + property, value);
});

// Custom command for checking if element has specific inner size
Cypress.Commands.add('shouldHaveInnerSize', (selector, property, value) => {
  cy.get(selector).should('have.prop', 'inner' + property, value);
});

// Custom command for checking if element has specific outer size
Cypress.Commands.add('shouldHaveOuterSize', (selector, property, value) => {
  cy.get(selector).should('have.prop', 'outer' + property, value);
}); 