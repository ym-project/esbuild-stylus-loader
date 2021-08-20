export interface PluginOptions {
	stylusOptions?: StylusOptions
}

export interface StylusOptions {
	import?: string[]
	include?: string[]
	define?: ([string, any, boolean?])[]
	use?: ((styl: any) => void)[]
	includeCss?: boolean
}
