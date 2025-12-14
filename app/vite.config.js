import { defineConfig } from 'vite';
import postcssMixins from 'postcss-mixins';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
	build: {
		outDir: 'build',
	},
	css: {
		postcss: {
			plugins: [
				postcssMixins,
			],
		},
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
