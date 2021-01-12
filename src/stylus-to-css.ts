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

		styl.render((err, css) => {
			if (err) {
				return reject(err)
			}

			resolve(css)
		})
	})
}
