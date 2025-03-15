import { Form, Submit } from '@jlbelanger/formosa';
import React, { useEffect } from 'react';
import { errorMessageText } from '../../Utilities/Helpers';
import MetaTitle from '../../Components/MetaTitle';
import { useHistory } from 'react-router-dom';

export default function VerifyEmail() {
	const history = useHistory();

	useEffect(() => {
		const urlSearchParams = new URLSearchParams(history.location.search);
		if (urlSearchParams.get('expires') < Math.floor(Date.now() / 1000)) {
			history.push('/?expired=1');
		}
	}, []);

	return (
		<>
			<MetaTitle title="Verify your email" />

			<Form
				afterSubmitSuccess={() => {
					history.push('/');
				}}
				errorMessageText={errorMessageText}
				method="POST"
				path={`auth/verify-email${window.location.search}`}
				successToastText="Email verified successfully."
			>
				<p>
					Please click the verify button to complete the registration process.
				</p>
				<Submit data-cy="verify" label="Verify" />
			</Form>
		</>
	);
}
