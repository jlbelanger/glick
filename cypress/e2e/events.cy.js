import { mockServerError } from '../support/commands';

describe('events', () => {
	beforeEach(() => {
		cy.login();
		cy.deleteAllData();
	});

	describe('list', () => {
		describe('with server error', () => {
			it('shows an error', () => {
				mockServerError('GET', '**/api/actions?*').as('getActions');

				cy.visit('/events');
				cy.wait('@getActions').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('add', () => {
		describe('with server error on page load', () => {
			it('shows an error', () => {
				mockServerError('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('POST', '**/api/action-types').as('addActionType');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});

		describe('with server error on start event', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				mockServerError('POST', '**/api/actions?*').as('addAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-field__error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});

		describe('with server error on stop event', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				mockServerError('PUT', '**/api/actions/*').as('updateAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[name="is_continuous"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Start event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Start').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains(name).parents('form').contains('Stop').should('exist');
				cy.contains(name).parents('.list__item').should('have.class', 'list__item--active');

				// Stop event.
				cy.contains(name).parents('form').contains('Stop').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-field__error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});

		describe('with server error on start event with options', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				mockServerError('POST', '**/api/actions?*').as('addAction');

				// Add event type.
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

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Foo').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-field__error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});

		describe('with server error on stop event with options', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				mockServerError('PUT', '**/api/actions/*').as('updateAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('#new-label').type('Foo');
				cy.get('.formosa-button--add-has-many').click();
				cy.get('[id="options.0.label"]').should('exist');
				cy.get('#new-label').type('Bar');
				cy.get('.formosa-button--add-has-many').click();
				cy.get('[name="is_continuous"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Start event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Foo').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains(name).parents('form').contains('Stop').should('exist');
				cy.contains(name).parents('.list__item').should('have.class', 'list__item--active');

				// Stop event.
				cy.contains(name).parents('form').contains('Stop').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-field__error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});

		describe('with valid minimal button', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types').as('getActionTypes2');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Delete event type.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes2').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
			});
		});

		describe('with valid button with options', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types').as('getActionTypes2');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
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

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Foo').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(`${name} (Foo)`).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Add event.
				cy.get('.nav__link').contains('New Event').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Bar').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(`${name} (Bar)`).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Delete event type.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes2').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
			});
		});

		describe('with valid start/stop button', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types').as('getActionTypes2');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('PUT', '**/api/actions/*').as('updateAction');
				cy.intercept('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[name="is_continuous"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Start event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Start').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains(name).parents('form').contains('Stop').should('exist');
				cy.contains(name).parents('.list__item').should('have.class', 'list__item--active');

				// Stop event.
				cy.contains(name).parents('form').contains('Stop').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);
				cy.closeToast('Event stopped successfully.');
				cy.contains(name).parents('.list__item').should('not.have.class', 'list__item--active');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Start event.
				cy.get('.nav__link').contains('New Event').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Start').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains(name).parents('form').contains('Stop').should('exist');
				cy.contains(name).parents('.list__item').should('have.class', 'list__item--active');

				// Stop event.
				cy.reload();
				cy.contains(name).parents('.list__item').should('have.class', 'list__item--active');
				cy.contains(name).parents('form').contains('Stop').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);
				cy.closeToast('Event stopped successfully.');
				cy.contains(name).parents('.list__item').should('not.have.class', 'list__item--active');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Delete event type.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes2').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
			});
		});

		describe('with valid start/stop button with options', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types').as('getActionTypes2');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('PUT', '**/api/actions/*').as('updateAction');
				cy.intercept('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
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

				// Start event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Foo').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains(name).parents('form').contains('Stop').should('exist');
				cy.contains(name).parents('form').contains('Foo').should('have.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('form').contains('Bar').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('.list__item').should('have.class', 'list__item--active');

				// Stop event.
				cy.get('.nav__link').contains('New Event').click();
				cy.contains(name).parents('form').contains('Stop').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);
				cy.closeToast('Event stopped successfully.');
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Foo').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('form').contains('Bar').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('.list__item').should('not.have.class', 'list__item--active');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(`${name} (Foo)`).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Start event.
				cy.get('.nav__link').contains('New Event').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Bar').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains(name).parents('form').contains('Stop').should('exist');
				cy.contains(name).parents('form').contains('Foo').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('form').contains('Bar').should('have.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('.list__item').should('have.class', 'list__item--active');

				// Stop event.
				cy.reload();
				cy.contains(name).parents('form').contains('Stop').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);
				cy.closeToast('Event stopped successfully.');
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Foo').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('form').contains('Bar').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('.list__item').should('not.have.class', 'list__item--active');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(`${name} (Bar)`).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Start event.
				cy.get('.nav__link').contains('New Event').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Foo').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains(name).parents('form').contains('Stop').should('exist');
				cy.contains(name).parents('form').contains('Foo').should('have.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('form').contains('Bar').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('.list__item').should('have.class', 'list__item--active');

				// Change event.
				cy.contains(name).parents('form').contains('Bar').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Stop event.
				cy.reload();
				cy.contains(name).parents('form').contains('Stop').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);
				cy.closeToast('Event stopped successfully.');
				cy.contains(name).parents('form').contains('Stop').should('not.exist');
				cy.contains(name).parents('form').contains('Foo').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('form').contains('Bar').should('have.not.class', 'formosa-radio__label--checked');
				cy.contains(name).parents('.list__item').should('not.have.class', 'list__item--active');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(`${name} (Foo)`).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Delete event.
				cy.contains(`${name} (Bar)`).click();
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Delete event type.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes2').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
			});
		});

		describe('with valid minimal number', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types').as('getActionTypes2');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="number"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('.formosa-field__input').type(123);
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(`${name} (123)`).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Delete event type.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes2').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
			});
		});

		describe('with valid minimal text', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types').as('getActionTypes2');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="text"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('.formosa-field__input').type('Foo');
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(`${name} (Foo)`).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event deleted successfully.');
				cy.location('pathname').should('eq', '/events');

				// Delete event type.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes2').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Edit').click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteActionType').its('response.statusCode').should('equal', 204);
				cy.closeToast('Event type deleted successfully.');
				cy.location('pathname').should('eq', '/event-types');
			});
		});

		// TODO: With invalid input.
	});

	describe('view', () => {
		describe('with not found', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/actions').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');

				// View.
				cy.visit('/events/987654321');
				cy.wait('@getAction').its('response.statusCode').should('equal', 404);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: This record does not exist.');
			});
		});

		describe('with server error', () => {
			it('shows an error', () => {
				mockServerError('GET', '**/api/actions/*').as('getAction');

				// View.
				cy.visit('/events/987654321');
				cy.wait('@getAction').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('datetimes', () => {
		describe('with non-continuous event type', () => {
			it('works', () => {
				const name = `Example ${Date.now()}`;
				cy.clock(new Date('2001-01-01T12:00:00Z').getTime(), ['Date']);

				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypesFiltered');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('PUT', '**/api/actions/*').as('updateAction');
				cy.intercept('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Add event.
				cy.wait('@getActionTypesFiltered').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains('since').should('not.exist');

				// Move clock forward.
				cy.clock().invoke('setSystemTime', new Date('2001-02-02T13:00:00Z').getTime() - 60);
				cy.clock().invoke('tick', 60);

				// Check event type page.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Mon, January 1, 2001 (1)').should('exist');
				cy.contains('4:00 AM').should('exist');

				// Check past events page.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains('Mon, January 1, 2001 (1)').should('exist');
				cy.contains('4:00 AM').should('exist');

				// Check event page.
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('[name="start_date"]').should('have.value', '2001-01-01 04:00:00');
				cy.get('[name="end_date"]').should('not.exist');

				// Edit date.
				cy.get('[name="start_date"]').clear().type('2001-01-02 06:00:00');
				cy.get('[type="submit"]').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);

				// Check event type page.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Tue, January 2, 2001 (1)').should('exist');
				cy.contains('6:00 AM').should('exist');

				// Check past events page.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains('Tue, January 2, 2001 (1)').should('exist');
				cy.contains('6:00 AM').should('exist');

				// Check event page.
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('[name="start_date"]').should('have.value', '2001-01-02 06:00:00');
			});
		});

		describe('with continuous event type', () => {
			it('works', () => {
				const name = `Example ${Date.now()}`;
				cy.clock(new Date('2001-01-01T12:00:00Z').getTime(), ['Date']);

				cy.intercept('GET', '**/api/action-types').as('getActionTypes');
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypesFiltered');
				cy.intercept('GET', '**/api/action-types/*').as('getActionType');
				cy.intercept('POST', '**/api/action-types').as('addActionType');
				cy.intercept('DELETE', '**/api/action-types/*').as('deleteActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('PUT', '**/api/actions/*').as('updateAction');
				cy.intercept('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[name="is_continuous"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Start event.
				cy.wait('@getActionTypesFiltered').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');
				cy.contains('since 4:00 AM').should('exist');

				// Move clock forward.
				cy.clock().invoke('setSystemTime', new Date('2001-02-02T13:00:00Z').getTime() - 60);
				cy.clock().invoke('tick', 60);
				cy.get('[data-cy="profile"]').click();
				cy.get('.nav__link').contains('New Event').click();
				cy.wait('@getActionTypesFiltered').its('response.statusCode').should('equal', 200);
				cy.contains('since Jan 1, 4:00 AM').should('exist');

				// Stop event.
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);
				cy.closeToast('Event stopped successfully.');

				// Check event type page.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Mon, January 1, 2001 (1)').should('exist');
				cy.contains('4:00 AM').should('exist');

				// Check past events page.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains('Mon, January 1, 2001 (1)').should('exist');
				cy.contains('4:00 AM').should('exist');

				// Check event page.
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('[name="start_date"]').should('have.value', '2001-01-01 04:00:00');
				cy.get('[name="end_date"]').should('have.value', '2001-02-02 05:00:00');

				// Edit date.
				cy.get('[name="start_date"]').clear().type('2001-01-02 06:00:00');
				cy.get('[name="end_date"]').clear().type('2001-02-03 07:00:00');
				cy.get('[type="submit"]').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);

				// Check event type page.
				cy.get('.nav__link').contains('Event Types').click();
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getActionType').its('response.statusCode').should('equal', 200);
				cy.contains('Tue, January 2, 2001 (1)').should('exist');
				cy.contains('6:00 AM').should('exist');

				// Check past events page.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains('Tue, January 2, 2001 (1)').should('exist');
				cy.contains('6:00 AM').should('exist');

				// Check event page.
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('[name="start_date"]').should('have.value', '2001-01-02 06:00:00');
				cy.get('[name="end_date"]').should('have.value', '2001-02-03 07:00:00');
			});
		});
	});

	describe('edit', () => {
		describe('with valid note', () => {
			it('works', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('POST', '**/api/action-types').as('addActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				cy.intercept('PUT', '**/api/actions/*').as('updateAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Edit.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('[name="notes"]').type('Example note');
				cy.get('[type="submit"]').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 200);
				cy.closeToast('Event saved successfully.');

				// Refresh.
				cy.reload();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('[name="notes"]').should('have.value', 'Example note');
			});
		});

		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('POST', '**/api/action-types').as('addActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				mockServerError('PUT', '**/api/actions/*').as('updateAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Edit.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('[name="notes"]').type('Example note');
				cy.get('[type="submit"]').click();
				cy.wait('@updateAction').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});

	describe('delete', () => {
		describe('with server error', () => {
			it('shows an error', () => {
				cy.intercept('GET', '**/api/action-types?*').as('getActionTypes');
				cy.intercept('POST', '**/api/action-types').as('addActionType');

				cy.intercept('GET', '**/api/actions?*').as('getActions');
				cy.intercept('GET', '**/api/actions/*').as('getAction');
				cy.intercept('POST', '**/api/actions?*').as('addAction');
				mockServerError('DELETE', '**/api/actions/*').as('deleteAction');

				// Add event type.
				const name = `Example ${Date.now()}`;
				cy.visit('/event-types/new');
				cy.get('[name="label"]').type(name);
				cy.get('[name="field_type"][value="button"]').check();
				cy.get('[type="submit"]').click();
				cy.wait('@addActionType').its('response.statusCode').should('equal', 201);
				cy.location('pathname').should('eq', '/');

				// Add event.
				cy.wait('@getActionTypes').its('response.statusCode').should('equal', 200);
				cy.contains(name).parents('form').find('[type="submit"]').click();
				cy.wait('@addAction').its('response.statusCode').should('equal', 201);
				cy.closeToast('Event added successfully.');

				// Delete event.
				cy.get('.nav__link').contains('Past Events').click();
				cy.wait('@getActions').its('response.statusCode').should('equal', 200);
				cy.contains(name).click();
				cy.wait('@getAction').its('response.statusCode').should('equal', 200);
				cy.get('.formosa-button--danger').contains('Delete').click();
				cy.get('dialog .formosa-button--danger').contains('Delete').click();
				cy.wait('@deleteAction').its('response.statusCode').should('equal', 500);
				cy.get('.formosa-alert--error').invoke('text').should('equal', 'Error: Unable to connect to the server. Please try again later.');
			});
		});
	});
});
