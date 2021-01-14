import stylus from 'stylus'
import {
	StylusToCssOptions,
	StylusToCss,
} from './types'

export default function stylusToCss(content: string, options: StylusToCssOptions): StylusToCss {
	return new Promise((resolve, reject) => {
		const {
			stylusOptions,
			filePath,
		} = options
		const styl = stylus(content)

		styl.set('filename', filePath)

		if (stylusOptions.sourcemap) {
			if (stylusOptions.sourcemap === 'inline') {
				styl.set('sourcemap', {inline: true})
			}
		}

		if (stylusOptions.use) {
			stylusOptions.use.forEach(usage => {
				styl.use(usage)
			})
		}

		if (stylusOptions.import) {
			stylusOptions.import.forEach(file => {
				styl.import(file)
			})
		}

		if (stylusOptions.include) {
			stylusOptions.include.forEach(include => {
				styl.include(include)
			})
		}

		if (stylusOptions.define) {
			stylusOptions.define.forEach(define => {
				styl.define(define[0], define[1])
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
