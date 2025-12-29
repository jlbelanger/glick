import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Auth from '../../Utilities/Auth.js';
import { errorMessageText } from '../../Utilities/Helpers.js';
import EventNew from '../Events/New.jsx';
import { Form } from '@jlbelanger/formosa';
import LoginForm from './LoginForm.jsx';
import MetaTitle from '../../Components/MetaTitle.jsx';

export default function Login() {
	const [urlSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [row, setRow] = useState({});
	const [message, setMessage] = useState(null);
	const [showVerificationButton, setShowVerificationButton] = useState(false);

	const beforeSubmit = () => {
		setMessage(null);
		setShowVerificationButton(false);
		return true;
	};

	const afterSubmitFailure = (response) => {
		setShowVerificationButton(response.errors[0].code === 'auth.unverified');
	};

	const afterSubmitSuccess = (response) => {
		let redirectPath;
		if (urlSearchParams.get('redirect') && urlSearchParams.get('redirect')[0] === '/') {
			redirectPath = urlSearchParams.get('redirect');
		} else {
			redirectPath = '/';
		}
		Auth.login(response.user, response.token, response.user.remember);
		window.location.href = redirectPath;
	};

	useEffect(() => {
		if (urlSearchParams.get('status') === '401') {
			setMessage({
				text: 'Your session has expired. Please log in again.',
				type: 'warning',
			});
			navigate(window.location.pathname, { replace: true }); // Remove query param.
		} else if (urlSearchParams.get('verify')) {
			setMessage({
				text: `Check your email (${urlSearchParams.get('email')}) to continue the registration process.`,
				type: 'success',
			});
			setShowVerificationButton(urlSearchParams.get('username'));
			navigate(window.location.pathname, { replace: true }); // Remove query param.
		} else if (urlSearchParams.get('expired')) {
			navigate('/forgot-password?expired=1');
		}
	}, []);

	if (Auth.isLoggedIn()) {
		return <EventNew />;
	}

	return (
		<>
			<MetaTitle hideTitleText title="Login" />

			<Form
				afterSubmitFailure={afterSubmitFailure}
				afterSubmitSuccess={afterSubmitSuccess}
				beforeSubmit={beforeSubmit}
				errorMessageText={(response) => (errorMessageText(response, false))}
				method="POST"
				path="auth/login"
				row={row}
				setRow={setRow}
			>
				<LoginForm
					message={message}
					row={row}
					setMessage={setMessage}
					setShowVerificationButton={setShowVerificationButton}
					showVerificationButton={showVerificationButton}
				/>
			</Form>
		</>
	);
}
