import { FormContext, Input } from '@jlbelanger/formosa';
import React, { useContext, useState } from 'react';

export default function HasMany() {
	const { formState } = useContext(FormContext);
	const [tempId, setTempId] = useState(1);
	const [newLabel, setNewLabel] = useState('');

	const onAdd = () => {
		if (!newLabel) {
			return;
		}

		const newValue = {
			id: `temp-${tempId}`,
			type: 'options',
			action_type_id: 'temp-this-id',
			label: newLabel,
		};
		let newOptions = [];
		if (Array.isArray(formState.row.options)) {
			newOptions = [...formState.row.options];
		}
		newOptions.push(newValue);

		setTempId(tempId + 1);
		formState.setRow({
			...formState.row,
			options: newOptions,
		});
		setNewLabel('');
		document.getElementById('new-label').focus();
	};

	const onKeyDown = (e) => {
		if (e.key !== 'Enter') {
			return;
		}
		if (newLabel) {
			e.preventDefault();
			e.stopPropagation();
			onAdd();
		}
	};

	const onRemove = (e) => {
		const i = e.target.getAttribute('data-index');
		if (i < 0) {
			return;
		}

		const newOptions = [...formState.row.options];
		newOptions.splice(i, 1);

		formState.setRow({ ...formState.row, options: newOptions });
	};

	return (
		<table className="formosa-has-many">
			{formState.row.options && formState.row.options.length > 0 && (
				<tbody className="formosa-has-many__body">
					{formState.row.options.map((value, i) => {
						const isRemovable = !value.has_events || value.id.startsWith('temp-');
						const rowKey = `included.${value.type}.${value.id}`;
						const fieldKey = `${rowKey}.label`;
						const hasError = Object.prototype.hasOwnProperty.call(formState.errors, fieldKey);
						const className = ['formosa-has-many__column'];
						if (hasError) {
							className.push('formosa-field--has-error');
						}
						return (
							<tr className="formosa-has-many__row" key={value.id}>
								<td className={className.join(' ')}>
									<Input className="formosa-prefix" name={`options.${i}.label`} />
									{hasError && <div className="formosa-field__error">{formState.errors[rowKey].join((<br />))}</div>}
								</td>
								<td className="formosa-has-many__column formosa-has-many__column--button">
									<button
										className="formosa-button formosa-button--remove-has-many formosa-has-many__button formosa-postfix"
										data-index={i}
										disabled={!isRemovable}
										onClick={onRemove}
										type="button"
									>
										Remove
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			)}
			<tfoot className="formosa-has-many__foot">
				<tr className="formosa-has-many__row formosa-has-many__row--new">
					<td className="formosa-has-many__column">
						<Input
							className="formosa-prefix"
							id="new-label"
							onKeyDown={onKeyDown}
							setValue={setNewLabel}
							value={newLabel}
						/>
					</td>
					<td className="formosa-has-many__column formosa-has-many__column--button">
						<button
							className="formosa-button formosa-button--add-has-many formosa-has-many__button formosa-postfix"
							onClick={onAdd}
							type="button"
						>
							Add
						</button>
					</td>
				</tr>
			</tfoot>
		</table>
	);
}
