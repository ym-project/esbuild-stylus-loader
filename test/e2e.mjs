/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import {build, context} from 'esbuild'
import test, {registerCompletionHandler} from 'ava'
import path from 'path'
import {watch} from 'fs'
import {mkdir, readFile, rm, writeFile, unlink} from 'fs/promises'
import {stylusLoader} from '../npm/esm.mjs'
import {fileURLToPath} from 'url'

registerCompletionHandler(() => {
	process.exit()
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function extractContentFromInlineSourcemap(str) {
	const sourcemap = Buffer.from(
		str.match(/\/\*# sourceMappingURL=data:application\/json;base64,(.*) \*\//)[1],
		'base64',
	).toString()
	
	return JSON.parse(sourcemap).sourcesContent[0]
}

function waitForChanges(path) {
	return new Promise((resolve) => {
		watch(path, () => {
			resolve()
		})
	})
}

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

test('Check stylus "@import" keyword with stylus file. Should insert imported file.', async t => {
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

test('Check "define" option.', async t => {
	const domain1 = 'https://domain.com'
	const domain2 = 'https://my-domain.com'
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/define/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				stylusOptions: {
					define: [
						['EXTERNAL_URL1', domain1],
						['EXTERNAL_URL2', domain2],
					],
				},
			}),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class1 {\n',
		`  background-image: url(${domain1});\n`,
		'}\n',
		'.class2 {\n',
		`  background-image: url(${domain2});\n`,
		'}',
	)))
})

test('Check "use" option.', async t => {
	const domain1 = 'https://domain.com'
	const domain2 = 'https://my-domain.com'
	const defineUrls = (stylus) => {
		stylus.define('EXTERNAL_URL1', domain1)
		stylus.define('EXTERNAL_URL2', domain2)
	}
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/use/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				stylusOptions: {
					use: [
						defineUrls,
					],
				},
			}),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class1 {\n',
		`  background-image: url(${domain1});\n`,
		'}\n',
		'.class2 {\n',
		`  background-image: url(${domain2});\n`,
		'}',
	)))
})

test('Check "includeCss" "true" option.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/import-css/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				stylusOptions: {
					includeCss: true,
				},
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

test('Check "includeCss" "false" option.', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/import-css/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader({
				stylusOptions: {
					includeCss: false,
				},
			}),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes('@import "./file.css";'))
})

test('Check css "inline" sourcemaps', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/sourcemaps/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		sourcemap: 'inline',
		plugins: [
			stylusLoader(),
		],
	})

	t.truthy(outputFiles[1].path.includes('entry.css'))
	t.truthy(outputFiles[1].text.includes('/*# sourceMappingURL=data:application/json;base64,'))
	t.is(extractContentFromInlineSourcemap(outputFiles[1].text), ''.concat(
		'.class1\n',
		'\tbackground-color transparent\n',
		'\ttransition background-color .5s\n',
		'\n',
		'\t&-active\n',
		'\t\tbackground-color #ff0000\n',
	))
})

test('Check css "external" sourcemaps', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/sourcemaps/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		sourcemap: 'external',
		plugins: [
			stylusLoader(),
		],
	})

	t.truthy(outputFiles[2].path.includes('entry.css.map'))
	t.truthy(outputFiles[3].path.includes('entry.css'))

	const sourcesContent = JSON.parse(outputFiles[2].text).sourcesContent[0]

	t.truthy(sourcesContent.includes(''.concat(
		'.class1\n',
		'\tbackground-color transparent\n',
		'\ttransition background-color .5s\n',
		'\n',
		'\t&-active\n',
		'\t\tbackground-color #ff0000\n',
	)))
})

test('Check css sourcemaps', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/sourcemaps/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		sourcemap: true,
		plugins: [
			stylusLoader(),
		],
	})

	t.truthy(outputFiles[2].path.includes('entry.css.map'))
	t.truthy(outputFiles[3].path.includes('entry.css'))
	t.truthy(outputFiles[3].text.includes('/*# sourceMappingURL=entry.css.map */'))
})

test('Check css "both" sourcemaps', async t => {
	const {outputFiles} = await build({
		entryPoints: [
			'./test/fixtures/sourcemaps/entry.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		sourcemap: 'both',
		plugins: [
			stylusLoader(),
		],
	})

	t.truthy(outputFiles[2].path.includes('entry.css.map'))
	t.truthy(outputFiles[3].path.includes('entry.css'))

	const sourcesContent = JSON.parse(outputFiles[2].text).sourcesContent[0]

	t.truthy(sourcesContent.includes(''.concat(
		'.class1\n',
		'\tbackground-color transparent\n',
		'\ttransition background-color .5s\n',
		'\n',
		'\t&-active\n',
		'\t\tbackground-color #ff0000\n',
	)))

	t.truthy(outputFiles[3].text.includes('/*# sourceMappingURL=data:application/json;base64,'))
	t.is(extractContentFromInlineSourcemap(outputFiles[3].text), ''.concat(
		'.class1\n',
		'\tbackground-color transparent\n',
		'\ttransition background-color .5s\n',
		'\n',
		'\t&-active\n',
		'\t\tbackground-color #ff0000\n',
	))
})

test('Check rebuild mode', async t => {
	// Create temporary file
	await writeFile('./test/temp.js', 'import \'./temp.styl\'')
	await writeFile('./test/temp.styl', ''.concat(
		'.class\n',
		'\tposition relative',
	))

	const ctx = await context({
		entryPoints: [
			'./test/temp.js',
		],
		bundle: true,
		outdir: '.',
		write: false,
		plugins: [
			stylusLoader(),
		],
	})

	let {outputFiles} = await ctx.rebuild()

	t.truthy(outputFiles[1].path.includes('temp.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class {\n',
		'  position: relative;\n',
		'}',
	)))


	// Update temporary file
	await writeFile('./test/temp.styl', ''.concat(
		'.class\n',
		'\tposition fixed',
	))

	let result = await ctx.rebuild()
	outputFiles = result.outputFiles

	t.truthy(outputFiles[1].path.includes('temp.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class {\n',
		'  position: fixed;\n',
		'}',
	)))

	// Update temporary file
	await writeFile('./test/temp.styl', ''.concat(
		'.class\n',
		'\tposition sticky',
	))

	result = await ctx.rebuild()
	outputFiles = result.outputFiles

	t.truthy(outputFiles[1].path.includes('temp.css'))
	t.truthy(outputFiles[1].text.includes(''.concat(
		'.class {\n',
		'  position: sticky;\n',
		'}',
	)))

	// Delete temporary files
	await unlink('./test/temp.js')
	await unlink('./test/temp.styl')
})

test('Check watch mode', async t => {
	// Create temporary directory
	await mkdir('./test/dist')

	// Create temporary file
	await writeFile('./test/temp.js', 'import \'./temp.styl\'')
	await writeFile('./test/temp.styl', ''.concat(
		'.class\n',
		'\tposition relative',
	))

	let ctx = await context({
		entryPoints: [
			'./test/temp.js',
		],
		bundle: true,
		outdir: './test/dist',
		write: true,
		plugins: [
			stylusLoader(),
		],
	})

	await ctx.watch()

	// Update temporary file
	await writeFile('./test/temp.styl', ''.concat(
		'.class\n',
		'\tposition fixed',
	))

	await waitForChanges('./test/dist')

	let content = await readFile('./test/dist/temp.css', 'utf-8')
	t.truthy(content.includes(''.concat(
		'.class {\n',
		'  position: fixed;\n',
		'}',
	)))

	await writeFile('./test/temp.styl', ''.concat(
		'.class\n',
		'\tposition sticky',
	))

	await waitForChanges('./test/dist')

	content = await readFile('./test/dist/temp.css', 'utf-8')
	t.truthy(content.includes(''.concat(
		'.class {\n',
		'  position: sticky;\n',
		'}',
	)))

	await ctx.dispose()

	// Delete temporary files
	await unlink('./test/temp.js')
	await unlink('./test/temp.styl')
	// Delete temporary directory
	await rm('./test/dist', {force: true, recursive: true})
})
