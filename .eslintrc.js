module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		// 'plugin:vue/essential',
		'plugin:vue/recommended',
		'@vue/airbnb',
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'indent': [2, 'tab'],
		'no-tabs': 0,
		'no-mixed-spaces-and-tabs': 0,
		'vue/html-indent': [3, 'tab'],
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
};
