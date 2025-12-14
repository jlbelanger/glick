import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
	build: {
		outDir: 'build',
	},
	plugins: [
		react(),
		svgr(),
	],
	server: {
		open: true,
		port: 3000,
	},
}));
