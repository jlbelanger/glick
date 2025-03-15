import { Form, FormosaContext } from '@jlbelanger/formosa';
import React, { useContext } from 'react';
import MyFormPrompt from './MyFormPrompt';
import PropTypes from 'prop-types';

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
