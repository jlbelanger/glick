import { Api, FormosaContext } from '@jlbelanger/formosa';
import { NavLink, useLocation } from 'react-router';
import React, { useContext } from 'react';
import Auth from './Utilities/Auth';
import { errorMessageText } from './Utilities/Helpers';
import Logo from '../svg/logo.svg?react'; // eslint-disable-line import/no-unresolved

export default function Header() {
	const { addToast } = useContext(FormosaContext);
	const location = useLocation();

	const logout = () => {
		Api.delete('auth/logout')
			.catch((response) => {
				if (response.status === 401) {
					return;
				}
				addToast(errorMessageText(response), 'error');
			})
			.then(() => {
				Auth.logout();
			});
	};

	return (
		<header id="header">
			<div className="contain" id="header__contain">
				{Auth.isLoggedIn() && (
					<NavLink className="nav__link" data-cy="profile" to="/profile">Profile</NavLink>
				)}
				<div id="logo"><Logo height="28" fill="#fff" title={import.meta.env.VITE_TITLE} /></div>
				{Auth.isLoggedIn() && (
					<button className="nav__button" data-cy="logout" disabled={location.pathname !== '/profile'} onClick={logout} type="button">
						Logout
					</button>
				)}
			</div>
		</header>
	);
}
