/* eslint-disable @typescript-eslint/ban-types */
export interface LoaderOptions {
	sourcemap?: 'inline'
	use?: ((arg: any) => any)[]
	import?: string[]
	include?: string[]
	define?: [string, string | number | number[] | string[] | boolean | object | ((...args: any[]) => any)]
}

export interface StylusToCssOptions {
	stylusOptions: LoaderOptions
	filePath: string
}

export type StylusToCss = Promise<string>
