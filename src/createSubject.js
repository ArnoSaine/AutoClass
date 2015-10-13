import {
	arrayToObject,
	assignParameterNamesAndIndexes,
	createObject,
	argumentsToInstances,
	instancesToValues,
	formatArguments,
	constructorCallCheck
} from './';

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

export function createSubject(name, parameterTypes, func, isVariadic, variadicIndex, makeAutoClass) {
	const parameterNames = assignParameterNamesAndIndexes(parameterTypes, func);

	const {
		test: isValidArgumentsLength,
		error: argumentsLengthError
	} = validateArgumentsLength(isVariadic, parameterTypes.length);
	const toInstances = argumentsToInstances(parameterTypes);
	const format = formatArguments(isVariadic, variadicIndex, parameterNames, parameterTypes.length);
	const createContext = arrayToObject(parameterNames);
	const toValues = instancesToValues(parameterTypes);

	return function subject(...args) {
		constructorCallCheck(name, this, subject);

		if (!isValidArgumentsLength(args.length)) {
			throw new Error(argumentsLengthError(args.length));
		}

		args = toInstances(format(args));

		return createObject(subject.prototype, func.apply(createContext(args), toValues(args)));
	};
}
