import getParameterNames from 'get-parameter-names';
import isPlainObject from 'is-plain-object';
import {arrayToObject, map, mutateArray} from './utils';

const toObject = ({constructor}) => value => value instanceof constructor ? value : constructor(value);
const valueOf = any => any === null || typeof any === 'undefined' ? any : any.valueOf();

function validateArgumentsLength(isVariadic, parameterTypesLength) {
	if (isVariadic) {
		return (expectingAtLeast => {
			if (parameterTypesLength > 2) {
				return {
					test: argumentsLength => argumentsLength >= expectingAtLeast || argumentsLength === 1,
					error: argumentsLength => `Expected at least ${expectingAtLeast} or 1 arguments, got ${argumentsLength}.`
				};
			} else {
				return {
					test: argumentsLength => argumentsLength >= expectingAtLeast,
					error: argumentsLength => `Expected at least ${expectingAtLeast} arguments, got ${argumentsLength}.`
				};
			}
		})(parameterTypesLength - 1);
	} else {
		if (parameterTypesLength > 1) {
			return {
				test: argumentsLength => argumentsLength === parameterTypesLength || argumentsLength === 1,
				error: argumentsLength => `Expected exactly ${parameterTypesLength} or 1 arguments, got ${argumentsLength}.`
			};
		} else {
			return {
				test: argumentsLength => argumentsLength === parameterTypesLength,
				error: argumentsLength => `Expected exactly ${parameterTypesLength} arguments, got ${argumentsLength}.`
			};
		}
	}
}

const argumentToInstance = parameterType => {
	const construct = toObject(parameterType);
	if (parameterType.isVariadic || parameterType.isArray) {
		return (constructEach => arg => {
			if (!Array.isArray(arg)) {
				throw new TypeError('Expected array.');
			}
			return constructEach(arg);
		})(mutateArray(construct));
	} else {
		return construct;
	}
};

const instanceToValue = parameterType => parameterType.isVariadic || parameterType.isArray ? arg => arg.map(valueOf) : valueOf;
const argumentsToInstances = map(argumentToInstance);
const instancesToValues = map(instanceToValue);

const formatArguments = (isVariadic, variadicIndex, parameterNames, parameterTypesLength) => {
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
			args = Array.prototype.slice.call(args);
			args.splice(variadicIndex, 0, args.splice(variadicIndex, args.length - parameterTypesLength + 1));
			return args;
		} :
		args => Array.prototype.slice.call(args);
	
	return args => {
		switch (args.length) {
			case 0: return [];
			case 1: return singleArgument(args[0]);
			default: return multipleArguments(args);
		}
	};
}

export default function (parameterTypes, func, isVariadic, variadicIndex) {
	const parameterNames = getParameterNames(func);

	if (func.length !== parameterNames.length) {
		throw new Error(`func.length (${func.length}) and parameterNames.length (${parameterNames.length}) should be equal.`);
	}

	if (parameterTypes.length < parameterNames.length) {
		throw new Error(`Missing parameter definitions. Got ${parameterTypes.length}, expecting ${parameterNames.length}.`);
	}

	if (parameterTypes.length > parameterNames.length) {
		throw new Error(`Missing parameter names. Got ${parameterNames.length}, expecting ${parameterTypes.length}.`);
	}

	const {
		test: isValidArgumentsLength,
		error: argumentsLengthError
	} = validateArgumentsLength(isVariadic, parameterTypes.length);
	const toInstances = argumentsToInstances(parameterTypes);
	const format = formatArguments(isVariadic, variadicIndex, parameterNames, parameterTypes.length);
	const createContext = arrayToObject(parameterNames);
	const toValues = instancesToValues(parameterTypes);

	return function subject() {

		if (!isValidArgumentsLength(arguments.length)) {
			throw new Error(argumentsLengthError(arguments.length));
		}

		const args = toInstances(format(arguments));
		let value = func.apply(createContext(args), toValues(args));

		return Object.create(subject.prototype, {
			valueOf: {
				value() {
					return value;
				}
			}
		});
	};
};
