describe('event types', () => {
	beforeEach(() => {
		cy.login();
		cy.deleteAllData();
	});

	describe('add', () => {
		describe('with valid minimal button', () => {
			it('works', () => {
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
	});

	// TODO: Edit.
});
