import * as path from 'path'
import {promises as fs} from 'fs'
import {Plugin} from 'esbuild'
import {LoaderOptions} from './types'
import stylusToCss from './stylus-to-css'

export function stylusLoader(options: LoaderOptions = {}): Plugin {
	return {
		name: 'stylus-loader',
		setup(build) {
			build.onResolve({filter: /\.styl$/}, args => ({
				path: path.resolve(
					process.cwd(),
					path.relative(process.cwd(), args.resolveDir),
					args.path
				),
				namespace: 'stylus',
			}))

			build.onLoad({
				filter: /.*/,
				namespace: 'stylus',
			}, async args => {
				const stylusContent = await fs.readFile(args.path, 'utf-8')
				const cssContent = await stylusToCss(stylusContent, options.stylusOptions)

				return {
					contents: cssContent,
					loader: 'css',
				}
			})
		},
	}
}
