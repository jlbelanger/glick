import { Api, Field, FormosaContext } from '@jlbelanger/formosa';
import React, { useContext, useState } from 'react';
import { errorMessageText } from '../../../Utilities/Helpers';
import { getCurrentYmdhmsz } from '../../../Utilities/Datetime';
import PropTypes from 'prop-types';

export default function NewField({ actionType, inlineErrors, setInProgress, setInlineErrors }) {
	const { addToast } = useContext(FormosaContext);
	const [value, setValue] = useState(actionType.in_progress ? actionType.in_progress.option : null);
	const attributes = {
		className: 'formosa-prefix',
		id: actionType.slug,
		name: 'value',
		postfix: (<button className="formosa-button formosa-postfix" type="submit">Add</button>),
		required: true,
		type: 'text',
	};

	if (actionType.field_type === 'number') {
		return (
			<Field
				{...attributes}
				inputMode="decimal"
				suffix={actionType.suffix}
				wrapperClassName="field--new-event field--number"
			/>
		);
	}

	if (actionType.field_type === 'text') {
		return (
			<Field
				{...attributes}
				maxLength={255}
				wrapperClassName="field--new-event field--text"
			/>
		);
	}

	const options = [...actionType.options];
	const hasOptions = options.length > 0;
	const name = hasOptions ? 'option' : 'value';
	if (!hasOptions) {
		let label = 'Add';
		if (actionType.is_continuous) {
			if (actionType.in_progress) {
				label = 'Stop';
			} else {
				label = 'Start';
			}
		}
		return (
			<button className="formosa-button" type="submit">{label}</button>
		);
	}

	if (actionType.in_progress) {
		options.push('Stop');
	}

	return (
		<Field
			name={name}
			labelKey="label"
			options={options}
			type="radio"
			setValue={(newValue) => {
				setInlineErrors({ ...inlineErrors, [actionType.id]: false });

				if (newValue === 'Stop') {
					const data = {
						id: actionType.in_progress.id,
						type: 'actions',
						attributes: {
							end_date: getCurrentYmdhmsz(),
						},
					};
					setValue(null);
					Api.put(`/actions/${actionType.in_progress.id}`, JSON.stringify({ data }))
						.catch((response) => {
							setInlineErrors({ ...inlineErrors, [actionType.id]: errorMessageText(response) });
						})
						.then((response) => {
							if (!response) {
								return;
							}
							addToast('Event stopped successfully.', 'success');
							setInProgress(actionType.id, null);
						});
					return;
				}

				const data = {
					type: 'actions',
					attributes: {
						start_date: getCurrentYmdhmsz(),
					},
					relationships: {
						action_type: {
							data: {
								id: actionType.id,
								type: actionType.type,
							},
						},
						option: {
							data: newValue,
						},
					},
				};
				setValue(newValue);
				Api.post('/actions?include=action_type,option', JSON.stringify({ data }))
					.catch((response) => {
						setInlineErrors({ ...inlineErrors, [actionType.id]: errorMessageText(response) });
					})
					.then((response) => {
						if (!response) {
							return;
						}
						addToast('Event added successfully.', 'success');
						setInProgress(actionType.id, response);
					});
			}}
			value={value}
			valueKey={(option) => ({ id: option.id, type: option.type })}
		/>
	);
}

NewField.propTypes = {
	actionType: PropTypes.object.isRequired,
	inlineErrors: PropTypes.object.isRequired,
	setInProgress: PropTypes.func.isRequired,
	setInlineErrors: PropTypes.func.isRequired,
};
