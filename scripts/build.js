/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const {build} = require('esbuild')
const path = require('path')
const {
	dependencies,
	peerDependencies,
} = require('../package.json')
const DIST_FOLDER = 'npm'

let external = []

if (dependencies) {
	Object.entries(dependencies)
		.forEach(([name]) => external.push(name))
}

if (peerDependencies) {
	Object.entries(peerDependencies)
		.forEach(([name]) => external.push(name))
}

external = external.filter((value, index, self) => self.indexOf(value) === index)

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
	external,
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
