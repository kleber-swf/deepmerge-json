const FK = '__proto__';
const directReplace = (_, pos) => pos;
const shallowCopyArray = (_, pos) => pos.map(e => merge(e));
const shallowCopyObj = (_, pos) => {
	if (pos && pos.hasOwnProperty('__proto__')) {
		const res = {};
		for (let e in pos) {
			if (e !== FK) res[e] = pos[e];
		}
		return res;
	}
	return Object.assign({}, pos);
};

// const _clone = (_, pos) => merge(pos);


const mergeObjects = function (pre, pos) {
	pre = shallowCopyObj(undefined, pre);
	Object.keys(pos).forEach(k => { if (k !== FK) pre[k] = merge(pre[k], pos[k]); });
	return pre;
};

const mergeArrays = function (pre, pos) {
	pre = shallowCopyArray(undefined, pre);
	pos.forEach((v, i) => (pre[i] = merge(pre[i], v)));
	return pre;
};

const mergeArrayWithParams = function (pre, pos) {
	pre = shallowCopyArray(undefined, pre);
	Object.keys(pos).forEach(key => {
		if (key !== FK) {
			pre = key in arrayMergeFn ? arrayMergeFn[key](pre, pos[key]) : pos;
		}
	});

	return pre;
};

const indexedReplace = function (pre, pos) {
	pre = shallowCopyArray(undefined, pre);
	let kn;
	Object.keys(pos).forEach(k => {
		kn = Number.parseInt(k);
		if (kn < 0 || Number.isNaN(kn)) throw Error(`Invalid index for $replace: ${k}`);
		pre[kn] = merge.clone(pos[k]);
	});
	return pre;
};

const indexedMerge = function (pre, pos) {
	pre = pre.slice();
	let kn;
	Object.keys(pos).forEach(k => {
		kn = Number.parseInt(k);
		if (kn < 0 || Number.isNaN(kn)) throw Error(`Invalid index for $merge: ${k}`);
		pre[kn] = merge(pre[kn], pos[k]);
	});
	return pre;
};

const insert = function (pre, pos) {
	pre = shallowCopyArray(undefined, pre);
	let kn;
	Object.keys(pos).forEach(k => {
		kn = Number.parseInt(k);
		if (Number.isNaN(kn)) throw Error(`Invalid index for $insert: ${k}`);
		pre.splice(kn, 0, pos[k]);
	});
	return pre;
};

const arrayMergeFn = {
	$push: (pre, pos) => pre.concat(pos),
	$append: (pre, pos) => pre.concat(pos),
	$prepend: (pre, pos) => pos.concat(pre),
	$replace: indexedReplace,
	$merge: indexedMerge,
	$insert: insert,
	$set: shallowCopyArray,	// TODO clone
};

const fn = {
	oo: mergeObjects,
	oa: shallowCopyObj,		// TODO clone
	ob: directReplace,

	aa: mergeArrays,
	ao: mergeArrayWithParams,
	ab: directReplace,

	bb: directReplace,
	bo: shallowCopyObj,		// TODO clone
	ba: shallowCopyArray,	// TODO clone
};

/**
 * Deeply merge objects. Properties from the second parameter overrides the ones with the same path
 * in the first object.
 * 
 * Arrays can be merged or changed with `$push`, `$prepend`, `$set`, `$replace` or `$insert`
 * operations. Multiple operations can be passed.
 * 
 * @see {@link https://github.com/kleber-swf/deepmerge-json#readme}
 * @param {any} pre Base object
 * @param {any} pos Object that will overrite base properties. If none is given, the first object is
 * 			  deeply cloned
 * @returns {any} A deep clone object containing a combination of all
 * 			properties from pre and pos arguments.
 */
function merge(pre, pos) {
	if (pos === undefined) {
		if (pre == null) return pre;
		if (Array.isArray(pre)) pos = [];
		else if (typeof pre === 'object') pos = {};
		else pos = pre;
	} else if (pos === null) {
		return null;
	}
	const tt = Array.isArray(pre) ? 'a' : typeof pre === 'object' ? 'o' : 'b';
	const st = Array.isArray(pos) ? 'a' : typeof pos === 'object' ? 'o' : 'b';
	return fn[tt + st](pre, pos);
}

/**
 * Deeply clones an object. This method is an alias to {@linkcode merge} with a single parameter.
 * 
 * @template T
 * @param {T} obj The object to be cloned
 * @returns {T} The object passed as parameter deeply cloned.
 */
merge.clone = obj => merge(obj);

/**
 * Merges multiple objects. It respects the order of the parameters and the operations just like
 * expected if you call {@linkcode merge} multiple times passing the last result as the first
 * parameter to the next call.
 * 
 * @param {any} pre The required first object
 * @param  {...any} args Subsequential objects. Keep in mind that their order matters.
 * @returns {any} A deeply merged object containing all of the parameters
 */
merge.multi = (pre, ...args) => {
	if (!args) return merge(pre);
	for (let i = 0; i < args.length; i++) {
		pre = merge(pre, args[i]);
	}
	return pre;
}

export default merge;

// TODO Test the following approach: clone both objects at the start so we won't need to
// keep cloning the objects individually during the process.
// 1. we can clone with JSON.parse(JSON.stringify) and check the __proto__ during the merge
// 2. we can clone manually and check for __proto__ during this phase