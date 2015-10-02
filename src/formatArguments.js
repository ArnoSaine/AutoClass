import isPlainObject from 'is-plain-object';
import {arg} from './';

export const formatArguments = (isVariadic, variadicIndex, parameterNames, parameterTypesLength) => {
	const singleArgument = (() => {
		if ((isVariadic ? 2 : 1) < parameterTypesLength) {
			return arg => {
				if (!isPlainObject(arg)) {
					throw new Error('Expected plain object for AutoClass instance.');
				}
				return parameterNames.map(name => arg[name]);
			};
		} else {
			return isVariadic ? arg => [[arg]] : arg => [arg];
		}
	})();
	const multipleArguments = isVariadic ?
		args => {
			args.splice(variadicIndex, 0, args.splice(variadicIndex, args.length - parameterTypesLength + 1));
			return args;
		} :
		arg;
	return args => {
		switch (args.length) {
			case 0: return [];
			case 1: return singleArgument(args[0]);
			default: return multipleArguments(args);
		}
	};
};