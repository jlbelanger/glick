import { createBrowserRouter } from 'react-router';
import Error404 from './Error404';
import EventEdit from './Pages/Events/Edit';
import EventList from './Pages/Events/List';
import EventTypeEdit from './Pages/EventTypes/Edit';
import EventTypeList from './Pages/EventTypes/List';
import EventTypeNew from './Pages/EventTypes/New';
import EventTypeView from './Pages/EventTypes/View';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import Layout from './Layout';
import Login from './Pages/Auth/Login';
import PrivateRoute from './Components/PrivateRoute';
import Profile from './Pages/Users/Edit';
import Register from './Pages/Auth/Register';
import ResetPassword from './Pages/Auth/ResetPassword';
import VerifyEmail from './Pages/Auth/VerifyEmail';

export default createBrowserRouter(
	[
		{
			path: '/',
			Component: Layout,
			children: [
				{
					index: true,
					Component: Login,
				},
				{
					path: 'register',
					Component: Register,
				},
				{
					path: 'forgot-password',
					Component: ForgotPassword,
				},
				{
					path: 'reset-password/:token',
					Component: ResetPassword,
				},
				{
					path: 'verify-email',
					Component: VerifyEmail,
				},
				{
					path: '',
					Component: PrivateRoute,
					children: [
						{ path: 'event-types', Component: EventTypeList },
						{ path: 'event-types/new', Component: EventTypeNew },
						{ path: 'event-types/:id/edit', Component: EventTypeEdit },
						{ path: 'event-types/:id', Component: EventTypeView },
						{ path: 'events', Component: EventList },
						{ path: 'events/:id', Component: EventEdit },
						{ path: 'profile', Component: Profile },
					],
				},
				{
					path: '*',
					Component: Error404,
				},
			],
		},
	]
);
