import React, { useEffect, useState } from 'react';
import API from '../Helpers/API';
import { Link } from 'react-router-dom';

export default function EventTypeList() {
	const [rows, setRows] = useState(null);
	useEffect(() => {
		if (rows === null) {
			API.get('action-types')
				.then((response) => {
					setRows(response);
				});
		}
		return () => {};
	});

	if (rows === null) {
		return null;
	}

	if (rows.length <= 0) {
		return (
			<>
				<h2>Event types</h2>
				<p>No event types found!</p>
			</>
		);
	}

	return (
		<>
			<h2>Event types</h2>
			<ul className="list">
				<li className="list__item">
					<Link className="list__link" to="/event-types/new">+ Add New</Link>
				</li>
				{rows.map(row => (
					<li className="list__item" key={row.id}>
						<Link className="list__link" to={`/event-types/${row.id}`}>{row.label}</Link>
					</li>
				))}
			</ul>
		</>
	);
}
