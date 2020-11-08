import API from './JsonApiForm/Helpers/API';
import Auth from './Auth/Auth';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { toast } from 'react-toastify';

export default function Header() {
	const logout = () => {
		API.delete('auth/logout')
			.then(() => {
				Auth.logout();
			})
			.catch(() => {
				toast.error('Error.');
			});
	};

	return (
		<header id="header">
			<div className="contain" id="header__contain">
				{Auth.isLoggedIn() && <NavLink activeClassName="active" className="nav__link" to="/profile">Profile</NavLink>}
				<h1>212</h1>
				{Auth.isLoggedIn() && <button className="nav__button" onClick={logout} type="button">Logout</button>}
			</div>
		</header>
	);
}
