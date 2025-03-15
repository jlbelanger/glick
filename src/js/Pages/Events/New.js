import { Api, Form } from '@jlbelanger/formosa';
import React, { useEffect, useState } from 'react';
import Error from '../../Error';
import { errorMessageText } from '../../Utilities/Helpers';
import { getCurrentYmdhmsz } from '../../Utilities/Datetime';
import MetaTitle from '../../Components/MetaTitle';
import NewField from './Partials/NewField';
import NewLabel from './Partials/NewLabel';
import { Redirect } from 'react-router-dom';

export default function New() {
	const api = Api.instance();
	const [rows, setRows] = useState(null);
	const [error, setError] = useState(false);
	const [inlineErrors, setInlineErrors] = useState({});
	const [actions, setActions] = useState({});

	useEffect(() => {
		api('action-types?filter[is_archived][eq]=0&include=options')
			.catch((response) => {
				setError(response);
			})
			.then((response) => {
				if (!response) {
					return;
				}
				setRows(response);

				const newActions = {};
				response.forEach((actionType) => {
					newActions[actionType.id] = {
						action_type: {
							id: actionType.id,
							type: 'action_types',
						},
					};
				});
				setActions(newActions);
			});
	}, []);

	if (error) {
		return (
			<Error error={error} />
		);
	}

	if (rows === null) {
		return null;
	}

	if (rows.length <= 0) {
		return (
			<Redirect to="/event-types/new" />
		);
	}

	const filterValues = (values) => {
		// Convert JSON options strings to objects.
		if (values.option && values.option[0] === '{') {
			values.option = JSON.parse(values.option);
		}

		// Remove default Add/Start/Stop values.
		let actionType;
		if (Object.prototype.hasOwnProperty.call(values, 'action_type')) {
			actionType = rows.find((row) => row.id === values.action_type.id);
		} else {
			actionType = rows.find((row) => row.in_progress.id === values.id);
		}
		if (actionType && actionType.field_type === 'button' && actionType.options.length <= 0) {
			delete values.value;
		}

		return values;
	};
	const filterBody = (body) => {
		body.data.attributes.start_date = getCurrentYmdhmsz();
		return body;
	};
	const filterBodyStop = (body) => {
		body.data.attributes.end_date = getCurrentYmdhmsz();
		return body;
	};

	const afterSubmitSuccess = (action) => {
		if (!action.action_type.is_continuous) {
			return;
		}
		const newActionTypes = [...rows];
		newActionTypes.forEach((actionType, i) => {
			if (actionType.id === action.action_type.id) {
				if (action.end_date) {
					newActionTypes[i].in_progress = null;
				} else {
					newActionTypes[i].in_progress = action;
				}
			}
		});
		setRows(newActionTypes);
	};

	const sortedRows = rows.sort((a, b) => {
		if (a.in_progress && b.in_progress) {
			return 0;
		}
		if (a.in_progress) {
			return -1;
		}
		if (b.in_progress) {
			return 1;
		}
		return 0;
	});

	const setInProgress = (actionTypeId, value) => {
		const newActionTypes = [...rows];
		const i = newActionTypes.findIndex((actionType) => (actionType.id === actionTypeId));
		newActionTypes[i].in_progress = value;
		setRows(newActionTypes);
	};

	return (
		<>
			<MetaTitle title="Add event" hideTitleText />

			<ul className="list" id="list">
				{sortedRows.map((actionType) => {
					const defaultRow = {
						action_type: {
							id: actionType.id,
							type: 'action_types',
						},
					};

					let className = 'list__item';
					if (actionType.in_progress) {
						className += ' list__item--active';
						if (actionType.in_progress.option) {
							defaultRow.option = {
								id: actionType.in_progress.option.id,
								type: actionType.in_progress.option.type,
							};
						}
					}

					const hasStopOnly = actionType.in_progress && actionType.options.length <= 0;
					return (
						<li className={className} key={actionType.id}>
							<Form
								afterSubmitFailure={(response) => {
									setInlineErrors({ ...inlineErrors, [actionType.id]: errorMessageText(response) });
								}}
								afterSubmitSuccess={afterSubmitSuccess}
								beforeSubmit={() => { setInlineErrors({ ...inlineErrors, [actionType.id]: false }); return true; }}
								clearOnSubmit={actionType.field_type !== 'button' || !actionType.is_continuous}
								defaultRow={defaultRow}
								filterBody={hasStopOnly ? filterBodyStop : filterBody}
								filterValues={filterValues}
								id={hasStopOnly ? actionType.in_progress.id.toString() : ''}
								method={hasStopOnly ? 'PUT' : 'POST'}
								params="include=action_type,option"
								path="actions"
								relationshipNames={['action_type', 'option']}
								row={actions[actionType.id]}
								showInlineErrors={false}
								setRow={(newRow) => {
									setActions({
										...actions,
										[newRow.action_type.id]: newRow,
									});
								}}
								successToastText={hasStopOnly ? 'Event stopped successfully.' : 'Event added successfully.'}
							>
								<div className="field">
									<NewLabel actionType={actionType} />
									<NewField
										actionType={actionType}
										inlineErrors={inlineErrors}
										setInlineErrors={setInlineErrors}
										setInProgress={setInProgress}
									/>
								</div>
								{inlineErrors[actionType.id] && <div className="formosa-field__error">{inlineErrors[actionType.id]}</div>}
							</Form>
							{actionType.in_progress ? (
								<Form
									afterSubmitFailure={(response) => {
										setInlineErrors({ ...inlineErrors, [actionType.id]: errorMessageText(response) });
									}}
									afterSubmitSuccess={afterSubmitSuccess}
									className="hide"
									filterBody={filterBodyStop}
									method="PUT"
									params="include=action_type"
									path="actions"
									id={actionType.in_progress.id.toString()}
									successToastText="Event stopped successfully."
								>
									<button type="submit">Stop</button>
								</Form>
							) : null}
						</li>
					);
				})}
			</ul>
		</>
	);
}
