import stylus from 'stylus'

interface Options {
	filePath: string
}

export default function stylusToCss(content: string, options: Options): Promise<string> {
	return new Promise((resolve, reject) => {
		const styl = stylus(content)
		styl.set('filename', options.filePath)

		styl.render((err, css) => {
			if (err) {
				return reject(err)
			}

			resolve(css)
		})
	})
}
