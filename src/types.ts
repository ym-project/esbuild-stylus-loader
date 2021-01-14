export interface LoaderOptions {
	sourcemap?: 'inline'
	use?: ((arg: any) => any)[]
	import?: string[]
	include?: string[]
}

export interface StylusToCssOptions {
	stylusOptions: LoaderOptions
	filePath: string
}

export type StylusToCss = Promise<string>
