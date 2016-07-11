import constructorCallCheck from './constructorCallCheck';

const mapObj = (object, func, context) => Object.keys(object).reduce((curry, propName, index) => {
	curry[propName] = func.call(context, object[propName], propName, index, object);
	return curry;
}, {});

// If value is undefined, return `instance` for chaining
const link = instance => value => typeof value === 'undefined' ? instance : value;

function add(methodName, methods) {
	const secondaryMethods = {};
	let primaryMethod;

	// parameterType =>
	return ({constructor: {prototype}, index, name}) => {
		if (prototype) {
			if (prototype.hasOwnProperty(methodName)) {
				if (prototype[methodName] === primaryMethod) {
					secondaryMethods[name] = methods(index);
				}
			} else {
				const createMethod = methods(index);
				Object.defineProperty(prototype, methodName, {
					get() {
						return primaryMethod = Object.defineProperties(createMethod(this), mapObj(secondaryMethods, createMethod => ({
							get: () => createMethod(this)
						})));
					}
				});
			}
		}
	}
}

export default (name, variadicIndex, isVariadicSubject, subject, {length}) => add(name, index => {
	/*if (index === variadicIndex) {
		throw new TypeError(`There should be no methods created of parameter ${index}.`);
	}*/

	const integrate = index < variadicIndex || !isVariadicSubject
		? instance => args => args.splice(index, 0, instance)
		: instance => args => args.splice(args.length - length + index + 1, 0, instance);

	return instance => {
		const splice = integrate(instance);
		const chain = link(instance);
		return function method(...args) {
			constructorCallCheck(name, this, method);
			splice(args);
			return chain(subject(...args));
		};
	};
});
