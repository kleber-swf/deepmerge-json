const directReplace = (_: any, pos: any) => pos;
const cloneReplace = (_: any, pos: any) => Object.assign({}, pos);

const mergeObjects = function (pre: any, pos: any) {
	pre = Object.assign({}, pre);
	Object.keys(pos).forEach(k =>
		pre[k] = merge(pre[k], pos[k]));
	return pre;
}

const mergeArrays = function (pre: any[], pos: any[]) {
	pre = pre.slice();
	pos.forEach((v, i) => pre[i] = v);
	return pre;
}

const mergeArrayWithParams = function (pre: any[], pos: any) {
	pre = pre.slice();
	const key = Object.keys(pos)[0]; // (x_x) This is ugly
	if (key in arrayMergeFn)
		return arrayMergeFn[key](pre, pos[key]);
	return pos;
}

const arrayMergeFn = {
	$append: (pre: any[], pos: any[]) => pre.concat(pos),
	$prepend: (pre: any[], pos: any[]) => pos.concat(pre),
	$set: (_: any, pos: any[]) => pos.slice()
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

function merge(target: any, source: any) {
	const tt = Array.isArray(target) ? 'a' : (typeof target === 'object' ? 'o' : 'b');
	const st = Array.isArray(source) ? 'a' : (typeof source === 'object' ? 'o' : 'b');
	return fn[tt + st](target, source);
}

export = merge;