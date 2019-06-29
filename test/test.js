const assert = require('assert');
const merge = require('../index');

describe('merge', function () {
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
});