import isPlainObject from 'is-plain-object';
import {identity} from 'ramda';

export default (isVariadic, variadicIndex, parameterNames, parameterTypesLength) => {
	const singleArgument = (isVariadic ? 2 : 1) < parameterTypesLength
		? arg => {
			if (!isPlainObject(arg)) {
				throw new TypeError('Expected plain object for AutoClass instance.');
			}
			return parameterNames.map(name => arg[name]);
		}
		: isVariadic
			? parameterTypesLength === 1
				? arg => [[arg]]
				: variadicIndex === 0
					? arg => [[], arg]
					: arg => [arg, []]
			: arg => [arg];
	const multipleArguments = isVariadic ?
		args => {
			args.splice(variadicIndex, 0, args.splice(variadicIndex, args.length - parameterTypesLength + 1));
			return args;
		} :
		identity;
	return args => {
		switch (args.length) {
			case 0: return [];
			case 1: return singleArgument(args[0]);
			default: return multipleArguments(args);
		}
	};
};
