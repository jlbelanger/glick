import React, { useEffect, useState } from 'react';
import { Api } from '@jlbelanger/formosa';
import Error from '../../Error';
import { Link } from 'react-router-dom';
import MetaTitle from '../../Components/MetaTitle';

export default function List() {
	const api = Api.instance();
	const [rows, setRows] = useState(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		api('action-types')
			.catch((response) => {
				setError(response);
			})
			.then((response) => {
				if (!response) {
					return;
				}
				setRows(response);
			});
	}, []);

	if (error) {
		return (
			<Error error={error} />
		);
	}

	if (rows === null) {
		return (
			<MetaTitle title="Event types" />
		);
	}

	return (
		<>
			<MetaTitle title="Event types">
				<Link to="/event-types/new">+ Add New</Link>
			</MetaTitle>

			{rows.length > 0 ? (
				<ul className="list">
					{rows.map((row) => (
						<li className="list__item" key={row.id}>
							<Link className="list__link" to={`/event-types/${row.id}`}>{row.label}</Link>
						</li>
					))}
				</ul>
			) : (
				<p>No event types found.</p>
			)}
		</>
	);
}
