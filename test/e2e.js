/* eslint-disable @typescript-eslint/no-var-requires */
const {build} = require('esbuild')
const test = require('ava')
const path = require('path')
const stylusPlugin = require('../npm/cjs')

test('output files number should be 2', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/a.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		loader: {
			'.styl': 'file',
		},
		plugins: [
			stylusPlugin.default(),
		],
	})

	t.is(outputFiles.length, 2)
})

test('output files should have .css and .js extensions', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/a.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		loader: {
			'.styl': 'file',
		},
		plugins: [
			stylusPlugin.default(),
		],
	})

	t.is(path.extname(outputFiles[0].path), '.js')
	t.is(path.extname(outputFiles[1].path), '.css')
})