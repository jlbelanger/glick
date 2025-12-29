import 'normalize.css/normalize.css';
import '@jlbelanger/formosa/dist/formosa.css';
import './css/style.css';
import { createRoot } from 'react-dom/client';
import { FormosaConfig } from '@jlbelanger/formosa';
import { RouterProvider } from 'react-router';
import Routes from './js/Routes.jsx';
import { StrictMode } from 'react';

FormosaConfig.init({
	apiPrefix: import.meta.env.VITE_API_URL,
});

const root = createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<RouterProvider router={Routes} />
	</StrictMode>
);
