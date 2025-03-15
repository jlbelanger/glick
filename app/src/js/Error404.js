import { Alert } from '@jlbelanger/formosa';
import MetaTitle from './Components/MetaTitle';
import React from 'react';

export default function Error404() {
	return (
		<>
			<MetaTitle title="404 Not Found" />
			<Alert type="error">The requested URL was not found on this server.</Alert>
		</>
	);
}
