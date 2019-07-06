const directReplace = (_, pos) => pos;
const cloneReplace = (_, pos) => Object.assign({}, pos);

const mergeObjects = function (pre, pos) {
	pre = Object.assign({}, pre);
	Object.keys(pos).forEach(k =>
		pre[k] = merge(pre[k], pos[k]));
	return pre;
}

const mergeArrays = function (pre, pos) {
	pre = pre.slice();
	pos.forEach((v, i) => pre[i] = v);
	return pre;
}

const mergeArrayWithParams = function (pre, pos) {
	pre = pre.slice();
	const key = Object.keys(pos)[0]; // (x_x) This is ugly
	if (key in arrayMergeFn)
		return arrayMergeFn[key](pre, pos[key]);
	return pos;
}

const arrayMergeFn = {
	$push: (pre, pos) => pre.concat(pos),
	$append: (pre, pos) => pre.concat(pos),
	$prepend: (pre, pos) => pos.concat(pre),
	$set: (_, pos) => pos.slice()
}

const fn = {
	oo: mergeObjects,
	oa: cloneReplace,
	ob: directReplace,

	aa: mergeArrays,
	ao: mergeArrayWithParams,
	ab: directReplace,

	bb: directReplace,
	bo: cloneReplace,
	ba: cloneReplace
}

function merge(target, source) {
	const tt = Array.isArray(target) ? 'a' : (typeof target === 'object' ? 'o' : 'b');
	const st = Array.isArray(source) ? 'a' : (typeof source === 'object' ? 'o' : 'b');
	return fn[tt + st](target, source);
}

export default merge;