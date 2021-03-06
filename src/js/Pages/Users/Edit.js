import {
	Api,
	Field,
	Flash,
	Form,
	Submit,
} from '@jlbelanger/formosa';
import React, { useEffect, useState } from 'react';
import Auth from '../../Utilities/Auth';
import Error from '../../Error';
import MetaTitle from '../../MetaTitle';

export default function Edit() {
	const id = Auth.id();
	const [row, setRow] = useState(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		if (row === null) {
			Api.get(`users/${id}`)
				.then((response) => {
					setRow(response);
				})
				.catch((response) => {
					setError(response.status);
				});
		}
		return () => {};
	});

	if (error) {
		return (
			<Error status={error} />
		);
	}

	if (row === null) {
		return null;
	}

	const afterDelete = () => {
		Auth.logout();
	};

	return (
		<>
			<MetaTitle title="Edit profile" />

			<Form
				id={row.id}
				method="PUT"
				path="users"
				preventEmptyRequest
				row={row}
				successToastMessage="Profile saved successfully."
			>
				<Field
					autoComplete="username"
					label="Username"
					name="username"
					required
				/>

				<Submit />
			</Form>

			<Form
				hideFlash
				method="PUT"
				path={`users/${row.id}/change-email`}
				preventEmptyRequest
				row={row}
				successToastMessage="Email changed successfully."
			>
				<h3>Change email</h3>

				<Flash />

				<Field
					autoComplete="email"
					label="Email"
					name="email"
					required
					type="email"
				/>

				<Field
					autoComplete="current-password"
					label="Current password"
					name="password"
					required
					type="password"
				/>

				<Submit />
			</Form>

			<Form
				clearOnSubmit
				hideFlash
				method="PUT"
				path={`users/${row.id}/change-password`}
				preventEmptyRequest
				successToastMessage="Password changed successfully."
			>
				<h3>Change password</h3>

				<Flash />

				<Field
					autcomplete="new-password"
					label="New password"
					name="new_password"
					required
					type="password"
				/>

				<Field
					autcomplete="new-password"
					label="Confirm new password"
					name="new_password_confirmation"
					required
					type="password"
				/>

				<Field
					autoComplete="current-password"
					label="Current password"
					name="password"
					required
					type="password"
				/>

				<Submit />
			</Form>

			<Form
				afterSubmit={afterDelete}
				hideFlash
				id={row.id}
				method="DELETE"
				path="users"
				warnOnUnload={false}
			>
				<h3>Delete account</h3>

				<Flash />

				<Submit className="button--danger" label="Delete" />
			</Form>
		</>
	);
}
