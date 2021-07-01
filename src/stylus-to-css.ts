import stylus from 'stylus'
import {StylusOptions} from './types'

interface Options extends StylusOptions {
	filePath: string
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

		styl.render((err, css) => {
			if (err) {
				return reject(err)
			}

			resolve(css)
		})
	})
}
