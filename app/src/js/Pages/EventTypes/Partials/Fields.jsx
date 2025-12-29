import { Field, FormContext } from '@jlbelanger/formosa';
import HasMany from './HasMany.jsx';
import { useContext } from 'react';

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
					options={{
						button: 'Buttons',
						number: 'Number',
						text: 'Text',
					}}
					required
					type="radio"
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
						component={HasMany}
						label="Custom button labels"
						labelNote={formState.row.options && formState.row.options.length > 0 ? '' : defaultMessage}
						name="options"
					/>
				</>
			)}

			{formState.row.field_type === 'number' && (
				<Field
					label="Units"
					labelNote="optional, eg. lbs"
					name="suffix"
					size={10}
				/>
			)}

			<Field
				label="Archive?"
				labelNote="archived event types do not appear on the New Event page"
				name="is_archived"
				type="checkbox"
			/>
		</>
	);
}
