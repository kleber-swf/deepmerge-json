const _replace = function (_, pos) { return pos; }
const _cloneReplace = function (_, pos) { return Object.assign({}, pos); }

const _mergeObjects = function (pre, pos) {
	pre = Object.assign({}, pre);
	Object.keys(pos).forEach(k => {
		pre[k] = merge(pre[k], pos[k]);
	});
	return pre;
}

const fn = {
	oo: _mergeObjects,
	oa: _cloneReplace,
	ob: _replace,

	aa: _mergeObjects,
	ao: null,
	ab: _replace,

	bb: _replace,
	bo: _cloneReplace,
	ba: _cloneReplace
}



const getMergeType = function (pre, pos) {
	const et = Array.isArray(pre) ? 'a' : (typeof pre === 'object' ? 'o' : 'b');
	const ot = Array.isArray(pos) ? 'a' : (typeof pos === 'object' ? 'o' : 'b');
	return et + ot;
}

const _merge = function (pre, pos) {
	return fn[getMergeType(pre, pos)](pre, pos);
}


const merge = function (target, source) {
	return _merge(target, source);
}


module.exports = merge;

// const mergeObject = function (target, source) {
// 	Object.keys(source).forEach(key => {
// 		target[key] = _merge(key, target, source)
// 	});
// 	return target;
// }

// const mergeArray = function (target, source) {
// 	if (Array.isArray(source)) {
// 		source.forEach((_, i) => {
// 			target[i] = _merge(i, target, source)
// 		});
// 		return target;
// 	}
// 	if (typeof source === 'object') {
// 		return _mergeArrayWithParams(target, source);
// 	}
// 	return source;
// }

// const _merge = function (key, target, source) {
// 	if (key in target) {
// 		const targetValue = target[key];
// 		if (Array.isArray(targetValue))
// 			return mergeArray(targetValue, source[key]);
// 		if (typeof targetValue === 'object') {
// 			return mergeObject(targetValue, source[key]);
// 		}
// 	}
// 	return source[key];
// }

// const _mergeArrayWithParams = function (target, source) {
// 	return source;
// }

// module.exports = merge;

// //////////////////////////////////////////



// const a = {
// 	// test1: 'a',
// 	// test2: 1,
// 	// test4: 'nope',
// 	test1: [0, 1, 2],
// 	test2: [0],
// 	test3: [],
// 	test4: [0, 1, 2, 3, 4],
// 	test5: [0, 1, 2]
// }

// const b = {
// 	// test1: 'b',
// 	// test2: 2,
// 	// test3: true,
// 	test1: [10, 11, 12, 13],
// 	test2: [10, 11],
// 	test3: [10, 11, 12],
// 	test4: [10, 11],
// 	test5: []
// }

// const result = merge(a, b);
// console.log('target', a);
// console.log('source', b);
// console.log('result', result);

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

console.log(JSON.stringify(tgt, null, 2));
console.log(JSON.stringify(src, null, 2));
console.log(JSON.stringify(res, null, 2));