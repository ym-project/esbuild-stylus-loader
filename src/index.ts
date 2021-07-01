import * as path from 'path'
import {promises as fs} from 'fs'
import {Plugin} from 'esbuild'
import stylusToCss from './stylus-to-css'
import {PluginOptions} from './types'

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

			// intercept non-stylus files
			build.onResolve({filter: /.*/}, args => {
				if (args.namespace !== 'stylus') {
					return
				}

				return {
					external: true,
				}
			})

			// handle stylus files
			build.onLoad({
				filter: /.*/,
				namespace: 'stylus',
			}, async args => {
				const content = await fs.readFile(args.path, 'utf8')
				const code = await stylusToCss(content, {
					...pluginOptions.stylusOptions,
					filePath: args.path,
				})

				return {
					contents: code,
					loader: 'css',
					resolveDir: path.dirname(args.path),
				}
			})
		},
	}
}
