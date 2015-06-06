module.exports = function type(type) {
	function validateType(type, isVariableLength) {
		if (!type.prototype) {
			throw new Error('Type must have prototype.');
		}

		return {
			constructor: type,
			isVariableLength: isVariableLength
		};
	}

	if (Array.isArray(type)) {
		if (type.length !== 1) {
			throw new Error('Variable length type specification must have exactly one element in the array.');
		}

		return validateType(type[0], true);
	}

	return validateType(type, false);
};
