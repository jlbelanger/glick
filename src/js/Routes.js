import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Auth from './Utilities/Auth';
import Error404 from './Error404';
import EventEdit from './Pages/Events/Edit';
import EventList from './Pages/Events/List';
import EventNew from './Pages/Events/New';
import EventTypeEdit from './Pages/EventTypes/Edit';
import EventTypeList from './Pages/EventTypes/List';
import EventTypeNew from './Pages/EventTypes/New';
import EventTypeView from './Pages/EventTypes/View';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import Login from './Pages/Auth/Login';
import Profile from './Pages/Users/Edit';
import React from 'react';
import Register from './Pages/Auth/Register';
import ResetPassword from './Pages/Auth/ResetPassword';
import VerifyEmail from './Pages/Auth/VerifyEmail';

export default function Routes() {
	const location = useLocation();

	if (!Auth.isLoggedIn()) {
		return (
			<Switch>
				<Route exact path="/"><Login /></Route>
				<Route exact path="/register"><Register /></Route>
				<Route exact path="/forgot-password"><ForgotPassword /></Route>
				<Route exact path="/reset-password/:token"><ResetPassword /></Route>
				<Route exact path="/verify-email"><VerifyEmail /></Route>
				<Route><Redirect to={`/?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`} /></Route>
			</Switch>
		);
	}

	return (
		<Switch>
			<Route exact path="/"><EventNew /></Route>
			<Route exact path="/event-types"><EventTypeList /></Route>
			<Route exact path="/event-types/new"><EventTypeNew /></Route>
			<Route path="/event-types/:id/edit"><EventTypeEdit /></Route>
			<Route path="/event-types/:id"><EventTypeView /></Route>
			<Route exact path="/events"><EventList /></Route>
			<Route path="/events/:id"><EventEdit /></Route>
			<Route exact path="/profile"><Profile /></Route>
			<Route><Error404 /></Route>
		</Switch>
	);
}
