import { mockServerError } from '../../support/commands';

describe('login', () => {
	describe('with invalid username', () => {
		it('shows an error', () => {
			cy.intercept('POST', '**/api/auth/login').as('login');

			cy.clearCookies();
			cy.visit('/');
			cy.get('[name="username"]').type('doesnotexist');
			cy.get('[name="password"]').type(Cypress.env('default_password'));
			cy.get('[type="submit"]').click();
			cy.wait('@login').its('response.statusCode').should('equal', 401);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Username or password is incorrect.');
		});
	});

	describe('with invalid password', () => {
		it('shows an error', () => {
			cy.intercept('POST', '**/api/auth/login').as('login');

			cy.clearCookies();
			cy.visit('/');
			cy.get('[name="username"]').type(Cypress.env('default_username'));
			cy.get('[name="password"]').type('wrongpassword');
			cy.get('[type="submit"]').click();
			cy.wait('@login').its('response.statusCode').should('equal', 401);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Username or password is incorrect.');
		});
	});

	describe('with valid username and password', () => {
		it('works', () => {
			cy.intercept('POST', '**/api/auth/register').as('register');
			cy.intercept('POST', '**/api/auth/login').as('login');
			cy.intercept('DELETE', '**/api/auth/logout').as('logout');

			// Register.
			const username = `foo${Date.now()}`;
			cy.clearCookies();
			cy.register(username, Cypress.env('default_password'));
			cy.get('[data-cy="profile"]').click();
			cy.get('[data-cy="logout"]').click();
			cy.wait('@logout').its('response.statusCode').should('equal', 204);
			cy.location('pathname').should('eq', Cypress.env('public_path'));

			// Login.
			cy.clearCookies();
			cy.visit('/');
			cy.get('[name="username"]').type(username);
			cy.get('[name="password"]').type(Cypress.env('default_password'));
			cy.get('[type="submit"]').click();
			cy.wait('@login').its('response.statusCode').should('equal', 200);
			cy.location('pathname').should('eq', Cypress.env('public_path'));

			// Logout.
			cy.get('[data-cy="profile"]').click();
			cy.get('[data-cy="logout"]').click();
			cy.wait('@logout').its('response.statusCode').should('equal', 204);
			cy.location('pathname').should('eq', Cypress.env('public_path'));
		});
	});

	describe('with server error', () => {
		it('shows an error', () => {
			mockServerError('POST', '**/api/auth/login').as('login');

			cy.clearCookies();
			cy.visit('/');
			cy.get('[name="username"]').type(Cypress.env('default_username'));
			cy.get('[name="password"]').type(Cypress.env('default_password'));
			cy.get('[type="submit"]').click();
			cy.wait('@login').its('response.statusCode').should('equal', 500);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
		});
	});
});
