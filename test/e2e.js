/* eslint-disable @typescript-eslint/no-var-requires */
const {build} = require('esbuild')
const test = require('ava')
const path = require('path')
const {stylusLoader} = require('../npm/cjs')

test('output files number should be 2', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/a.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader(),
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
		plugins: [
			stylusLoader(),
		],
	})

	t.is(path.extname(outputFiles[0].path), '.js')
	t.is(path.extname(outputFiles[1].path), '.css')
})

test('test stylus use option', async t => {
	const color = '#fff'
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/b.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				stylusOptions: {
					use: [
						stylus => {
							stylus.define('$myColor', color)
						},
					],
				},
			}),
		],
	})

	const hasDefinedColor = outputFiles[1].text.includes(color)
	t.true(hasDefinedColor)
})
