import { Navigate, Outlet } from 'react-router';
import Auth from '../Utilities/Auth.js';

export default function PrivateRoute() {
	if (Auth.isLoggedIn()) {
		return <Outlet />;
	}
	return <Navigate replace to={`/?redirect=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`} />;
}
