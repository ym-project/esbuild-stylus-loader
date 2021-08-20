# esbuild-stylus-loader

[Esbuild](https://esbuild.github.io/) plugin for [stylus](https://stylus-lang.com/) files.

## Installation
```sh
npm install esbuild-stylus-loader
```
or
```sh
yarn add esbuild-stylus-loader
```

## Example

`build.js`
```js
const {build} = require('esbuild')
const {stylusLoader} = require('esbuild-stylus-loader')

build({
    entryPoints: [
        'src/index.js',
    ],
    bundle: true,
    outdir: 'dist',
    plugins: [
        stylusLoader({
            stylusOptions: {
                define: [
                    ['BG_IMAGE', 'https://domain.com/image.jpeg'],
                ],
            },
        })
    ],
}).then(result => {})
```

`src/index.js`
```js
import './style.styl'
console.log('hello world')
```

`src/style.styl`
```styl
html
    background-image url(BG_IMAGE)
```

`command line`
```sh
node ./build.js
```

## Arguments

```js
stylusLoader({
    stylusOptions: {
        /**
         * @see https://stylus-lang.com/docs/js.html#includepath
         * @type {string[]}
         */
        include: ['./some/path'],

        /**
         * @see https://stylus-lang.com/docs/js.html#importpath
         * @type {string[]}
         */
        import: [
            path.resolve(__dirname, 'path'),
            path.resolve(__dirname, 'another-path'),
        ],

        /**
         * @see https://stylus-lang.com/docs/js.html#usefn
         * @type {Function[]}
         */
        use: [
            (stylus) => {
                stylus.define('URL', 'domain.com')
            },
        ],

        /**
         * @see https://stylus-lang.com/docs/js.html#definename-node
         * @type {[string, any, boolean?][]}
         */
        define: [
            ['BG_IMAGE', 'https://domain.com/image.jpeg'],
            /** The third argument allows to insert raw data */
            ['BG_IMAGE', 'https://domain.com/image.jpeg', true],
        ],

        /**
         * Stylus will include css file content via @import "./file.css" keyword.
         * @type {boolean}
         */
        includeCss: false,
    },
})
```
