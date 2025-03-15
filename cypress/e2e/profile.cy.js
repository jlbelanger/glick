import { mockServerError } from '../support/commands';

describe('profile', () => {
	beforeEach(() => {
		cy.login();
		cy.deleteAllData();
	});

	describe('with server error', () => {
		it('shows an error', () => {
			mockServerError('GET', '**/api/users/*').as('getUserError');

			cy.visit('/profile');
			cy.wait('@getUserError').its('response.statusCode').should('equal', 500);
			cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
		});
	});

	describe('when changing username', () => {
		describe('with taken username', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				cy.intercept('PUT', '**/api/users/*').as('putUser');

				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('[name="username"]').clear().type(Cypress.env('taken_username'));
				cy.get('button').contains('Change username').click();
				cy.wait('@putUser').its('response.statusCode').should('equal', 422);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: The username has already been taken.');
				cy.get('#username-error').invoke('text').should('equal', 'The username has already been taken.');
				cy.reload();
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get(`[name="username"][value="${Cypress.env('default_username')}"]`).should('exist');
			});
		});

		describe('with valid input', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				cy.intercept('PUT', '**/api/users/*').as('putUser');

				// Change.
				const name = `${Cypress.env('default_username')}2`;
				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('[name="username"]').clear().type(name);
				cy.get('button').contains('Change username').click();
				cy.wait('@putUser').its('response.statusCode').should('equal', 200);
				cy.closeToast('Username changed successfully.');
				cy.reload();
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get(`[name="username"][value="${name}"]`).should('exist');

				// Change back.
				cy.get('[name="username"]').clear().type(Cypress.env('default_username'));
				cy.get('button').contains('Change username').click();
				cy.wait('@putUser').its('response.statusCode').should('equal', 200);
				cy.closeToast('Username changed successfully.');
				cy.reload();
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get(`[name="username"][value="${Cypress.env('default_username')}"]`).should('exist');
			});
		});

		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				mockServerError('PUT', '**/api/users/*').as('putUser');

				const name = `${Cypress.env('default_username')}2`;
				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('[name="username"]').clear().type(name);
				cy.get('button').contains('Change username').click();
				cy.wait('@putUser').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('when changing email', () => {
		describe('with taken email', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				cy.intercept('PUT', '**/api/auth/change-email').as('changeEmail');

				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-email').clear().type(Cypress.env('default_password'));
				cy.get('[name="email"]').clear().type(Cypress.env('taken_email'));
				cy.get('button').contains('Change email').click();
				cy.wait('@changeEmail').its('response.statusCode').should('equal', 422);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: The email has already been taken.');
				cy.get('#email-error').invoke('text').should('equal', 'The email has already been taken.');
				cy.reload();
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get(`[name="email"][value="${Cypress.env('default_email')}"]`).should('exist');
			});
		});

		describe('with invalid current password', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				cy.intercept('PUT', '**/api/auth/change-email').as('changeEmail');

				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-email').clear().type('wrongpassword');
				cy.get('[name="email"]').clear().type(`${Cypress.env('default_email')}2`);
				cy.get('button').contains('Change email').click();
				cy.wait('@changeEmail').its('response.statusCode').should('equal', 422);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: The current password is incorrect.');
				cy.get('#current-password-email-error').invoke('text').should('equal', 'The current password is incorrect.');
				cy.reload();
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get(`[name="email"][value="${Cypress.env('default_email')}"]`).should('exist');
			});
		});

		describe('with valid input', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				cy.intercept('PUT', '**/api/auth/change-email').as('changeEmail');

				// Change.
				const email = `${Cypress.env('default_email')}2`;
				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-email').clear().type(Cypress.env('default_password'));
				cy.get('[name="email"]').clear().type(email);
				cy.get('button').contains('Change email').click();
				cy.wait('@changeEmail').its('response.statusCode').should('equal', 204);
				cy.closeToast('Email changed successfully.');
				cy.reload();
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get(`[name="email"][value="${email}"]`).should('exist');

				// Change back.
				cy.get('#current-password-email').clear().type(Cypress.env('default_password'));
				cy.get('[name="email"]').clear().type(Cypress.env('default_email'));
				cy.get('button').contains('Change email').click();
				cy.wait('@changeEmail').its('response.statusCode').should('equal', 204);
				cy.closeToast('Email changed successfully.');
				cy.reload();
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get(`[name="email"][value="${Cypress.env('default_email')}"]`).should('exist');
			});
		});

		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				mockServerError('PUT', '**/api/auth/change-email').as('changeEmail');

				const email = `${Cypress.env('default_email')}2`;
				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-email').clear().type(Cypress.env('default_password'));
				cy.get('[name="email"]').clear().type(email);
				cy.get('button').contains('Change email').click();
				cy.wait('@changeEmail').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('when changing password', () => {
		describe('with non-matching passwords', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				cy.intercept('PUT', '**/api/auth/change-password').as('changePassword');

				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-password').clear().type(Cypress.env('default_password'));
				cy.get('#new_password').clear().type(`${Cypress.env('default_password')}2`);
				cy.get('#new_password_confirmation').clear().type('somethingelse');
				cy.get('button').contains('Change password').click();
				cy.wait('@changePassword').its('response.statusCode').should('equal', 422);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: The new password confirmation does not match.');
				cy.get('#new_password-error').invoke('text').should('equal', 'The new password confirmation does not match.');
			});
		});

		describe('with invalid current password', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				cy.intercept('PUT', '**/api/auth/change-password').as('changePassword');

				const password = `${Cypress.env('default_password')}2`;
				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-password').clear().type('wrongpassword');
				cy.get('#new_password').clear().type(password);
				cy.get('#new_password_confirmation').clear().type(password);
				cy.get('button').contains('Change password').click();
				cy.wait('@changePassword').its('response.statusCode').should('equal', 422);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: The current password is incorrect.');
				cy.get('#current-password-password-error').invoke('text').should('equal', 'The current password is incorrect.');
			});
		});

		describe('with valid input', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				cy.intercept('PUT', '**/api/auth/change-password').as('changePassword');

				// Change.
				const password = `${Cypress.env('default_password')}2`;
				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-password').clear().type(Cypress.env('default_password'));
				cy.get('#new_password').clear().type(password);
				cy.get('#new_password_confirmation').clear().type(password);
				cy.get('button').contains('Change password').click();
				cy.wait('@changePassword').its('response.statusCode').should('equal', 204);
				cy.closeToast('Password changed successfully.');

				// Change back.
				cy.reload();
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-password').clear().type(password);
				cy.get('#new_password').clear().type(Cypress.env('default_password'));
				cy.get('#new_password_confirmation').clear().type(Cypress.env('default_password'));
				cy.get('button').contains('Change password').click();
				cy.wait('@changePassword').its('response.statusCode').should('equal', 204);
				cy.closeToast('Password changed successfully.');
			});
		});

		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				mockServerError('PUT', '**/api/auth/change-password').as('changePassword');

				const password = `${Cypress.env('default_password')}2`;
				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('#current-password-password').clear().type(Cypress.env('default_password'));
				cy.get('#new_password').clear().type(password);
				cy.get('#new_password_confirmation').clear().type(password);
				cy.get('button').contains('Change password').click();
				cy.wait('@changePassword').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('delete data', () => {
		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				mockServerError('POST', '**/api/users/delete-data').as('deleteData');

				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('[value="events"]').check();
				cy.get('[value="event types"]').check();
				cy.get('.formosa-button--danger').contains('Delete selected data').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteData').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('delete', () => {
		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUser');
				mockServerError('DELETE', '**/api/users/*').as('deleteUser');

				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete account').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteUser').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('logout', () => {
		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/users/*').as('getUserError');
				mockServerError('DELETE', '**/api/auth/logout').as('logout');

				cy.visit('/profile');
				cy.wait('@getUser').its('response.statusCode').should('equal', 200);

				// Logout.
				cy.get('.nav__button').contains('Logout').click();
				cy.wait('@logout').its('response.statusCode').should('equal', 500);
				cy.location('pathname').should('eq', Cypress.env('public_path'));
			});
		});
	});
});
