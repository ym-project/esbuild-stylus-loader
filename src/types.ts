export interface LoaderOptions {
	sourcemap?: 'inline'
	use?: ((arg: any) => any)[]
}

export interface StylusToCssOptions {
	stylusOptions: LoaderOptions
	filePath: string
}

export type StylusToCss = Promise<string>
