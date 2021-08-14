import stylus from 'stylus'
import {StylusOptions} from './types'

interface Options extends StylusOptions {
	filePath: string
	sourcemap: boolean
}

export default function stylusToCss(content: string, options: Options): Promise<string> {
	return new Promise((resolve, reject) => {
		const styl = stylus(content)
		styl.set('filename', options.filePath)

		if (Array.isArray(options.import)) {
			options.import.forEach(it => styl.import(it))
		}

		if (Array.isArray(options.include)) {
			options.include.forEach(it => styl.include(it))
		}

		if (Array.isArray(options.define)) {
			options.define.forEach(it => {
				if (!Array.isArray(it) || (typeof it[0] !== 'string') || (it[1] === undefined)) {
					return
				}

				styl.define(it[0], it[1], it[2] || false)
			})
		}

		if (Array.isArray(options.use)) {
			options.use.forEach(it => styl.use(it))
		}

		if (options.sourcemap) {
			styl.set('sourcemap', {
				comment: true,
				inline: true,
			})
		}

		styl.render((err, css) => {
			if (err) {
				return reject(err)
			}

			resolve(css)
		})
	})
}
