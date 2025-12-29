import { Form, FormosaContext } from '@jlbelanger/formosa';
import MyFormPrompt from './MyFormPrompt.jsx';
import PropTypes from 'prop-types';
import { useContext } from 'react';

export default function MyForm({ children, ...otherProps }) {
	const { showWarningPrompt } = useContext(FormosaContext);

	return (
		<Form {...otherProps}>
			{children}
			{showWarningPrompt && <MyFormPrompt />}
		</Form>
	);
}

MyForm.propTypes = {
	children: PropTypes.node.isRequired,
};
