const mergeObject = function (target, source) {
	Object.keys(source).forEach(key => {
		target[key] = _merge(key, target, source)
	});
	return target;
}

const mergeArray = function (target, source) {
	if (Array.isArray(source)) {
		source.forEach((_, i) => {
			target[i] = _merge(i, target, source)
		});
		return target;
	}
	if (typeof source === 'object') {
		return _mergeArrayWithParams(target, source);
	}
	return source;
}

const _merge = function (key, target, source) {
	if (key in target) {
		const targetValue = target[key];
		if (Array.isArray(targetValue))
			return mergeArray(targetValue, source[key]);
		if (typeof targetValue === 'object')
			return mergeObject(targetValue, source[key]);
	}
	return source[key];
}

const _mergeArrayWithParams = function (target, source) {
	return source;
}

const merge = function (target, source) {
	const result = Object.assign({}, target);
	return mergeObject(result, source);
}

module.exports = merge;