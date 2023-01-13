import { Field, FormContext } from '@jlbelanger/formosa';
import React, { useContext } from 'react';

export default function Fields() {
	const { formState } = useContext(FormContext);
	const options = {};
	if (formState.row.action_type.options) {
		formState.row.action_type.options.forEach((option) => {
			options[option.label] = option.label;
		});
	}
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	return (
		<>
			<Field
				convertToTimezone={timeZone}
				label={formState.row.action_type.is_continuous ? 'Start date' : 'Date'}
				name="start_date"
				required
				type="text"
			/>

			{!!formState.row.action_type.is_continuous && (
				<Field
					convertToTimezone={timeZone}
					label="End date"
					name="end_date"
					type="text"
				/>
			)}

			{formState.row.action_type.field_type !== 'button' && (
				<Field
					label="Value"
					name="value"
					suffix={formState.row.action_type.suffix}
					type="text"
					wrapperClassName={`field--${formState.row.action_type.field_type}`}
				/>
			)}

			{formState.row.action_type.options && (
				<Field
					label="Value"
					name="value"
					options={options}
					type="radio"
					valueKey={(option) => ({ id: option.id, type: option.type })}
				/>
			)}
		</>
	);
}
