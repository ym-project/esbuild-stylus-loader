/* eslint-disable @typescript-eslint/no-var-requires */
const {build} = require('esbuild')
const path = require('path')
const {dependencies} = require('../package.json')
const DIST_FOLDER = 'npm'

const commonConfig = {
	entryPoints: [
		path.resolve(__dirname, '..', 'src', 'index.ts'),
	],
	bundle: true,
	platform: 'node',
	target: 'node10',
	loader: {
		'.ts': 'ts',
	},
	external: Object.entries(dependencies).map(([name]) => name),
}

function buildCjs() {
	return build({
		...commonConfig,
		outfile: path.resolve(__dirname, '..', DIST_FOLDER, 'cjs.js'),
		format: 'cjs',
	})
}

function buildEsm() {
	return build({
		...commonConfig,
		outfile: path.resolve(__dirname, '..', DIST_FOLDER, 'esm.mjs'),
		format: 'esm',
	})
}

Promise.resolve()
	.then(() => buildCjs())
	.then(() => console.log('CommonJS module was built'))
	.then(() => buildEsm())
	.then(() => console.log('EcmaScript module was built'))
