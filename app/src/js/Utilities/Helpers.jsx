import Auth from './Auth';

export const errorMessageText = (response, logout = true) => {
	if (logout && response.status === 401) {
		return Auth.logout(response.status);
	}
	return `Error: ${response.errors.map((e) => (e.title)).join(' ')}`;
};

export const afterSubmitFailure = (error) => {
	if (error.status === 401) {
		Auth.logout(error.status);
	}
};

export const getEventLabel = (event) => { // eslint-disable-line import/prefer-default-export
	let label = event.action_type.label;
	if (event.value) {
		let value = event.value;
		if (event.action_type.suffix) {
			value += ` ${event.action_type.suffix}`;
		}
		label += ` (${value})`;
	} else if (event.option) {
		label += ` (${event.option.label})`;
	}
	return label;
};
