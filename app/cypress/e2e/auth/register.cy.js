import { mockServerError } from '../../support/commands';

describe('register', () => {
	describe('with username that is taken', () => {
		it('shows an error', () => {
			cy.intercept('POST', '**/api/auth/register').as('register');

			cy.clearCookies();
			cy.visit('/register');
			cy.get('[name="username"]').type(Cypress.env('taken_username'));
			cy.get('[name="email"]').type(`foo+${Date.now()}@example.com`);
			cy.get('[name="password"]').type(Cypress.env('default_password'));
			cy.get('[name="password_confirmation"]').type(Cypress.env('default_password'));
			cy.get('[type="submit"]').click();
			cy.wait('@register').its('response.statusCode').should('equal', 422);
			cy.get('#username-error').invoke('text').should('equal', 'The username has already been taken.');
		});
	});

	describe('with email that is taken', () => {
		it('shows an error', () => {
			cy.intercept('POST', '**/api/auth/register').as('register');

			cy.clearCookies();
			cy.visit('/register');
			cy.get('[name="username"]').type(`foo${Date.now()}`);
			cy.get('[name="email"]').type(Cypress.env('taken_email'));
			cy.get('[name="password"]').type(Cypress.env('default_password'));
			cy.get('[name="password_confirmation"]').type(Cypress.env('default_password'));
			cy.get('[type="submit"]').click();
			cy.wait('@register').its('response.statusCode').should('equal', 422);
			cy.get('#email-error').invoke('text').should('equal', 'The email has already been taken.');
		});
	});

	describe('with mismatched passwords', () => {
		it('shows an error', () => {
			cy.intercept('POST', '**/api/auth/register').as('register');

			const username = `foo${Date.now()}`;
			cy.clearCookies();
			cy.visit('/register');
			cy.get('[name="username"]').type(username);
			cy.get('[name="email"]').type(`${username}@example.com`);
			cy.get('[name="password"]').type(`${Cypress.env('default_password')}1`);
			cy.get('[name="password_confirmation"]').type(`${Cypress.env('default_password')}2`);
			cy.get('[type="submit"]').click();
			cy.wait('@register').its('response.statusCode').should('equal', 422);
			cy.get('#password-error').invoke('text').should('equal', 'The password confirmation does not match.');
		});
	});

	describe('with valid input', () => {
		it('works', () => {
			cy.intercept('POST', '**/api/auth/register').as('register');
			cy.intercept('POST', '**/api/auth/login').as('login');
			cy.intercept('GET', '**/api/users/*').as('getUser');
			cy.intercept('DELETE', '**/api/users/*').as('deleteUser');

			// Register.
			const username = `foo${Date.now()}`;
			const email = `${username}@example.com`;
			cy.clearCookies();
			cy.visit('/register');
			cy.get('[name="username"]').type(username);
			cy.get('[name="email"]').type(email);
			cy.get('[name="password"]').type(Cypress.env('default_password'));
			cy.get('[name="password_confirmation"]').type(Cypress.env('default_password'));
			cy.get('[type="submit"]').click();
			cy.wait('@register').its('response.statusCode').should('equal', 204);
			cy.location('pathname').should('eq', Cypress.env('public_path'));
			cy.get('.formosa-alert--success').first().invoke('text')
				.should('equal', `Check your email (${email}) to continue the registration process.`);

			// Verify email.
			// TODO: With expired token on page load.
			// TODO: With expired token on submit.
			cy.visit(Cypress.env('mail_url'));
			cy.contains(`[${Cypress.env('site_name')}] Verify Email Address`).click();
			cy.get('#nav-plain-text-tab').click();
			cy.get('[href*="/verify-email"]')
				.then(($a) => {
					// TODO: With invalid token.
					// TODO: With invalid signature.
					cy.visit($a.attr('href'));
					cy.get('[data-cy="verify"]').click();
					cy.closeToast('Email verified successfully.');

					// Login.
					cy.get('[name="username"]').type(username);
					cy.get('[name="password"]').type(Cypress.env('default_password'));
					cy.get('[type="submit"]').click();
					cy.wait('@login').its('response.statusCode').should('equal', 200);
					cy.location('pathname').should('eq', '/event-types/new');

					// Delete.
					cy.get('[data-cy="profile"]').click();
					cy.wait('@getUser').its('response.statusCode').should('equal', 200);
					cy.get('.formosa-button--danger').contains('Delete account').click();
					cy.get('dialog .formosa-button--danger').contains('Delete').click();
					cy.wait('@deleteUser').its('response.statusCode').should('equal', 204);
					cy.location('pathname').should('eq', Cypress.env('public_path'));
				});
		});
	});

	describe('with server error', () => {
		it('shows an error', () => {
			mockServerError('POST', '**/api/auth/register').as('register');

			const username = `foo${Date.now()}`;
			cy.clearCookies();
			cy.visit('/register');
			cy.get('[name="username"]').type(username);
			cy.get('[name="email"]').type(`${username}@example.com`);
			cy.get('[name="password"]').type(Cypress.env('default_password'));
			cy.get('[name="password_confirmation"]').type(Cypress.env('default_password'));
			cy.get('[type="submit"]').click();
			cy.wait('@register').its('response.statusCode').should('equal', 500);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
		});
	});
});
