import { Alert } from '@jlbelanger/formosa';
import Auth from './Utilities/Auth';
import MetaTitle from './Components/MetaTitle';
import PropTypes from 'prop-types';
import React from 'react';

export default function Error({ error }) {
	if (error.status === 401) {
		Auth.logout(error.status);
		return null;
	}

	let message = 'Error loading data. Please try again later.';
	if (error.errors[0].title) {
		message = `Error: ${error.errors[0].title}`;
	}

	return (
		<>
			<MetaTitle title="Error" />
			<Alert type="error">{message}</Alert>
		</>
	);
}

Error.propTypes = {
	error: PropTypes.object.isRequired,
};
