import { Field, FormContext } from '@jlbelanger/formosa';
import React, { useContext } from 'react';

export default function Fields() {
	const { formState } = useContext(FormContext);
	const defaultMessage = `default: ${formState.row.is_continuous ? 'Start/Stop' : 'Add'}`;

	return (
		<>
			<Field
				label="Name"
				name="label"
				required
			/>

			{!formState.row.id && (
				<Field
					label="Style"
					name="field_type"
					required
					type="radio"
					options={{
						button: 'Buttons',
						number: 'Number',
						text: 'Text',
					}}
				/>
			)}

			{formState.row.field_type === 'button' && (
				<>
					<Field
						label="Track when the event stops"
						name="is_continuous"
						type="checkbox"
					/>

					<Field
						label="Custom button labels"
						name="options"
						labelKey="label"
						labelNote={formState.row.options && formState.row.options.length > 0 ? '' : defaultMessage}
						recordType="options"
						removable={(value) => (!value.has_events)}
						type="has-many"
					/>
				</>
			)}

			{formState.row.field_type === 'number' && (
				<Field
					label="Units"
					name="suffix"
					labelNote="optional, eg. lbs"
					size={10}
				/>
			)}
		</>
	);
}
