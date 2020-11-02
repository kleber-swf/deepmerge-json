const pkg = require(`./package.json`)

export default {
	input: 'src/deepmerge-json.js',
	output: {
		name: 'merge',
		file: pkg.main,
		format: 'umd',
		sourcemap: true
	}
}