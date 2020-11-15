import stylus from 'stylus'
import {
	StylusOptions,
	StylusToCss,
} from './types'

interface StylusToCssOptions {
	stylusOptions: StylusOptions
	filePath: string
}

export default function stylusToCss(content: string, options: StylusToCssOptions): Promise<StylusToCss> {
	return new Promise((resolve, reject) => {
		const {
			stylusOptions,
			filePath,
		} = options
		const styl = stylus(content)

		styl.set('filename', filePath)

		if (stylusOptions.sourcemap) {
			if (stylusOptions.sourcemap === 'inline') {
				styl.set('sourcemap', {
					inline: true,
				})
			}
		}

		if (stylusOptions.use) {
			stylusOptions.use.forEach(use => {
				styl.use(use)
			})
		}

		styl.render((err, css) => {
			if (err) {
				return reject(err)
			}

			/*
			styl.sourcemap needs only for external sourcemaps
			inline sourcemaps are included to code already
			*/

			// @ts-ignore
			const externalSourcemapCode = styl.sourcemap

			resolve({
				code: css,
				sourcemap: externalSourcemapCode,
			})
		})
	})
}
