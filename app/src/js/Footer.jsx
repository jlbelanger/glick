import Auth from './Utilities/Auth';
import { NavLink } from 'react-router';
import React from 'react';

export default function Footer() {
	return (
		<footer id="footer">
			<nav className="contain" id="nav">
				{Auth.isLoggedIn() ? (
					<>
						<NavLink className="nav__link" to="/">New Event</NavLink>
						<NavLink className="nav__link" to="/events">Past Events</NavLink>
						<NavLink className="nav__link" to="/event-types">Event Types</NavLink>
					</>
				) : (
					<>
						<NavLink className="nav__link" to="/">Login</NavLink>
						<NavLink className="nav__link" to="/register">Register</NavLink>
					</>
				)}
			</nav>
		</footer>
	);
}
