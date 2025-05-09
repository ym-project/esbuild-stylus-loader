import stylus from 'stylus'
import {StylusOptions} from './types'

interface Options extends StylusOptions {
	filePath: string
	sourcemap: boolean
}

interface Result {
	/** compiled css */
	code: string
	/** dependency list */
	dependencyList: Set<string>
}

export default function stylusToCss(content: string, options: Options): Promise<Result> {
	return new Promise((resolve, reject) => {
		const dependencyList = new Set<string>()
		const styl = stylus(content)
		styl.set('filename', options.filePath)

		if (Array.isArray(options.import)) {
			options.import.forEach(it => {
				styl.import(it)
				// Add dependencies from  javascript api
				dependencyList.add(it)
			})
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

		if (options.includeCss) {
			styl.set('include css', true)
		}

		if (options.sourcemap) {
			styl.set('sourcemap', {
				comment: true,
				inline: true,
			})
		}

		// Add dependencies from `@import` statements
		for (const dependency of styl.deps()) {
			dependencyList.add(dependency)
		}

		styl.render((err, css) => {
			if (err) {
				return reject(err)
			}

			resolve({
				code: css,
				dependencyList,
			})
		})
	})
}
