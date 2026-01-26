import { createBrowserRouter } from 'react-router';
import Error404 from './Error404.jsx';
import EventEdit from './Pages/Events/Edit.jsx';
import EventList from './Pages/Events/List.jsx';
import EventTypeEdit from './Pages/EventTypes/Edit.jsx';
import EventTypeList from './Pages/EventTypes/List.jsx';
import EventTypeNew from './Pages/EventTypes/New.jsx';
import EventTypeView from './Pages/EventTypes/View.jsx';
import ForgotPassword from './Pages/Auth/ForgotPassword.jsx';
import Layout from './Layout.jsx';
import Login from './Pages/Auth/Login.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';
import Profile from './Pages/Users/Edit.jsx';
import Register from './Pages/Auth/Register.jsx';
import ResetPassword from './Pages/Auth/ResetPassword.jsx';
import VerifyEmail from './Pages/Auth/VerifyEmail.jsx';

export default createBrowserRouter([
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
]);
