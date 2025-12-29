import { FormContext } from '@jlbelanger/formosa';
import { unstable_usePrompt } from 'react-router'; // eslint-disable-line camelcase
import { useContext } from 'react';

export default function MyFormPrompt() {
	const { getDirtyKeys } = useContext(FormContext);

	unstable_usePrompt({
		message: 'You have unsaved changes. Are you sure you want to leave this page?',
		when: () => (getDirtyKeys().length > 0),
	});

	return null;
}
