export interface LoaderOptions {
	stylusOptions?: StylusOptions
}

/* eslint-disable @typescript-eslint/ban-types */
export interface StylusOptions {
	sourcemap?: 'inline'
	use?: Array<(stylusInstance: object) => void>
}

/* eslint-disable @typescript-eslint/ban-types */
export interface StylusToCss {
	code: string,
	sourcemap?: undefined | object
}
