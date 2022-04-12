const assert = require('assert');
const merge = require('../dist/deepmerge-json');

describe('basic merge', function () {
	it('should prefer pos values', function () {
		const pre = { a: 2 };
		const pos = { a: 1 };
		const res = merge(pre, pos);
		assert.strictEqual(res.a, pos.a);
	});

	it('should create new values', function () {
		const pre = {};
		const pos = { a: 2 };
		const res = merge(pre, pos);
		assert.strictEqual(res.a, pos.a);
	});

	it('should merge all basic types', function () {
		const pre = { boolValue: false, numberValue: 100, stringValue: 'pre' };
		const pos = { boolValue: true, numberValue: 222, stringValue: 'pos' };
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, pos);
	});

	it('should return a clone', function () {
		const pre = { boolValue: false, numberValue: 100, stringValue: 'pre' };
		const pos = { boolValue: true, numberValue: 222, stringValue: 'pos' };
		const res = merge(pre, pos);

		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should replace an empty pre parameter', function () {
		const pos = { foo: 20, bar: 'baz' };
		const res = merge(null, pos);
		assert.deepStrictEqual(res, pos);
		assert.notStrictEqual(res, pos);
	});

	it('should accept an empty pos parameter (clone)', function () {
		const pre = { foo: 20, bar: 'baz' };
		let res = merge(pre);
		assert.deepStrictEqual(res, pre);
		assert.notStrictEqual(res, pre);

		res = merge(pre, undefined);
		assert.deepStrictEqual(res, pre);
		assert.notStrictEqual(res, pre);
	});

	it('should accept an empty value for both parameters', function () {
		let res = merge(null, null);
		assert.strictEqual(res, null);

		res = merge(undefined, undefined);
		assert.strictEqual(res, undefined);

		res = merge(null, undefined);
		assert.strictEqual(res, null);

		res = merge(undefined, null);
		assert.strictEqual(res, null);
	});

	it('should accept a falsey value for pos parameter', function () {
		let res = merge(1, false);
		assert.strictEqual(res, false);

		res = merge(1, NaN);
		assert.strictEqual(res, NaN);

		res = merge(1, '');
		assert.strictEqual(res, '');

		res = merge(1, 0);
		assert.strictEqual(res, 0);
	});
});

describe('object merge', function () {
	it('should deeply copy objects', function () {
		const pre = { a: '@', b: { c: 1, d: { e: 2, f: { g: 3, h: { i: 4, l: '$' } } } } };
		const pos = { b: { c: 10, d: { e: 20, f: { g: 30, h: { i: 40, j: { k: 50 } } } } } };
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, {
			a: '@',
			b: { c: 10, d: { e: 20, f: { g: 30, h: { i: 40, j: { k: 50 }, l: '$' } } } }
		});
	});

	it('should deeply replace objects', function () {
		const pre = { a: { b: { c: 1 }, c: 1, d: 1 } };
		const pos = { a: { b: 10, c: { d: 20 } } };
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, { a: { b: 10, c: { d: 20 }, d: 1 } });
	});
});

describe('simple array merge', function () {
	it('should prefer pos values', function () {
		const pre = [1, 2, 3];
		const pos = [10, 20, 30];
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, [10, 20, 30]);
	});

	it('should increase array size', function () {
		const pre = [1, 2, 3];
		const pos = [10, 20, 30, 40, 50];
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, [10, 20, 30, 40, 50]);
	});

	it('should replace elements in order', function () {
		const pre = [1, 2, 3, 4, 5];
		const pos = [10, 20];
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, [10, 20, 3, 4, 5]);
	});

	it('should support a pre empty array', function () {
		const pre = [];
		const pos = [10, 20, 30, 40];
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, [10, 20, 30, 40]);
	});

	it('should support a pos empty array', function () {
		const pre = [1, 2, 3, 4];
		const pos = [];
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, [1, 2, 3, 4]);
	});

	it('should support empty arrays', function () {
		const pre = [];
		const pos = [];
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, []);
	});

	it('should skip empty values', function () {
		const pre = [1, 2, 3, 4];
		const pos = [10, , 30];
		const res = merge(pre, pos);
		assert.deepStrictEqual(res, [10, 2, 30, 4]);
	});

	it('should return a clone', function () {
		const pre = [0, 1, 2];
		const pos = [10, 20, 30];
		const res = merge(pre, pos);

		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});
});

describe('complex array merge', function () {
	it('should append when requested with $append', function () {
		const pre = [1, 2, 3];
		const pos = { $append: [10, 20, 30] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [1, 2, 3, 10, 20, 30]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should append when requested with $push', function () {
		const pre = [1, 2, 3];
		const pos = { $push: [10, 20, 30] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [1, 2, 3, 10, 20, 30]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should prepend when requested', function () {
		const pre = [1, 2, 3];
		const pos = { $prepend: [10, 20, 30] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [10, 20, 30, 1, 2, 3]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should replace when requested', function () {
		const pre = [1, 2, 3];
		const pos = { $set: [10, 20, 30] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [10, 20, 30]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should replace by a unparameterized object', function () {
		const pre = { a: [1, 2, 3] };
		const pos = { a: { b: [10, 20, 30] } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, pos);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});
});

describe('object array merge', function () {
	it('should merge arrays of objects', function () {
		const pre = [{ a: 1, b: { b1: 1, b2: 1 }, c: [1, 2], d: [{ d1: 1 }, { d1: 3 }] }];
		const pos = [{ a: 10, b: { b2: 2, b3: 3 }, c: [3, 4], d: [{ d2: 2 }, {}, { d1: 4 }] }];

		const res = merge(pre, pos);
		assert.deepStrictEqual(res, [
			{ a: 10, b: { b1: 1, b2: 2, b3: 3 }, c: [3, 4], d: [{ d1: 1, d2: 2 }, { d1: 3 }, { d1: 4 }] }
		]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should append arrays of objects when requested with $append', function () {
		const pre = [{ a: 1 }, { b: 2 }, { c: 3 }];
		const pos = { $append: [{ d: 10 }, { e: 20 }, { f: 30 }] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 10 }, { e: 20 }, { f: 30 }]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should append arrays of objects when requested with $push', function () {
		const pre = [{ a: 1 }, { b: 2 }, { c: 3 }];
		const pos = { $push: [{ d: 10 }, { e: 20 }, { f: 30 }] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 10 }, { e: 20 }, { f: 30 }]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should prepend arrays of objects when requested with $prepend', function () {
		const pre = [{ a: 1 }, { b: 2 }, { c: 3 }];
		const pos = { $prepend: [{ d: 10 }, { e: 20 }, { f: 30 }] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [{ d: 10 }, { e: 20 }, { f: 30 }, { a: 1 }, { b: 2 }, { c: 3 }]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should replace array objects', function () {
		const pre = [{ a: 1 }, { b: 2 }, { c: 3 }];
		const pos = { $set: [{ d: 10 }, { e: 20 }, { f: 30 }] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [{ d: 10 }, { e: 20 }, { f: 30 }]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should replace indexed elements when requested with $replace', function () {
		const pre = [{ a: 1 }, { b: 2 }, { c: 3, cc: { c1: 1, c2: 2 } }];
		const pos = { $replace: { 0: { a: 2 }, 2: { c: 2, cc: { c1: 2, c3: 2 } } } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [{ a: 2 }, { b: 2 }, { c: 2, cc: { c1: 2, c2: 2, c3: 2 } }]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should add indexed elements when requested with $replace', function () {
		const pre = [0, 1, 2];
		const pos = { $replace: { 3: 3, 5: 5 } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [0, 1, 2, 3, , 5]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should replace string indexed elements when requested with $replace', function () {
		const pre = [{ a: 1 }, { b: 2 }, { c: 3, cc: { c1: 1, c2: 2 } }];
		const pos = { $replace: { '0': { a: 2 }, '2': { c: 2, cc: { c1: 2, c3: 2 } } } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [{ a: 2 }, { b: 2 }, { c: 2, cc: { c1: 2, c2: 2, c3: 2 } }]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should add string indexed elements when requested with $replace', function () {
		const pre = [0, 1, 2];
		const pos = { $replace: { '3': 3, '5': 5 } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [0, 1, 2, 3, , 5]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should throw exception for invalid indexes on $replace', function () {
		const pre = [0, 1, 2];

		assert.throws(() => merge(pre, { $replace: { '-1': 0 } }),
			Error('Invalid index for $replace: -1'));

		assert.throws(() => merge(pre, { $replace: { 'foo': 0 } }),
			Error('Invalid index for $replace: foo'));

		assert.throws(() => merge(pre, { $replace: { undefined: 0 } }),
			Error('Invalid index for $replace: undefined'));

		assert.throws(() => merge(pre, { $replace: { null: 0 } }),
			Error('Invalid index for $replace: null'));

		assert.throws(() => merge(pre, { $replace: { true: 0 } }),
			Error('Invalid index for $replace: true'));
	});

	it('should insert elements at given indexes with $insert', function () {
		const pre = [1, 2];
		const pos = { $insert: { 0: 0, 3: 3, 5: 5, 10: 10 } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [0, 1, 2, 3, 5, 10]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should insert elements at given string indexes with $insert', function () {
		const pre = [1, 2];
		const pos = { $insert: { '0': 0, '3': 3, '5': 5, '10': 10 } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [0, 1, 2, 3, 5, 10]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should insert elements at negative indexed with $insert', function () {
		const pre = [1, 2, 5];
		const pos = { $insert: { '-1': 4, '-2': 3, '-10': 0 } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [0, 1, 2, 3, 4, 5]);
		assert.notStrictEqual(res, pre);
		assert.notStrictEqual(res, pos);
	});

	it('should throw exception for invalid indexes on $insert', function () {
		const pre = [0, 1, 2];

		assert.throws(() => merge(pre, { $insert: { 'foo': 0 } }),
			Error('Invalid index for $insert: foo'));

		assert.throws(() => merge(pre, { $insert: { undefined: 0 } }),
			Error('Invalid index for $insert: undefined'));

		assert.throws(() => merge(pre, { $insert: { null: 0 } }),
			Error('Invalid index for $insert: null'));

		assert.throws(() => merge(pre, { $insert: { true: 0 } }),
			Error('Invalid index for $insert: true'));
	});

	it('should merge with multiple operations', function () {
		const pre = [2, 3, 4];
		const pos = { $prepend: [0, 1], $append: [5, 6], $replace: { 0: 100 } };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [100, 1, 2, 3, 4, 5, 6]);
	});

	it('should consider the order for multiple operations', function () {
		const pre = [2, 3, 4];
		const pos = { $replace: { 0: 100 }, $prepend: [0, 1], $append: [5, 6] };
		const res = merge(pre, pos);

		assert.deepStrictEqual(res, [0, 1, 100, 3, 4, 5, 6]);
	});
});

describe('utils: clone', function () {
	it('should clone an object', function () {
		const obj = { a: true, b: { c: { d: [0, 1, 2] } } };
		const res = merge.clone(obj);

		assert.deepStrictEqual(res, obj);
		assert.notStrictEqual(res, obj);
	});

	it('should clone an array', function () {
		const obj = [0, 1, 2, { a: 3 }, { b: { c: 4 } }];
		const res = merge.clone(obj);

		assert.deepStrictEqual(res, obj);
		assert.notStrictEqual(res, obj);
	});

	it('should clone basic types', function () {
		let obj = 'foo bar';
		let res = merge.clone(obj);
		assert.deepStrictEqual(res, obj);

		obj = true;
		res = merge.clone(obj);
		assert.deepStrictEqual(res, obj);

		obj = 42;
		res = merge.clone(obj);
		assert.deepStrictEqual(res, obj);

		obj = null;
		res = merge.clone(obj);
		assert.deepStrictEqual(res, obj);
	});
});


describe('utils: merge multi', function () {
	it('should merge arrays respecting operations', function () {
		const obj1 = [0, 1, 2, 3, 4, 5];
		const obj2 = [, 10, 20];
		const obj3 = { $prepend: [-2, -1], $append: [6, 7] };
		const obj4 = { $insert: { 7: 70 } };

		const expected = [-2, -1, 0, 10, 20, 3, 4, 70, 5, 6, 7];
		const res = merge.multi(obj1, obj2, obj3, obj4);

		assert.deepStrictEqual(res, expected);
	});

	it('should merge multiple objects', function () {
		const obj1 = { a: 0, b: 1, c: 2, d: { e: true }, f: [0, 1, 2] };
		const obj2 = { a: 0, b: 10 };
		const obj3 = { f: { $append: [3] } };
		const obj4 = { g: true };

		const expected = { a: 0, b: 10, c: 2, d: { e: true }, f: [0, 1, 2, 3], g: true };
		const res = merge.multi(obj1, obj2, obj3, obj4);

		assert.deepStrictEqual(res, expected);
	});
});