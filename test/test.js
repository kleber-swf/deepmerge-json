const assert = require('assert');
const merge = require('../index');

describe('basic merge', function () {
	it('should prefer source values', function () {
		const tgt = { a: 2 };
		const src = { a: 1 };
		const res = merge(tgt, src);
		assert.strictEqual(res.a, src.a)
	});

	it('should create new values', function () {
		const tgt = {};
		const src = { a: 2 };
		const res = merge(tgt, src);
		assert.strictEqual(res.a, src.a)
	});

	it('should merge all basic types', function () {
		const tgt = { boolValue: false, numberValue: 100, stringValue: 'target' };
		const src = { boolValue: true, numberValue: 222, stringValue: 'source' };
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, src);
	});

	it('should return a clone', function () {
		const tgt = { boolValue: false, numberValue: 100, stringValue: 'target' };
		const src = { boolValue: true, numberValue: 222, stringValue: 'source' };
		const res = merge(tgt, src);

		assert.notStrictEqual(res, tgt);
		assert.notStrictEqual(res, src);
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
		assert.deepStrictEqual(res, {
			a: '@', b: { c: 10, d: { e: 20, f: { g: 30, h: { i: 40, j: { k: 50 }, l: '$' } } } }
		});
	});

	it('should deeply replace objects', function () {
		const tgt = { a: { b: { c: 1 }, c: 1, d: 1 } };
		const src = { a: { b: 10, c: { d: 20 } } };
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, { a: { b: 10, c: { d: 20 }, d: 1 } });
	});
});


describe('simple array merge', function () {
	it('should prefer source values', function () {
		const tgt = [1, 2, 3];
		const src = [10, 20, 30];
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, [10, 20, 30]);
	});

	it('should increase array size', function () {
		const tgt = [1, 2, 3];
		const src = [10, 20, 30, 40, 50];
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, [10, 20, 30, 40, 50]);
	});

	it('should replace elements in order', function () {
		const tgt = [1, 2, 3, 4, 5];
		const src = [10, 20];
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, [10, 20, 3, 4, 5]);
	});

	it('should support a target empty array', function () {
		const tgt = [];
		const src = [10, 20, 30, 40];
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, [10, 20, 30, 40]);
	});

	it('should support a source empty array', function () {
		const tgt = [1, 2, 3, 4];
		const src = [];
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, [1, 2, 3, 4]);
	});

	it('should support empty arrays', function () {
		const tgt = [];
		const src = [];
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, []);
	});

	it('should skip empty values', function () {
		const tgt = [1, 2, 3, 4];
		const src = [10, , 30];
		const res = merge(tgt, src);
		assert.deepStrictEqual(res, [10, 2, 30, 4]);
	});

	it('should return a clone', function () {
		const tgt = [0, 1, 2];
		const src = [10, 20, 30];
		const res = merge(tgt, src);

		assert.notStrictEqual(res, tgt);
		assert.notStrictEqual(res, src);
	});
});


describe('complex array merge', function () {
	it('should append when requested', function () {
		const tgt = [1, 2, 3];
		const src = { $append: [10, 20, 30] };
		const res = merge(tgt, src);

		assert.deepStrictEqual(res, [1, 2, 3, 10, 20, 30]);
		assert.notEqual(res, tgt);
		assert.notEqual(res, src);
	});

	it('should prepend when requested', function () {
		const tgt = [1, 2, 3];
		const src = { $prepend: [10, 20, 30] };
		const res = merge(tgt, src);

		assert.deepStrictEqual(res, [10, 20, 30, 1, 2, 3]);
		assert.notEqual(res, tgt);
		assert.notEqual(res, src);
	});

	it('should replace when requested', function () {
		const tgt = [1, 2, 3];
		const src = { $set: [10, 20, 30] };
		const res = merge(tgt, src);

		assert.deepStrictEqual(res, [10, 20, 30]);
		assert.notEqual(res, tgt);
		assert.notEqual(res, src);
	});

	it('should replace by a unparameterized object', function () {
		const tgt = { a: [1, 2, 3] };
		const src = { a: { b: [10, 20, 30] } };
		const res = merge(tgt, src);

		assert.deepStrictEqual(res, res);
		assert.notEqual(res, tgt);
		assert.notEqual(res, src);
	});
});