import { Api, Field, FormosaContext } from '@jlbelanger/formosa';
import React, { useContext, useState } from 'react';
import { errorMessageText } from '../../../Utilities/Helpers';
import Modal from '../../../Components/Modal';
import PropTypes from 'prop-types';

export default function DeleteData({ setDeleteError }) {
	const { addToast } = useContext(FormosaContext);
	const [types, setTypes] = useState([]);
	const [showModal, setShowModal] = useState(false);

	const onClickOk = () => {
		setShowModal(false);
		Api.post('users/delete-data', JSON.stringify({ types }))
			.catch((response) => {
				setDeleteError(errorMessageText(response));
			})
			.then((response) => {
				if (!response) {
					return;
				}
				addToast('Data deleted successfully.', 'success');
			});
	};

	return (
		<>
			<Field
				fieldsetClassName="radio-list"
				options={['events', 'event types']}
				name="types"
				value={types}
				setValue={setTypes}
				type="checkbox-list"
			/>

			<p>
				<button
					className="formosa-button formosa-button--danger"
					onClick={(e) => {
						setDeleteError(false);
						setShowModal(e);
					}}
					type="button"
				>
					Delete selected data
				</button>
			</p>

			{showModal && (
				<Modal
					event={showModal}
					okButtonClass="formosa-button--danger"
					okButtonText="Delete"
					onClickOk={onClickOk}
					onClickCancel={() => { setShowModal(false); }}
					text="Are you sure you want to delete this data?"
				/>
			)}
		</>
	);
}

DeleteData.propTypes = {
	setDeleteError: PropTypes.func.isRequired,
};
