/* eslint-disable @typescript-eslint/no-var-requires */
const {build} = require('esbuild')
const test = require('ava')
const path = require('path')
const {stylusLoader} = require('../npm/cjs')

test('Check stylus "@require" keyword. Should insert required file to bundled css file.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/require/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader(),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class {\n',
		'  position: relative;\n',
		'}',
	)))
})

test('Check stylus "@import" keyword with css file. Should be without changes.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/import-css/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader(),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes('@import "./file.css";'))
})

test('Check stylus "@import" keyword with stylus file. Should insert required file.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/import-stylus/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader(),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class {\n',
		'  width: auto;\n',
		'}',
	)))
})

test('Check "import" option. Should include imported files to bundle css file.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/import/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				stylusOptions: {
					import: [
						path.resolve(__dirname, 'fixtures', 'import', 'imported-file1.styl'),
						path.resolve(__dirname, 'fixtures', 'import', 'imported-file2.styl'),
					],
				},
			}),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class1 {\n',
		'  position: absolute;\n',
		'}\n',
		'.class2 {\n',
		'  position: fixed;\n',
		'}',
	)))
})

test('Check "include" option. Nested imported file should be included to bundle file.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/include/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				stylusOptions: {
					include: [
						path.resolve(__dirname, 'fixtures', 'include', 'sub'),
					],
				},
			}),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class2 {\n',
		'  width: 25%;\n',
		'}\n',
		'.class1 {\n',
		'  width: 50%;\n',
		'}',
	)))
})
