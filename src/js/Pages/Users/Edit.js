import { Alert, Api } from '@jlbelanger/formosa';
import React, { useEffect, useState } from 'react';
import Auth from '../../Utilities/Auth';
import ChangeEmail from './Partials/ChangeEmail';
import ChangePassword from './Partials/ChangePassword';
import ChangeUsername from './Partials/ChangeUsername';
import DeleteData from './Partials/DeleteData';
import Error from '../../Error';
import { errorMessageText } from '../../Utilities/Helpers';
import MetaTitle from '../../Components/MetaTitle';
import Modal from '../../Components/Modal';

export default function Edit() {
	const api = Api.instance();
	const id = Auth.id();
	const [row, setRow] = useState(null);
	const [error, setError] = useState(false);
	const [deleteError, setDeleteError] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const deleteRow = () => {
		setShowModal(false);
		Api.delete(`users/${row.id}`)
			.catch((response) => {
				setDeleteError(errorMessageText(response));
			})
			.then((response) => {
				if (!response) {
					return;
				}
				Auth.logout();
			});
	};

	useEffect(() => {
		api(`users/${id}`)
			.catch((response) => {
				setError(response);
			})
			.then((response) => {
				if (!response) {
					return;
				}
				setRow(response);
			});
	}, [id]);

	if (error) {
		return (
			<Error error={error} />
		);
	}

	if (row === null) {
		return (
			<MetaTitle title="Profile" />
		);
	}

	return (
		<>
			<MetaTitle title="Profile" />

			<ChangeUsername id={row.id} username={row.username} />
			<ChangeEmail email={row.email} />
			<ChangePassword />

			<h2>Delete data</h2>
			{deleteError && (<Alert type="error">{deleteError}</Alert>)}
			<DeleteData setDeleteError={setDeleteError} user={row} />

			<p>
				<button
					className="formosa-button formosa-button--danger"
					onClick={(e) => {
						setDeleteError(false);
						setShowModal(e);
					}}
					type="button"
				>
					Delete account
				</button>
			</p>

			{showModal && (
				<Modal
					event={showModal}
					okButtonClass="formosa-button--danger"
					okButtonText="Delete"
					onClickOk={deleteRow}
					onClickCancel={() => { setShowModal(false); }}
					text="Are you sure you want to delete your account?"
				/>
			)}
		</>
	);
}
