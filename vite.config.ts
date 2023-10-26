import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'

import { checker } from 'vite-plugin-checker'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

import linaria from '@linaria/vite'
import { resolve } from 'path'

export const relativeAlias: Record<string, string> = {
	Components: './src/Components',
	Contexts: './src/Contexts',
	Utils: './src/Utils',
	Hooks: './src/Hooks',
	Constants: './src/Constants',
	Api: './src/Api',
	Pages: './src/Pages',
}

export const resolveAlias = Object.entries(relativeAlias).reduce(
	(prev: Record<string, string>, [key, path]) => {
		// eslint-disable-next-line security/detect-object-injection
		prev[key] = resolve(__dirname, path)

		return prev
	},
	{},
)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const envPrefix: string[] = ['APP_']

	const { PORT = 3000, OPEN_BROWSER = 'true' } = {
		...loadEnv(mode, process.cwd(), ''),
	}

	return {
		plugins: [
			react(),
			svgr(),
			mode === 'development'
				? checker({
						typescript: true,
						eslint: {
							lintCommand: 'lint:check',
						},
				  }) // eslint-disable-line no-mixed-spaces-and-tabs
				: null,
			linaria({
				include: ['**/*.{ts,tsx}'],
				babelOptions: {
					presets: [
						'@babel/preset-typescript',
						'@babel/preset-react',
					],
				},
			}),
			dts(),
		],
		resolve: {
			alias: resolveAlias,
		},
		server: {
			port: PORT || 3000,
			open: OPEN_BROWSER === 'true' ? true : false,
		},
		envPrefix,
		build: {
			outDir: 'build',
			lib: {
				// Could also be a dictionary or array of multiple entry points
				entry: resolve(__dirname, 'src/App.tsx'),
				name: 'test-linaria-library',
				// the proper extensions will be added
				fileName: 'test-linaria-library',
			},
			rollupOptions: {
				external: [
					'@linaria/core',
					'@linaria/react',
					'react',
					'react-dom',
				],
			},
		},
	}
})
