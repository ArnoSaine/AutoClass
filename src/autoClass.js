import {complement} from 'ramda';
import addMethod from './addMethod';
import createSubject from './createSubject';
import isVectorType from './isVectorType';

const variadicParameterIndex = paramTypes => paramTypes.reduce(function (variadicIndex, {isVariadic}, i) {
	if (isVariadic) {
		if (variadicIndex !== -1) {
			throw new TypeError('Only one variadic type is allowed.');
		}
		return i;
	}
	return variadicIndex;
}, -1);

export default function (name, paramTypes, func) {
	const variadicIndex = variadicParameterIndex(paramTypes);
	const isVariadic = variadicIndex !== -1;

	const subject = createSubject(name, paramTypes, func, isVariadic, variadicIndex);

	if (name) {
		paramTypes
			.filter(complement(isVectorType))
			.forEach(addMethod(name, variadicIndex, isVariadic, subject, paramTypes));
	}

	return subject;
}
