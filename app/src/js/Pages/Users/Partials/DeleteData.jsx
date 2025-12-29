import { Api, Field, FormosaContext } from '@jlbelanger/formosa';
import { useContext, useState } from 'react';
import { errorMessageText } from '../../../Utilities/Helpers.js';
import Modal from '../../../Components/Modal.jsx';
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
				name="types"
				options={['events', 'event types']}
				setValue={setTypes}
				type="checkbox-list"
				value={types}
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
					onClickCancel={() => {
						setShowModal(false);
					}}
					onClickOk={onClickOk}
					text="Are you sure you want to delete this data?"
				/>
			)}
		</>
	);
}

DeleteData.propTypes = {
	setDeleteError: PropTypes.func.isRequired,
};
