import argumentsToInstances from './argumentsToInstances';
import assignParameterNamesAndIndexes from './assignParameterNamesAndIndexes';
import constructorCallCheck from './constructorCallCheck';
import createObject from './createObject';
import formatArguments from './formatArguments';
import instancesToValues from './instancesToValues';
import {zipObj} from 'ramda';

const validateArgumentsLength = (isVariadic, parameterTypesLength) =>
	isVariadic
		? (expectingAtLeast =>
			parameterTypesLength > 2
				? {
					test: argumentsLength => argumentsLength >= expectingAtLeast || argumentsLength === 1,
					error: argumentsLength => `Expected at least ${expectingAtLeast} or 1 arguments, got ${argumentsLength}.`
				}
				: {
					test: argumentsLength => argumentsLength >= expectingAtLeast,
					error: argumentsLength => `Expected at least ${expectingAtLeast} arguments, got ${argumentsLength}.`
				})(parameterTypesLength - 1)
		: parameterTypesLength > 1
			? {
				test: argumentsLength => argumentsLength === parameterTypesLength || argumentsLength === 1,
				error: argumentsLength => `Expected exactly ${parameterTypesLength} or 1 arguments, got ${argumentsLength}.`
			}
			: {
				test: argumentsLength => argumentsLength === parameterTypesLength,
				error: argumentsLength => `Expected exactly ${parameterTypesLength} arguments, got ${argumentsLength}.`
			};

export default function (name, parameterTypes, func, isVariadic, variadicIndex) {
	const parameterNames = assignParameterNamesAndIndexes(parameterTypes, func);
	const {
		test: isValidArgumentsLength,
		error: argumentsLengthError
	} = validateArgumentsLength(isVariadic, parameterTypes.length);
	const toInstances = argumentsToInstances(parameterTypes);
	const format = formatArguments(isVariadic, variadicIndex, parameterNames, parameterTypes.length);
	const createContext = zipObj(parameterNames);
	const toValues = instancesToValues(parameterTypes);
	return function subject(...args) {
		constructorCallCheck(name, this, subject);

		if (!isValidArgumentsLength(args.length)) {
			throw new TypeError(argumentsLengthError(args.length));
		}

		args = toInstances(format(args));

		return createObject(subject.prototype, func.apply(createContext(args), toValues(args)));
	};
}
