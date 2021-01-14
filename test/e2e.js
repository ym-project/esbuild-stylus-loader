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
				use: [
					stylus => {
						stylus.define('$myColor', color)
					},
				],
			}),
		],
	})

	const hasDefinedColor = outputFiles[1].text.includes(color)
	t.true(hasDefinedColor)
})

test('test stylus sourcemap option', t => {
	/*
	Esbuild doesn't support css sourcemaps.
	So this feature should be ignored for some time.
	*/
	t.pass()
})

test('test stylus import option', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/b.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				import: [
					'/a',
				],
			}),
		],
	})

	const hasImportedFileContent = outputFiles[1].text.includes(''.concat(
		'* {\n',
		'  margin: 0;\n',
		'  padding: 0;\n',
		'}'
	))
	t.true(hasImportedFileContent)
})

test('test stylus define option', async t => {
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
				define: [
					[
						'$myColor',
						color,
					],
				],
			}),
		],
	})

	const hasDefinedColor = outputFiles[1].text.includes(color)
	t.true(hasDefinedColor)
})
