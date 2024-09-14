/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const DIST_FOLDER = 'npm'

fs.promises
	.rm(path.resolve(__dirname, '..', DIST_FOLDER), {
		force: true,
		recursive: true,
	})
	.then(() => console.log(`folder "${DIST_FOLDER}" was removed`))
