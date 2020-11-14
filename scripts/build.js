/* eslint-disable @typescript-eslint/no-var-requires */
const {build} = require('esbuild')
const path = require('path')

const commonConfig = {
	entryPoints: [
		path.resolve(__dirname, '..', 'src', 'index.ts'),
	],
	bundle: true,
	minify: true,
	platform: 'node',
	loader: {
		'.ts': 'ts',
	},
	external: [
		'stylus',
		'path',
		'fs',
	],
}

function buildCjs() {
	build({
		...commonConfig,
		outfile: path.resolve(__dirname, '..', 'npm', 'cjs.js'),
		format: 'cjs',
	}).then(() => {
		console.log('CommonJS module was built')
	})
}

function buildEsm() {
	build({
		...commonConfig,
		outfile: path.resolve(__dirname, '..', 'npm', 'esm.mjs'),
		format: 'esm',
	}).then(() => {
		console.log('EcmaScript module was built')
	})
}

buildCjs()
buildEsm()
