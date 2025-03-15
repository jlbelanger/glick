Cypress.Commands.add('deleteAllData', () => {
	cy.intercept('GET', '**/api/users/*').as('getUser');
	cy.intercept('POST', '**/api/users/delete-data').as('deleteData');

	cy.visit('/profile');
	cy.wait('@getUser').its('response.statusCode').should('equal', 200);
	cy.get('[value="events"]').check();
	cy.get('[value="event types"]').check();
	cy.get('.formosa-button--danger').contains('Delete selected data').click();
	cy.get('dialog .formosa-button--danger').contains('Delete').click();
	cy.wait('@deleteData').its('response.statusCode').should('equal', 204);
	cy.closeToast('Data deleted successfully.');
});

Cypress.Commands.add('closeToast', (message) => {
	cy.contains(message).should('exist');
	cy.get('.formosa-toast__close').click();
});

export const mockServerError = (method, url) => ( // eslint-disable-line import/prefer-default-export
	cy.intercept(
		method,
		url,
		{
			statusCode: 500,
			body: {
				errors: [
					{
						title: 'Unable to connect to the server. Please try again later.',
						status: '500',
					},
				],
			},
		}
	)
);
