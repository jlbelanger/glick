import { Field, Form, Submit } from '@jlbelanger/formosa';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { errorMessageText } from '../../Utilities/Helpers';
import MetaTitle from '../../Components/MetaTitle';

export default function ResetPassword() {
	const [row, setRow] = useState({});
	const { token } = useParams();
	const navigate = useNavigate();
	const [urlSearchParams] = useSearchParams();

	useEffect(() => {
		if (urlSearchParams.get('expires') < Math.floor(Date.now() / 1000)) {
			navigate('/?expired=1');
		}
	}, []);

	return (
		<>
			<MetaTitle title="Reset password" />

			<Form
				afterSubmitSuccess={() => {
					navigate('/');
				}}
				errorMessageText={errorMessageText}
				method="PUT"
				path={`auth/reset-password/${token}${window.location.search}`}
				row={row}
				setRow={setRow}
				successToastText="Password reset successfully."
			>
				<Field
					autoComplete="email"
					label="Email"
					name="email"
					required
					type="email"
				/>

				<Field
					autoComplete="new-password"
					label="New password"
					name="new_password"
					required
					type="password"
				/>

				<Field
					autoComplete="new-password"
					label="Confirm new password"
					name="new_password_confirmation"
					required
					type="password"
				/>

				<Submit label="Reset password" />
			</Form>
		</>
	);
}
