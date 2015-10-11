import getParameterNames from 'get-parameter-names';
import {
	createSubject,
	addMethod,
	isMethodType
} from './';

export function autoClass(name, paramTypes, func) {
	const variadicIndex = paramTypes.reduce(function (variadicIndex, paramType, i) {
		if (paramType.isVariadic) {
			if (variadicIndex !== -1) {
				throw new Error('Only one variadic type is allowed.');
			}
			return i;
		}
		return variadicIndex;
	}, -1);

	const isVariadicSubject = variadicIndex !== -1;

	const subject = createSubject(paramTypes, func, isVariadicSubject, variadicIndex);

	const parameterNames = getParameterNames(func);

	// assign index and name for each parameter type
	paramTypes.forEach((paramType, index) => Object.assign(paramType, {
		index,
		name: parameterNames[index]
	}));

	if (name) {
		paramTypes
			.filter(isMethodType)
			.forEach(addMethod(name, variadicIndex, isVariadicSubject, subject, paramTypes));
	}

	return subject;
}
