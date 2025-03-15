describe('profile demo', () => {
	beforeEach(() => {
		cy.login(Cypress.env('demo_username'), Cypress.env('demo_password'));
		cy.deleteAllData();
	});

	describe('with demo user', () => {
		it('does not allow changing login info', () => {
			cy.intercept('GET', '**/api/users/*').as('getUser');
			cy.intercept('PUT', '**/api/users/*').as('putUser');
			cy.intercept('PUT', '**/api/auth/change-email').as('changeEmail');
			cy.intercept('PUT', '**/api/auth/change-password').as('changePassword');
			cy.intercept('DELETE', '**/api/auth/logout').as('logout');

			// Go to profile.
			cy.visit('/profile');
			cy.wait('@getUser').its('response.statusCode').should('equal', 200);

			// Change username.
			cy.get('[name="username"]').clear().type('newdemousername');
			cy.get('button').contains('Change username').click();
			cy.wait('@putUser').its('response.statusCode').should('equal', 422);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: The username field is prohibited.');
			cy.get('#username-error').invoke('text').should('equal', 'The username field is prohibited.');
			cy.reload();
			cy.wait('@getUser').its('response.statusCode').should('equal', 200);
			cy.get('[name="username"]').should('have.value', Cypress.env('demo_username'));

			// Change email.
			cy.get('#current-password-email').clear().type(Cypress.env('demo_password'));
			cy.get('[name="email"]').clear().type('newdemoemail@example.com');
			cy.get('button').contains('Change email').click();
			cy.wait('@changeEmail').its('response.statusCode').should('equal', 403);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: You do not have permission to update this record.');
			cy.reload();
			cy.wait('@getUser').its('response.statusCode').should('equal', 200);
			cy.get('[name="email"]').should('have.value', Cypress.env('demo_email'));

			// Change password.
			const password = 'newdemopassword';
			cy.get('#current-password-password').clear().type(Cypress.env('demo_password'));
			cy.get('#new_password').clear().type(password);
			cy.get('#new_password_confirmation').clear().type(password);
			cy.get('button').contains('Change password').click();
			cy.wait('@changePassword').its('response.statusCode').should('equal', 403);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: You do not have permission to update this record.');
		});
	});
});
