import { Api, FormContainer } from '@jlbelanger/formosa';
import Auth from './Utilities/Auth';
import Footer from './Footer';
import Header from './Header';
import { Outlet } from 'react-router';
import React from 'react';

export default function Layout() {
	if (Auth.isLoggedIn() && !Api.getToken()) {
		Api.setToken(Auth.token());
	}

	document.addEventListener('formosaApiRequest', () => {
		Auth.refresh();
	});

	return (
		<main id="main">
			<FormContainer>
				<Header />
				<Footer />

				<article className="contain" id="article">
					<Outlet />
				</article>
			</FormContainer>
		</main>
	);
}
