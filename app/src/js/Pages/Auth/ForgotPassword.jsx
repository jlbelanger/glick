import { Alert, Field, Form } from '@jlbelanger/formosa';
import { Link, useNavigate, useSearchParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import Auth from '../../Utilities/Auth';
import { errorMessageText } from '../../Utilities/Helpers';
import MetaTitle from '../../Components/MetaTitle';

export default function ForgotPassword() {
	const [urlSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [row, setRow] = useState({});
	const [message, setMessage] = useState(false);

	useEffect(() => {
		if (urlSearchParams.get('expired')) {
			setMessage({
				text: 'Error: This link has expired.',
				type: 'error',
			});
			navigate(window.location.pathname, { replace: true }); // Remove query param.
		}
	}, []);

	if (Auth.isLoggedIn()) {
		return null;
	}

	return (
		<Form
			beforeSubmit={() => { setMessage(false); return true; }}
			clearOnSubmit
			errorMessageText={errorMessageText}
			method="POST"
			path="auth/forgot-password"
			row={row}
			setRow={setRow}
			successMessageText="If there is an account with this email address, you will receive a password reset email shortly."
		>
			<MetaTitle title="Forgot your password?" />

			{message && (<Alert type={message.type}>{message.text}</Alert>)}

			<Field
				autoComplete="email"
				label="Email"
				name="email"
				required
				type="email"
			/>

			<div className="formosa-field formosa-field--submit submit-with-postfix">
				<button className="formosa-button formosa-button--submit" type="submit">Send link</button>
				<Link className="formosa-button button--link" to="/">Back to login</Link>
			</div>
		</Form>
	);
}
