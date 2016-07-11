function validateType(constructor, isArray, isVariadic) {
	if (!constructor.prototype) {
		throw new TypeError('Type must have prototype.');
	}
	return {constructor, isArray, isVariadic};
}

export default function (type) {
	if (Array.isArray(type)) {
		if (type.length !== 1) {
			throw new TypeError('Array type specification must have exactly one element in the array.');
		}

		type = type[0];
		if (Array.isArray(type)) {
			if (type.length !== 1) {
				throw new TypeError('Varidic type specification must have exactly one element in the array.');
			}

			return validateType(type[0], false, true);
		}

		return validateType(type, true, false);
	}

	return validateType(type, false, false);
}
