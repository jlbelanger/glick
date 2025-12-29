import { Api, FormContainer } from '@jlbelanger/formosa';
import Auth from './Utilities/Auth.js';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import { Outlet } from 'react-router';

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
