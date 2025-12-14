import 'normalize.css/normalize.css';
import '@jlbelanger/formosa/dist/formosa.css';
import './css/style.css';
import { FormosaConfig } from '@jlbelanger/formosa';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import Routes from './js/Routes';

FormosaConfig.init({
	apiPrefix: import.meta.env.VITE_API_URL,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={Routes} />
	</React.StrictMode>
);
