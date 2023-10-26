import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'

import { checker } from 'vite-plugin-checker'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'

import linaria from '@linaria/vite'
import { resolve } from 'path'

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
		server: {
			port: PORT || 3000,
			open: OPEN_BROWSER === 'true' ? true : false,
		},
		envPrefix,
		build: {
			outDir: 'build',
			lib: {
				// Could also be a dictionary or array of multiple entry points
				entry: resolve(__dirname, 'src/index.tsx'),
				name: 'test-linaria-library',
				// the proper extensions will be added
				fileName: 'index',
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
