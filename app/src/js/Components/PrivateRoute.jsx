import { Navigate, Outlet } from 'react-router';
import Auth from '../Utilities/Auth';
import React from 'react';

export default function PrivateRoute() {
	if (Auth.isLoggedIn()) {
		return (
			<Outlet />
		);
	}
	return (
		<Navigate to={`/?redirect=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`} replace />
	);
}
