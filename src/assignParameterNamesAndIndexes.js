import getParameterNames from 'get-parameter-names';

export default (parameterTypes, func) => {
	const parameterNames = getParameterNames(func);

	if (func.length !== parameterNames.length) {
		throw new TypeError(`func.length (${func.length}) and parameterNames.length (${parameterNames.length}) should be equal.`);
	}

	if (parameterTypes.length < parameterNames.length) {
		throw new TypeError(`Missing parameter definitions. Got ${parameterTypes.length}, expecting ${parameterNames.length}.`);
	}

	if (parameterTypes.length > parameterNames.length) {
		throw new TypeError(`Missing parameter names. Got ${parameterNames.length}, expecting ${parameterTypes.length}.`);
	}

	parameterTypes.forEach((paramType, index) => Object.assign(paramType, {
		index,
		name: parameterNames[index]
	}));

	return parameterNames;
};
