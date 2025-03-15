import Auth from './Utilities/Auth';
import { NavLink } from 'react-router-dom';
import React from 'react';

export default function Footer() {
	return (
		<footer id="footer">
			<nav className="contain" id="nav">
				{Auth.isLoggedIn() ? (
					<>
						<NavLink activeClassName="nav__link--active" className="nav__link" exact to="/">New Event</NavLink>
						<NavLink activeClassName="nav__link--active" className="nav__link" to="/events">Past Events</NavLink>
						<NavLink activeClassName="nav__link--active" className="nav__link" to="/event-types">Event Types</NavLink>
					</>
				) : (
					<>
						<NavLink activeClassName="nav__link--active" className="nav__link" exact to="/">Login</NavLink>
						<NavLink activeClassName="nav__link--active" className="nav__link" to="/register">Register</NavLink>
					</>
				)}
			</nav>
		</footer>
	);
}
