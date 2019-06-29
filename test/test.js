const assert = require('assert');
const merge = require('../index');

describe('basic merge', function () {
	it('should prefer source values', function () {
		const tgt = { a: 2 };
		const src = { a: 1 };
		const res = merge(tgt, src);
		assert.equal(res.a, src.a)
	});

	it('should create new values', function () {
		const tgt = {};
		const src = { a: 2 };
		const res = merge(tgt, src);
		assert.equal(res.a, src.a)
	});

	it('should merge all basic types', function () {
		const tgt = { boolValue: false, numberValue: 100, stringValue: 'target' };
		const src = { boolValue: true, numberValue: 222, stringValue: 'source' };
		const res = merge(tgt, src);
		assert.deepEqual(res, src);
	});

	it('should return a clone', function () {
		const tgt = { boolValue: false, numberValue: 100, stringValue: 'target' };
		const src = { boolValue: true, numberValue: 222, stringValue: 'source' };
		const res = merge(tgt, src);
		assert.notEqual(res, src);
	});

	// TODO merge arrays
	// TODO merge with null values
	// TODO null target
	// TODO null source
});


describe('object merge', function () {
	it('should deeply objects', function () {
		const tgt = { a: { b: 1, c: { d: 2, e: { f: 3, g: { h: 4 } } } } };
		const src = { a: { b: 10, c: { d: 20, e: { f: 30, g: { h: 40, i: { j: 50 } } } } } };
		const res = merge(tgt, src);
		assert.deepEqual(res, src);
	});

	it('should deeply objects', function () {
		const tgt = {
			a: {
				b: { c: 2 }
			}
		};
		const src = {
			a: {
				b: 10,
				c: { d: 20 }
			}
		};
		const res = merge(tgt, src);
		assert.deepEqual(res, { a: { b: 10, c: { d: 10 } } });
	});
});