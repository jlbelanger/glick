import { isToday, prettyDatetime, prettyTime } from '../../../Utilities/Datetime';
import { Label } from '@jlbelanger/formosa';
import PropTypes from 'prop-types';
import React from 'react';

export default function NewLabel({ actionType }) {
	let prettyStartDate = null;
	if (actionType.in_progress && actionType.in_progress.start_date) {
		if (isToday(actionType.in_progress.start_date)) {
			prettyStartDate = prettyTime(actionType.in_progress.start_date);
		} else {
			prettyStartDate = prettyDatetime(actionType.in_progress.start_date);
		}
	}
	return (
		<Label
			htmlFor={actionType.field_type !== 'button' ? actionType.slug : null}
			label={actionType.label}
			note={prettyStartDate ? `since ${prettyStartDate}` : ''}
		/>
	);
}

NewLabel.propTypes = {
	actionType: PropTypes.object.isRequired,
};
