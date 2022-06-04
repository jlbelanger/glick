import { Field, Form, Submit } from '@jlbelanger/formosa';
import React, { useState } from 'react';
import Auth from '../../Utilities/Auth';
import { Link } from 'react-router-dom';
import MetaTitle from '../../MetaTitle';

export default function Login() {
	const [row, setRow] = useState({});

	const afterSubmit = (response) => {
		Auth.login(response.user, response.token, response.remember);
		window.location.reload();
	};

	return (
		<>
			<MetaTitle title="Login" hideTitleText />

			<Form
				afterSubmit={afterSubmit}
				method="POST"
				path="auth/login"
				row={row}
				setRow={setRow}
			>
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

				<Submit
					label="Log in"
					postfix={(
						<Link className="formosa-button button--link" to="/forgot-password">Forgot your password?</Link>
					)}
				/>
			</Form>
		</>
	);
}
