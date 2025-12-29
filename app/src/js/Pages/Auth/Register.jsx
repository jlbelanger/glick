import { Field, Submit } from '@jlbelanger/formosa';
import Auth from '../../Utilities/Auth.js';
import { errorMessageText } from '../../Utilities/Helpers.js';
import MetaTitle from '../../Components/MetaTitle.jsx';
import MyForm from '../../Components/MyForm.jsx';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function Register() {
	const navigate = useNavigate();
	const [row, setRow] = useState({});
	const afterSubmitSuccess = (response) => {
		if (response.user) {
			Auth.login(response.user, response.token, response.user.remember);
			window.location.href = import.meta.env.VITE_FRONTEND_URL || '/';
		} else {
			navigate(`/?verify=1&email=${row.email}&username=${row.username}`);
		}
	};

	return (
		<>
			<MetaTitle hideTitleText title="Register" />

			<MyForm
				afterSubmitSuccess={afterSubmitSuccess}
				errorMessageText={errorMessageText}
				method="POST"
				path="auth/register"
				row={row}
				setRow={setRow}
			>
				<Field
					autoComplete="username"
					label="Username"
					name="username"
					required
					type="text"
				/>

				<Field
					autoComplete="email"
					label="Email"
					name="email"
					required
					type="email"
				/>

				<Field
					autoComplete="new-password"
					label="Password"
					name="password"
					required
					type="password"
				/>

				<Field
					autoComplete="new-password"
					label="Confirm password"
					name="password_confirmation"
					required
					type="password"
				/>

				<Submit label="Register" />
			</MyForm>
		</>
	);
}
