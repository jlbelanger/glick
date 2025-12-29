import { errorMessageText } from '../../Utilities/Helpers.js';
import Fields from './Partials/Fields.jsx';
import MetaTitle from '../../Components/MetaTitle.jsx';
import MyForm from '../../Components/MyForm.jsx';
import { Submit } from '@jlbelanger/formosa';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function New() {
	const [row, setRow] = useState({});
	const navigate = useNavigate();

	return (
		<>
			<MetaTitle title="Add new event type" />

			<MyForm
				afterSubmitSuccess={() => {
					navigate('/');
				}}
				errorMessageText={errorMessageText}
				filterBody={(body) => {
					if (body.included) {
						body.included = body.included.map((rel) => {
							if (!rel.attributes.action_type_id) {
								rel.attributes.action_type_id = 'temp-this-id';
							}
							return rel;
						});
					}
					return body;
				}}
				method="POST"
				path="action-types"
				relationshipNames={['options']}
				row={row}
				setRow={setRow}
			>
				<Fields />
				<Submit />
			</MyForm>
		</>
	);
}
