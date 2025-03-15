import './commands';

Cypress.Commands.add('login', (username = '', password = '') => {
	username = username || Cypress.env('default_username');
	password = password || Cypress.env('default_password');
	cy.session([username, password], () => {
		const timestamp = (new Date()).getTime();
		cy.visit('/');
		cy.get('[name="username"]').type(username);
		cy.get('[name="password"]').type(password);
		cy.intercept('POST', '**/api/auth/login').as(`login${timestamp}`);
		cy.get('[type="submit"]').click();
		cy.wait(`@login${timestamp}`);
		cy.get('body')
			.then(($body) => {
				if ($body.find('.formosa-alert--error').length > 0) {
					cy.register(username, password);
				}
			});
	});
});

Cypress.Commands.add('register', (username = '', password = '') => {
	cy.intercept('POST', '**/api/auth/register').as('register');
	cy.intercept('POST', '**/api/auth/login').as('login');

	const email = `${username}@example.com`;
	cy.visit('/register');
	cy.get('[name="username"]').type(username);
	cy.get('[name="email"]').type(email);
	cy.get('[name="password"]').type(password);
	cy.get('[name="password_confirmation"]').type(password);
	cy.get('[type="submit"]').click();
	cy.wait('@register');
	cy.get('body')
		.then(($body) => {
			if ($body.find('.formosa-alert--error').length <= 0) {
				cy.location('pathname').should('eq', Cypress.env('public_path'));
				cy.get('.formosa-alert--success').first().invoke('text')
					.should('equal', `Check your email (${email}) to continue the registration process.`);

				// Verify email.
				cy.visit(Cypress.env('mail_url'));
				cy.contains(`[${Cypress.env('site_name')}] Verify Email Address`).click();
				cy.get('#nav-plain-text-tab').click();
				cy.get('[href*="/verify-email"]')
					.then(($a) => {
						cy.visit($a.attr('href'));
						cy.get('[data-cy="verify"]').click();
						cy.closeToast('Email verified successfully.');

						// Login.
						cy.get('[name="username"]').type(username);
						cy.get('[name="password"]').type(Cypress.env('default_password'));
						cy.get('[type="submit"]').click();
						cy.wait('@login').its('response.statusCode').should('equal', 200);
					});
			}
		});
});
