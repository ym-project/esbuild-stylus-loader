module.exports = {
	hooks: {
		'pre-commit': 'npx lint-staged',
		'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
	},
}
