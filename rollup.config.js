const pkg = require(`./package.json`)

export default {
	input: 'index.js',
	output: {
		name: 'merge',
		file: pkg.main,
		format: 'umd',
		sourcemap: true
	}
}