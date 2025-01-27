import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import laravel from "laravel-vite-plugin";
import path from "path";
import { defineConfig } from "vite";
import { ThemesJson } from "./resources/js/themes/ThemesJson";

export default defineConfig({
	plugins: [
		laravel({
			input: [
				'resources/css/app.css',
				'resources/js/app.js',
				'resources/js/themes/index.tsx',
				'resources/js/seller/index.tsx',
				'resources/js/frontend/index.tsx',
				'resources/js/site/index.tsx',
			],
			refresh: true,
		}),
		react({
			refresh: true,
			tsDecorators: true,
		}),
		{
			name: 'postbuild-commands',
			closeBundle: () => {
				fs.writeFileSync(
					'resources/js/themes/theme.json',
					JSON.stringify(ThemesJson, null, 2)
				);
			},
		},
	],
	resolve: {
		alias: [
			{
				find: '@frontend',
				replacement: path.resolve(__dirname, 'resources/js/frontend'),
			},
			{
				find: '@site',
				replacement: path.resolve(__dirname, 'resources/js/site'),
			},
			{
				find: '@seller',
				replacement: path.resolve(__dirname, 'resources/js/seller'),
			},
			{
				find: '@themes',
				replacement: path.resolve(__dirname, 'resources/js/themes'),
			},
			{
				find: '@type',
				replacement: path.resolve(__dirname, 'resources/js/types'),
			},
			{
				find: '@helper',
				replacement: path.resolve(__dirname, 'resources/js/helper'),
			},
		],
	},
});
