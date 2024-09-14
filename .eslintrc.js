/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:ava/recommended',
	],
	plugins: [
		'@typescript-eslint',
		'ava',
	],
	env: {
		node: true,
		es2021: true,
	},
	rules: {
		// allow @ts-ignore comment
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',

		// ignore rule because of @typescript-eslint/no-unused-vars
		'no-unused-vars': 'off',

		// disallow __proto__
		'no-proto': 'error',
		// disallow return await
		'no-return-await': 'error',
		// disallow eval
		'no-eval': 'error',
		// max line length
		'max-len': [
			'error',
			{
				code: 120,
			},
		],
		// require empty line in the end of file
		'eol-last': 'error',
		// allow single quotes and backticks with ${}
		'quotes': [
			'error',
			'single',
			{
				avoidEscape: true,
			},
		],
		// disallow ;
		'semi': [
			'error',
			'never',
		],
		// require trailing comma only when entity has multiline format
		'comma-dangle': [
			'error',
			'always-multiline',
		],
		// disallow func( 'arg' ), only func('arg')
		'space-in-parens': [
			'error',
			'never',
		],
		// disallow if, for, ... without brackets
		'curly': 'error',
		// disallow empty block like if (...) {}. Allow only empty catch {}
		'no-empty': [
			'error',
			{
				allowEmptyCatch: true,
			},
		],
		// allow tabs
		'indent': [
			'error',
			'tab',
			{SwitchCase: 1},
		],
		// disallow spaces between import {a} from ''
		// const {a} = obj and others
		'object-curly-spacing': [
			'error',
			'never',
		],
		// disallow var keyword
		'no-var': 'error',
		// allow only strict equality "==="
		'eqeqeq': [
			'error',
			'always',
		],
		// allow only camelCase names
		camelcase: 'error',
	},
}
