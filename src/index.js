export const argumentToInstance = parameterType => {
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
export const instanceToValue = parameterType => parameterType.isVariadic || parameterType.isArray ? arg => arg.map(valueOf) : valueOf;
export const map = fn => list => {
	const mappers = list.map(fn);
	return list => list.map((item, i) => mappers[i](item));
};
export const mutateArray = fn => array => {
	array.forEach(function (currentValue, index, array) {
		array[index] = fn.apply(this, arguments);
	}, this);
	return array;
};

export * from './addMethod';
export * from './assignParameterNamesAndIndexes';
export * from './autoClass';
export * from './createObject';
export * from './createSubject';
export * from './formatArguments';
export * from './type';

// proxy function
export const apply = func => function () {
	return func.apply(this, arguments);
};
// return passed argument
export const arg = arg => arg;
export const argumentsToInstances = map(argumentToInstance);
export const arrayToObject = keys => array => keys.reduce((object, key, i) => {
	object[key] = array[i];
	return object;
}, {});
export const constructorCallCheck = (name, instance, func) => {
	if (instance && instance.constructor === func) {
		throw new TypeError(`${name} is not a constructor`);
	}
};
export const instancesToValues = map(instanceToValue);
// array or variadic types don't get methods
// parameterType => boolean.
export const isMethodType = ({isArray, isVariadic}) => !isArray && !isVariadic;
export const mapObj = (object, func, context) => Object.keys(object).reduce((curry, propName, index) => {
	curry[propName] = func.call(context, object[propName], propName, index, object);
	return curry;
}, {});
export const text = text => typeof text === 'string' ? text : '';
export const toObject = ({constructor}) => value => value instanceof constructor ? value : constructor(value);
export function validateType(constructor, isArray, isVariadic) {
	if (!constructor.prototype) {
		throw new Error('Type must have prototype.');
	}
	return {constructor, isArray, isVariadic};
}
export const valueOf = any => any === null || typeof any === 'undefined' ? any : any.valueOf();
export const variadicParameterIndex = paramTypes => paramTypes.reduce(function (variadicIndex, {isVariadic}, i) {
	if (isVariadic) {
		if (variadicIndex !== -1) {
			throw new Error('Only one variadic type is allowed.');
		}
		return i;
	}
	return variadicIndex;
}, -1);