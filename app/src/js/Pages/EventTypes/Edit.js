import { Alert, Api, FormosaContext, Submit } from '@jlbelanger/formosa';
import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import Error from '../../Error';
import { errorMessageText } from '../../Utilities/Helpers';
import Fields from './Partials/Fields';
import MetaTitle from '../../Components/MetaTitle';
import Modal from '../../Components/Modal';
import MyForm from '../../Components/MyForm';

export default function Edit() {
	const api = Api.instance();
	const { addToast } = useContext(FormosaContext);
	const { id } = useParams();
	const [row, setRow] = useState(null);
	const [error, setError] = useState(false);
	const [deleteError, setDeleteError] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const history = useHistory();

	useEffect(() => {
		api(`action-types/${id}?include=options`)
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
			<MetaTitle title="Edit" />
		);
	}

	const deleteRow = () => {
		setShowModal(false);
		Api.delete(`action-types/${id}`)
			.catch((response) => {
				setDeleteError(errorMessageText(response));
			})
			.then((response) => {
				if (!response) {
					return;
				}
				addToast('Event type deleted successfully.', 'success');
				history.push('/event-types');
			});
	};

	return (
		<>
			<MetaTitle title={`Edit ${row.label}`}>
				<Link to={`/event-types/${row.id}`}>&laquo; Back to events</Link>
			</MetaTitle>

			<MyForm
				errorMessageText={errorMessageText}
				id={id}
				method="PUT"
				path="action-types"
				preventEmptyRequest
				relationshipNames={['options']}
				row={row}
				setRow={setRow}
				successToastText="Event type saved successfully."
			>
				<Fields />
				<Submit />
			</MyForm>

			<h2>{`Delete ${row.label}`}</h2>
			{deleteError && (<Alert type="error">{deleteError}</Alert>)}
			<p>
				<button
					className="formosa-button formosa-button--danger button--small"
					onClick={(e) => {
						setDeleteError(false);
						setShowModal(e);
					}}
					type="button"
				>
					Delete
				</button>
			</p>
			{showModal && (
				<Modal
					event={showModal}
					okButtonClass="formosa-button--danger"
					okButtonText="Delete"
					onClickOk={deleteRow}
					onClickCancel={() => { setShowModal(false); }}
					text="Are you sure you want to delete this event type?"
				/>
			)}
		</>
	);
}
