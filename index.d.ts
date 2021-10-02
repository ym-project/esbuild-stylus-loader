import {Plugin} from 'esbuild'

interface PluginOptions {
	stylusOptions?: StylusOptions
}

interface StylusOptions {
	import?: string[]
	include?: string[]
	define?: ([string, any, boolean?])[]
	use?: ((styl: any) => void)[]
	includeCss?: boolean
}

declare const stylusLoader: (options?: PluginOptions) => Plugin
export {stylusLoader}
