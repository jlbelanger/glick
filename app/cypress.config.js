import { defineConfig } from 'cypress'; // eslint-disable-line import/no-extraneous-dependencies

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3000',
		experimentalRunAllSpecs: true,
	},
});
