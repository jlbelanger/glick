import { Alert, Api, Field, FormContext } from '@jlbelanger/formosa';
import React, { useContext } from 'react';
import { errorMessageText } from '../../Utilities/Helpers';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function LoginForm({
	message = null,
	row,
	setMessage,
	setShowVerificationButton,
	showVerificationButton = false,
}) {
	const { clearAlert } = useContext(FormContext);

	const resendVerificationEmail = () => {
		clearAlert();
		setMessage(null);
		setShowVerificationButton(false);
		const data = {
			username: row.username || showVerificationButton,
		};
		Api.post('auth/resend-verification', JSON.stringify(data))
			.catch((response) => {
				setMessage(errorMessageText(response));
			})
			.then((response) => {
				if (!response) {
					return;
				}
				setMessage({
					text: 'Check your email to continue the registration process.',
					type: 'success',
				});
			});
	};

	return (
		<>
			{message && (<Alert type={message.type}>{message.text}</Alert>)}

			{showVerificationButton && (
				<p className={`formosa-alert formosa-alert--${showVerificationButton === true ? 'error' : 'success'} post-alert-button`}>
					<button className="formosa-button button--secondary" onClick={resendVerificationEmail} type="button">
						Resend verification email
					</button>
				</p>
			)}

			{/* eslint-disable-next-line react/jsx-one-expression-per-line */}
			<p>For a demo, use the username <b>demo</b> and the password <b>demo</b>.</p>

			<Field
				autoCapitalize="none"
				autoComplete="username"
				label="Username"
				name="username"
				required
				type="text"
			/>

			<Field
				autoComplete="current-password"
				label="Password"
				name="password"
				required
				type="password"
			/>

			<Field
				label="Remember me"
				labelPosition="after"
				name="remember"
				type="checkbox"
			/>

			<div className="formosa-field formosa-field--submit submit-with-postfix">
				<button className="formosa-button formosa-button--submit" type="submit">Log in</button>
				<Link className="formosa-button button--link" to="/forgot-password">Forgot password?</Link>
			</div>
		</>
	);
}

LoginForm.propTypes = {
	message: PropTypes.object,
	row: PropTypes.object.isRequired,
	setMessage: PropTypes.func.isRequired,
	setShowVerificationButton: PropTypes.func.isRequired,
	showVerificationButton: PropTypes.bool,
};
