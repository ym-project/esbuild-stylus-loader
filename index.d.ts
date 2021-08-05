import {Plugin} from 'esbuild'

interface PluginOptions {
	stylusOptions?: StylusOptions
}

interface StylusOptions {
	import?: string[]
	include?: string[]
	define?: ([string, any])[]
	use?: ((styl: any) => void)[]
}

declare const stylusLoader: (options: PluginOptions) => Plugin
export {stylusLoader}
