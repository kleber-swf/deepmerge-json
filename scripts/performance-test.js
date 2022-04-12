/* A really, Really, REALLY simple performance test */
// TODO create a test with very deep objects

const merge = require('../dist/deepmerge-json');

const count = 100;
const samples = 10000;

const left = {};
new Array(1000).fill(null).forEach((_, i) => left[`k${i}`] = { t: 0 });

const right = {
	$prepend: [new Array(100).fill(null).forEach((_, i) => left[`j${i}`] = { t: 0 })],
	$append: [new Array(100).fill(null).forEach((_, i) => left[`l${i}`] = { t: 0 })]
}

let min = Number.MAX_VALUE, max = 0, total = 0;

for (let k = 0; k < count; k++) {
	let t = performance.now();

	for (let i = 0; i < samples; i++) {
		merge(left, right);
	}

	t = performance.now() - t;
	min = Math.min(min, t);
	max = Math.max(max, t);
	total += t;
}

console.table({ min, max, average: (total - max - min) / (count - 2) })
