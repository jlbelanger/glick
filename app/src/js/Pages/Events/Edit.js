import { Alert, Api, FormosaContext, Submit } from '@jlbelanger/formosa';
import { errorMessageText, getEventLabel } from '../../Utilities/Helpers';
import { getLocalYmdmsFromYmdhmsz, getYmdhmszFromLocalYmdhms } from '../../Utilities/Datetime';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Error from '../../Error';
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
		api(`actions/${id}?include=action_type,option`)
			.catch((response) => {
				setError(response);
			})
			.then((response) => {
				if (!response) {
					return;
				}
				if (response.start_date) {
					if (!response.start_date_original) {
						response.start_date_original = response.start_date;
					}
					response.start_date = getLocalYmdmsFromYmdhmsz(response.start_date_original);
				}
				if (response.end_date) {
					if (!response.end_date_original) {
						response.end_date_original = response.end_date;
					}
					response.end_date = getLocalYmdmsFromYmdhmsz(response.end_date_original);
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
		Api.delete(`actions/${id}`)
			.catch((response) => {
				setDeleteError(errorMessageText(response));
			})
			.then((response) => {
				if (!response) {
					return;
				}
				addToast('Event deleted successfully.', 'success');
				history.push('/events');
			});
	};

	const filterValues = (values) => {
		if (values.start_date) {
			values.start_date = getYmdhmszFromLocalYmdhms(values.start_date);
		}
		if (values.end_date) {
			values.end_date = getYmdhmszFromLocalYmdhms(values.end_date);
		}
		return values;
	};

	return (
		<>
			<MetaTitle title={`Edit ${getEventLabel(row)}`} />

			<MyForm
				errorMessageText={errorMessageText}
				id={id}
				filterValues={filterValues}
				method="PUT"
				path="actions"
				preventEmptyRequest
				row={row}
				setRow={setRow}
				successToastText="Event saved successfully."
			>
				<Fields />
				<Submit />
			</MyForm>

			<h2>{`Delete ${row.action_type.label}`}</h2>
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
					text="Are you sure you want to delete this event?"
				/>
			)}
		</>
	);
}
