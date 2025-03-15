import { prettyDate, prettyTime } from '../../../Utilities/Datetime';
import { getEventLabel } from '../../../Utilities/Helpers';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

export default function Row({ rows, ymd }) {
	return (
		<>
			<tr>
				<th scope="col">{`${prettyDate(ymd)} (${rows.length})`}</th>
			</tr>
			{rows.map((row) => (
				<tr className="table__row" key={row.id}>
					<td>
						<Link className="table__link" to={`/events/${row.id}`}>
							<span className="table__label">
								{getEventLabel(row)}
							</span>
							<span className="table__time">
								{prettyTime(row.start_date)}
							</span>
						</Link>
					</td>
				</tr>
			))}
		</>
	);
}

Row.propTypes = {
	rows: PropTypes.array.isRequired,
	ymd: PropTypes.string.isRequired,
};
