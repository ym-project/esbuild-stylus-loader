export interface LoaderOptions {
	stylusOptions?: StylusOptions
}

export interface StylusOptions {
	sourcemap?: 'inline'
}

/* eslint-disable @typescript-eslint/ban-types */
export interface StylusToCss {
	code: string,
	sourcemap?: undefined | object
}
