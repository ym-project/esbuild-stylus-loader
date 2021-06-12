import * as path from 'path'
import {promises as fs} from 'fs'
import {Plugin} from 'esbuild'
import stylusToCss from './stylus-to-css'

interface PluginOptions {
	url?: boolean
}

export function stylusLoader(pluginOptions: PluginOptions = {}): Plugin {
	return {
		name: 'stylus-loader',
		setup(build) {
			// intercept stylus files
			build.onResolve({filter: /\.(styl|stylus)$/}, args => {
				return {
					path: path.resolve(
						process.cwd(),
						path.relative(process.cwd(), args.resolveDir),
						args.path,
					),
					namespace: 'stylus',
				}
			})

			// intercept non-css and non-stylus files
			build.onResolve({filter: /.*/}, args => {
				if (args.namespace !== 'stylus') {
					return
				}

				if (pluginOptions.url === true) {
					return {
						path: path.resolve(
							process.cwd(),
							path.relative(process.cwd(), args.resolveDir),
							args.path,
						),
						namespace: 'static',
					}
				}

				return {
					external: true,
				}
			})

			build.onLoad({
				filter: /.*/,
				namespace: 'stylus',
			}, async args => {
				const content = await fs.readFile(args.path, 'utf8')
				const code = await stylusToCss(content, {
					filePath: args.path,
				})

				return {
					contents: code,
					loader: 'css',
					resolveDir: path.dirname(args.path),
				}
			})

			build.onLoad({
				filter: /.*/,
				namespace: 'static',
			}, async args => {
				const contents = await fs.readFile(args.path, 'utf8')

				if (/\.css$/.test(args.path)) {
					return {
						contents,
						loader: 'css',
					}
				}

				return {
					contents,
					loader: 'file',
				}
			})
		},
	}
}
