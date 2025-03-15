import React, { useEffect, useState } from 'react';
import Auth from '../../Utilities/Auth';
import { errorMessageText } from '../../Utilities/Helpers';
import { Form } from '@jlbelanger/formosa';
import LoginForm from './LoginForm';
import MetaTitle from '../../Components/MetaTitle';
import { useHistory } from 'react-router-dom';

export default function Login() {
	const history = useHistory();
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
		const urlSearchParams = new URLSearchParams(history.location.search);
		let redirect;
		if (urlSearchParams.get('redirect') && urlSearchParams.get('redirect')[0] === '/') {
			redirect = urlSearchParams.get('redirect');
		} else {
			redirect = process.env.PUBLIC_URL || '/';
		}
		Auth.login(response.user, response.token, response.user.remember);
		window.location.href = redirect;
	};

	useEffect(() => {
		const urlSearchParams = new URLSearchParams(history.location.search);
		if (urlSearchParams.get('status') === '401') {
			setMessage({
				text: 'Your session has expired. Please log in again.',
				type: 'warning',
			});
			history.replace({ search: '' });
		} else if (urlSearchParams.get('verify')) {
			setMessage({
				text: `Check your email (${urlSearchParams.get('email')}) to continue the registration process.`,
				type: 'success',
			});
			setShowVerificationButton(urlSearchParams.get('username'));
			history.replace({ search: '' });
		} else if (urlSearchParams.get('expired')) {
			history.push('/forgot-password?expired=1');
		}
	}, []);

	return (
		<>
			<MetaTitle title="Login" hideTitleText />

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
					showVerificationButton={showVerificationButton}
					setShowVerificationButton={setShowVerificationButton}
				/>
			</Form>
		</>
	);
}
