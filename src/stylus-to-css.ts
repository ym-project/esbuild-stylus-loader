import stylus from 'stylus'
import {StylusOptions} from './types'

export default function stylusToCss(content: string, options: StylusOptions = {}): Promise<string> {
	return new Promise((resolve, reject) => {
		const styl = stylus(content)

		styl.render((err, css) => {
			if (err) {
				return reject(err)
			}

			resolve(css)
		})
	})
}
