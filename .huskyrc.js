module.exports = {
	hooks: {
		'pre-commit': 'npm run lint && npm run check-types',
		'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
	},
}
