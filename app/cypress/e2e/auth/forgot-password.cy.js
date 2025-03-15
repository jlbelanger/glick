import { mockServerError } from '../../support/commands';

describe('forgot password', () => {
	before(() => {
		cy.register(Cypress.env('default_username'), Cypress.env('default_password'));
	});

	describe('with non-existent email', () => {
		it('works', () => {
			cy.intercept('POST', '**/api/auth/forgot-password').as('forgotPassword');

			cy.clearCookies();
			cy.visit('/forgot-password');
			cy.get('[name="email"]').type('doesnotexist@example.com');
			cy.get('[type="submit"]').click();
			cy.wait('@forgotPassword').its('response.statusCode').should('equal', 204);
			cy.get('.formosa-alert--success').invoke('text')
				.should('equal', 'If there is an account with this email address, you will receive a password reset email shortly.');
		});
	});

	describe('with valid email', () => {
		it('works', () => {
			cy.intercept('POST', '**/api/auth/forgot-password').as('forgotPassword');
			cy.intercept('PUT', '**/api/auth/reset-password/*').as('resetPassword');
			cy.intercept('POST', '**/api/auth/login').as('login');
			cy.intercept('GET', '**/api/users/*').as('getUser');
			cy.intercept('PUT', '**/api/auth/change-password').as('changePassword');

			cy.clearCookies();
			cy.visit('/forgot-password');
			cy.get('[name="email"]').type(Cypress.env('default_email'));
			cy.get('[type="submit"]').click();
			cy.wait('@forgotPassword').its('response.statusCode').should('equal', 204);
			cy.get('.formosa-alert--success').invoke('text')
				.should('equal', 'If there is an account with this email address, you will receive a password reset email shortly.');

			// Reset password.
			cy.visit(Cypress.env('mail_url'));
			cy.contains(`[${Cypress.env('site_name')}] Reset Password`).click();
			cy.get('#nav-plain-text-tab').click();
			cy.get('[href*="/reset-password"]')
				.then(($a) => {
					// With mismatched confirmation.
					const newPassword = 'password2';
					cy.visit($a.attr('href'));
					cy.get('[name="email"]').clear().type(Cypress.env('default_email'));
					cy.get('[name="new_password"]').clear().type(`${newPassword}1`);
					cy.get('[name="new_password_confirmation"]').clear().type(`${newPassword}2`);
					cy.get('[type="submit"]').click();
					cy.wait('@resetPassword').its('response.statusCode').should('equal', 422);
					cy.get('.formosa-alert--error').invoke('text')
						.should('equal', 'Error: The new password confirmation does not match.');

					// With short password.
					cy.visit($a.attr('href'));
					cy.get('[name="email"]').clear().type(Cypress.env('default_email'));
					cy.get('[name="new_password"]').clear().type('a');
					cy.get('[name="new_password_confirmation"]').clear().type('a');
					cy.get('[type="submit"]').click();
					cy.wait('@resetPassword').its('response.statusCode').should('equal', 422);
					cy.get('.formosa-alert--error').invoke('text')
						.should('equal', 'Error: The new password must be at least 8 characters.');

					// With invalid token.
					cy.visit($a.attr('href').replace('?', 'a?'));
					cy.get('[name="email"]').clear().type(Cypress.env('default_email'));
					cy.get('[name="new_password"]').clear().type(`${newPassword}3`);
					cy.get('[name="new_password_confirmation"]').clear().type(`${newPassword}3`);
					cy.get('[type="submit"]').click();
					cy.wait('@resetPassword').its('response.statusCode').should('equal', 403);
					cy.get('.formosa-alert--error').invoke('text')
						.should('equal', 'Error: This password reset link is invalid or the email is incorrect.');

					// With invalid signature.
					cy.visit($a.attr('href').replace('signature=', 'signature=a'));
					cy.get('[name="email"]').clear().type(Cypress.env('default_email'));
					cy.get('[name="new_password"]').clear().type(`${newPassword}4`);
					cy.get('[name="new_password_confirmation"]').clear().type(`${newPassword}4`);
					cy.get('[type="submit"]').click();
					cy.wait('@resetPassword').its('response.statusCode').should('equal', 403);
					cy.get('.formosa-alert--error').invoke('text')
						.should('equal', 'Error: This password reset link is invalid or the email is incorrect.');

					// With wrong email.
					cy.visit($a.attr('href'));
					cy.get('[name="email"]').type('wrongemail@example.com');
					cy.get('[name="new_password"]').clear().type(`${newPassword}5`);
					cy.get('[name="new_password_confirmation"]').clear().type(`${newPassword}5`);
					cy.get('[type="submit"]').click();
					cy.wait('@resetPassword').its('response.statusCode').should('equal', 403);
					cy.get('.formosa-alert--error').invoke('text')
						.should('equal', 'Error: This password reset link is invalid or the email is incorrect.');

					// With valid submission.
					cy.get('[name="email"]').clear().type(Cypress.env('default_email'));
					cy.get('[name="new_password"]').clear().type(newPassword);
					cy.get('[name="new_password_confirmation"]').clear().type(newPassword);
					cy.get('[type="submit"]').click();
					cy.wait('@resetPassword').its('response.statusCode').should('equal', 204);
					cy.closeToast('Password reset successfully.');
					cy.location('pathname').should('eq', Cypress.env('public_path'));

					// With same link twice.
					cy.visit($a.attr('href'));
					cy.get('[name="email"]').clear().type(Cypress.env('default_email'));
					cy.get('[name="new_password"]').type(`${newPassword}6`);
					cy.get('[name="new_password_confirmation"]').type(`${newPassword}6`);
					cy.get('[type="submit"]').click();
					cy.wait('@resetPassword').its('response.statusCode').should('equal', 403);
					cy.get('.formosa-alert--error').invoke('text')
						.should('equal', 'Error: This password reset link is invalid or the email is incorrect.');

					// Login with old password.
					cy.visit('/');
					cy.get('[name="username"]').type(Cypress.env('default_username'));
					cy.get('[name="password"]').type(Cypress.env('default_password'));
					cy.get('[type="submit"]').click();
					cy.wait('@login').its('response.statusCode').should('equal', 401);
					cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Username or password is incorrect.');

					// Login with new password.
					cy.get('[name="password"]').clear().type(newPassword);
					cy.get('[type="submit"]').click();
					cy.wait('@login').its('response.statusCode').should('equal', 200);
					cy.location('pathname').should('eq', Cypress.env('public_path'));

					// Change password back.
					cy.visit('/profile');
					cy.wait('@getUser').its('response.statusCode').should('equal', 200);
					cy.get('#current-password-password').clear().type(newPassword);
					cy.get('#new_password').clear().type(Cypress.env('default_password'));
					cy.get('#new_password_confirmation').clear().type(Cypress.env('default_password'));
					cy.get('button').contains('Change password').click();
					cy.wait('@changePassword').its('response.statusCode').should('equal', 204);
					cy.closeToast('Password changed successfully.');

					// TODO: With expired token on page load.
					// TODO: With expired token on submit.
				});
		});
	});

	describe('with server error', () => {
		it('shows an error', () => {
			mockServerError('POST', '**/api/auth/forgot-password').as('forgotPassword');

			cy.clearCookies();
			cy.visit('/forgot-password');
			cy.get('[name="email"]').type(Cypress.env('default_email'));
			cy.get('[type="submit"]').click();
			cy.wait('@forgotPassword').its('response.statusCode').should('equal', 500);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
		});
	});
});
