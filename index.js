const _replace = function (_, pos) { return pos; }
const _cloneReplace = function (_, pos) { return Object.assign({}, pos); }

const _mergeObjects = function (pre, pos) {
	pre = Object.assign({}, pre);
	Object.keys(pos).forEach(k =>
		pre[k] = merge(pre[k], pos[k]));
	return pre;
}

const _mergeArrays = function (pre, pos) {
	pre = pre.slice();
	pos.forEach((v, i) => pre[i] = v);
	return pre;
}

const _mergeArray2 = function (pre, pos) {
	pre = pre.slice();
	const key = Object.keys(pos)[0]; // TODO
	if (key in arrayMergeFn)
		return arrayMergeFn[key](pre, pos[key]);
	return pos;
}

const arrayMergeFn = {
	$append: (pre, pos) => pre.concat(pos),
	$prepend: (pre, pos) => pos.concat(pre),
	$set: (_, pos) => pos.slice()
}

const fn = {
	oo: _mergeObjects,
	oa: _cloneReplace,
	ob: _replace,

	aa: _mergeArrays,
	ao: _mergeArray2,
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