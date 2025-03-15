import { mockServerError } from '../support/commands';

describe('event types', () => {
	beforeEach(() => {
		cy.login();
		cy.deleteAllData();
	});

	describe('list', () => {
		describe('with server error', () => {
			it('shows an error', () => {
				mockServerError('GET', '**/api/action-types').as('getActionTypes');

				cy.visit('/event-types');
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('add', () => {
		describe('with valid minimal button', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Delete.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
				cy.contains(name).should('not.exist');
			});
		});

		describe('with valid button with options', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('#new-label').type('Foo');
				cy.get('.formosa-button--add-has-many').click();
				cy.get('[id="options.0.label"]').should('exist');
				cy.get('#new-label').type('Bar');
				cy.get('.formosa-button--add-has-many').click();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Delete.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
				cy.contains(name).should('not.exist');
			});
		});

		describe('with valid start/stop button', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[name="is_continuous"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Delete.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
				cy.contains(name).should('not.exist');
			});
		});

		describe('with valid start/stop button with options', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[name="is_continuous"]').check();
				cy.get('#new-label').type('Foo');
				cy.get('.formosa-button--add-has-many').click();
				cy.get('[id="options.0.label"]').should('exist');
				cy.get('#new-label').type('Bar');
				cy.get('.formosa-button--add-has-many').click();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Delete.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
				cy.contains(name).should('not.exist');
			});
		});

		describe('with valid minimal number', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="number"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Delete.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
				cy.contains(name).should('not.exist');
			});
		});

		describe('with valid number with units', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="number"]').check();
				cy.get('[name="suffix"]').type('lbs');
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Delete.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
				cy.contains(name).should('not.exist');
			});
		});

		describe('with valid minimal text', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="text"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Delete.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
				cy.contains(name).should('not.exist');
			});
		});

		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				mockServerError('POST', '**/api/action-types').as('addActionType');

				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(`Example ${Date.now()}`);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('view', () => {
		describe('with not found', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');

				// View.
				cy.visit('/event-types/987654321');
				cy.wait('@getActionType').its('response.statusCode').should('equal', 404);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: This record does not exist.');

				// Edit.
				cy.visit('/event-types/987654321/edit');
				cy.wait('@getActionType').its('response.statusCode').should('equal', 404);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: This record does not exist.');
			});
		});

		describe('with server error', () => {
			it('shows an error', () => {
				mockServerError('GET', '**/api/action-types/*').as('getActionType');

				// View.
				cy.visit('/event-types/987654321');
				cy.wait('@getActionType').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');

				// Edit.
				cy.visit('/event-types/987654321/edit');
				cy.wait('@getActionType').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('edit', () => {
		// TODO: With invalid input, with valid input.

		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				mockServerError('PUT', '**/api/action-types/*').as('updateActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// View.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);

				// Edit.
				cy.get('[name="label"]').clear().type('New Name');
				cy.get('[type="submit"]').click();
				cy.wait('@updateActionType').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('delete', () => {
		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				mockServerError('DELETE', '**/api/action-types/*').as('deleteActionType');

				// Add.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Delete.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});
});
