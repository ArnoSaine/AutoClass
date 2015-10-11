import {
	addMethod,
	createSubject,
	isMethodType,
	variadicParameterIndex
} from './';

export function autoClass(name, paramTypes, func) {
	const variadicIndex = variadicParameterIndex(paramTypes);
	const isVariadic = variadicIndex !== -1;

	const subject = createSubject(paramTypes, func, isVariadic, variadicIndex);

	if (name) {
		paramTypes
			.filter(isMethodType)
			.forEach(addMethod(name, variadicIndex, isVariadic, subject, paramTypes));
	}

	return subject;
}
