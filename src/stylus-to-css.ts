import stylus from 'stylus'

export default function stylusToCss(content: string): Promise<string> {
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
