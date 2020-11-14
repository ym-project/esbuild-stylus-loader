# esbuild-stylus-loader
esbuild plugin for stylus files

```
⚠️ Because of esbuild plugin API is experimental yet, don't use it in production.
When plugin API will be in stable stage this package will be have a major release. ⚠️
```

## Install
```
npm install esbuild-stylus-loader
```

## Example

`esbuild-config.js`
```js
const {build} = require('esbuild')
const stylusLoader = require('esbuild-stylus-loader')

build({
    entryPoints: [
        'src/index.js',
    ],
    bundle: true,
    outdir: 'dist',
    plugins: [
        stylusLoader.default()
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
*
    margin 0
    padding 0
```

`command line`
```sh
node ./esbuild-config.js
```
