module.exports = {
	hooks: {
		'pre-commit': 'npm run lint && npm run check-types',
	},
}
