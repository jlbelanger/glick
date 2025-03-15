import { Alert, Field, Form } from '@jlbelanger/formosa';
import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { errorMessageText } from '../../Utilities/Helpers';
import MetaTitle from '../../Components/MetaTitle';

export default function ForgotPassword() {
	const history = useHistory();
	const [row, setRow] = useState({});
	const [message, setMessage] = useState(false);

	useEffect(() => {
		const urlSearchParams = new URLSearchParams(history.location.search);
		if (urlSearchParams.get('expired')) {
			setMessage({
				text: 'Error: This link has expired.',
				type: 'error',
			});
			history.replace({ search: '' });
		}
	}, []);

	return (
		<>
			<MetaTitle title="Forgot your password?" />

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
		</>
	);
}
