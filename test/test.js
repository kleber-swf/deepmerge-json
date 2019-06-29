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

	// TODO merge with null values
	// TODO null target
	// TODO null source
});


describe('object merge', function () {
	it('should deeply copy objects', function () {
		const tgt = { a: '@', b: { c: 1, d: { e: 2, f: { g: 3, h: { i: 4, l: '$' } } } } };
		const src = { b: { c: 10, d: { e: 20, f: { g: 30, h: { i: 40, j: { k: 50 } } } } } };
		const res = merge(tgt, src);
		assert.deepEqual(res, {
			a: '@', b: { c: 10, d: { e: 20, f: { g: 30, h: { i: 40, j: { k: 50 }, l: '$' } } } }
		});
	});
	
	it('should deeply replace objects', function () {
		const tgt = { a: { b: { c: 1 }, c: 1, d: 1 } };
		const src = { a: { b: 10, c: { d: 20 } } };
		const res = merge(tgt, src);
		assert.deepEqual(res, { a: { b: 10, c: { d: 20 }, d: 1 } });
	});
});

// TODO merge arrays