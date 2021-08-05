import { terser } from 'rollup-plugin-terser';
const pkg = require(`./package.json`);

export default {
	input: 'src/deepmerge-json.js',
	output: [
		{
			name: 'merge',
			file: pkg.main,
			format: 'umd',
			sourcemap: true
		},
		{
			name: 'merge',
			file: pkg.min,
			format: 'umd',
			plugins: [terser()],
			sourcemap: true
		}
	]
}