import { Field, FormAlert, Submit } from '@jlbelanger/formosa';
import { errorMessageText } from '../../../Utilities/Helpers.js';
import MyForm from '../../../Components/MyForm.jsx';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function ChangeUsername({ id, username }) {
	const [row, setRow] = useState({ username });

	return (
		<MyForm
			errorMessageText={errorMessageText}
			id={id}
			method="PUT"
			path="users"
			preventEmptyRequest
			row={row}
			setRow={setRow}
			showMessage={false}
			successToastText="Username changed successfully."
		>
			<h2>Change username</h2>

			<FormAlert />

			<Field
				autoComplete="username"
				label="Username"
				name="username"
				required
			/>

			<Submit label="Change username" />
		</MyForm>
	);
}

ChangeUsername.propTypes = {
	id: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
};
