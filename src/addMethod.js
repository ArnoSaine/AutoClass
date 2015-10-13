import {
	mapObj,
	constructorCallCheck
} from './';

export const addMethod = (name, variadicIndex, isVariadicSubject, subject, {length}) => add(name, index => {
	/*if (index === variadicIndex) {
		throw new Error(`There should be no methods created of parameter ${index}.`);
	}*/
	
	const integrate = index < variadicIndex || !isVariadicSubject
		? instance => args => args.splice(index, 0, instance)
		: instance => args => args.splice(args.length - length + index + 1, 0, instance);
		
	return instance => {
		const splice = integrate(instance);
		return function method(...args) {
			constructorCallCheck(name, this, method);
			
			splice(args);
			const value = subject(...args);
			// if value is undefined, return `instance` for chaining
			return typeof value === 'undefined' ? instance : value;	
		};
	};
});

function add(methodName, methods) {
	const secondaryMethods = {};
	let primaryMethod;

	// parameterType =>
	return ({constructor:{prototype}, index, name}) => {
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