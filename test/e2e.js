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

// eslint-disable-next-line max-len
test('Check stylus "@import" keyword with css file with "url" option. Should insert imported file to bundled css file.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/import-css/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				url: true,
			}),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class {\n',
		'  width: 100%;\n',
		'}',
	)))
})

test('Check "@font-face" url keyword with "url" option. Font file should be generated.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/font-face-src/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				url: true,
			}),
		],
	})

	const fontFileName = path.basename(outputFiles[1].path)

	t.truthy(outputFiles[1].path.includes(fontFileName))
	t.truthy(outputFiles[2].path.includes('entry.css'))
	t.truthy(outputFiles[2].text.includes(''.concat(
		'@font-face {\n',
		'  font-family: "Source-Sans-Pro";\n',
		'  font-weight: 400;\n',
		`  src: url(./${fontFileName}) format("truetype");\n`,
		'}',
	)))
})

test('Check "@font-face" url keyword. Should be without changes.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/font-face-src/entry.js',
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
		'@font-face {\n',
		'  font-family: "Source-Sans-Pro";\n',
		'  font-weight: 400;\n',
		'  src: url(./regular.ttf) format("truetype");\n',
		'}',
	)))
})
