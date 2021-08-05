export interface PluginOptions {
	stylusOptions?: StylusOptions
}

export interface StylusOptions {
	import?: string[]
	include?: string[]
	define?: ([string, any])[]
}
