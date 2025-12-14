import { Form, Submit } from '@jlbelanger/formosa';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { errorMessageText } from '../../Utilities/Helpers';
import MetaTitle from '../../Components/MetaTitle';

export default function VerifyEmail() {
	const navigate = useNavigate();
	const [urlSearchParams] = useSearchParams();

	useEffect(() => {
		if (urlSearchParams.get('expires') < Math.floor(Date.now() / 1000)) {
			navigate('/?expired=1');
		}
	}, []);

	return (
		<>
			<MetaTitle title="Verify your email" />

			<Form
				afterSubmitSuccess={() => {
					navigate('/');
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
