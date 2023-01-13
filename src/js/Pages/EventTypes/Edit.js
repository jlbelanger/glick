import { Api, Form, Message, Submit } from '@jlbelanger/formosa';
import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Error from '../../Error';
import Fields from './Partials/Fields';
import MetaTitle from '../../MetaTitle';
import MyForm from '../../MyForm';

export default function Edit() {
	const { id } = useParams();
	const [row, setRow] = useState(null);
	const [error, setError] = useState(false);
	const history = useHistory();
	useEffect(() => {
		Api.get(`action-types/${id}?include=options`)
			.then((response) => {
				setRow(response);
			})
			.catch((response) => {
				setError(response.status);
			});
	}, [id]);

	if (error) {
		return (
			<Error status={error} />
		);
	}

	if (row === null) {
		return (
			<MetaTitle title="Edit" />
		);
	}

	return (
		<>
			<MetaTitle title={`Edit ${row.label}`}>
				<Link to={`/event-types/${row.id}`}>&laquo; Back to events</Link>
			</MetaTitle>

			<MyForm
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

			<Form
				afterSubmit={() => {
					history.push('/event-types');
				}}
				beforeSubmit={() => (
					confirm('Are you sure you want to delete this event type?') // eslint-disable-line no-restricted-globals
				)}
				id={id}
				method="DELETE"
				path="action-types"
				showMessage={false}
				successToastText="Event type deleted successfully."
			>
				<h2>{`Delete ${row.label}`}</h2>

				<Message />

				<Submit className="button--danger" label="Delete" />
			</Form>
		</>
	);
}
