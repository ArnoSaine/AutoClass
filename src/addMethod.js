import {mapObj} from './';

export const addMethod = (name, variadicIndex, isVariadicSubject, subject, {length}) => add(name, index => {
	/*if (index === variadicIndex) {
		throw new Error(`There should be no methods created of parameter ${index}.`);
	}*/
	
	const integrate = index < variadicIndex || !isVariadicSubject
		? instance => args => args.splice(index, 0, instance)
		: instance => args => args.splice(args.length - length + index + 1, 0, instance);
		
	return instance => {
		const splice = integrate(instance);
		return (...args) => {
			splice(args);
			const value = subject(...args);
			// if value is undefined, return `instance` for chaining
			return typeof value === 'undefined' ? instance : value;	
		};
	};
});

function add(methodName, methods) {
	const secondaryMethods = {};
	const myMethod = Symbol(`Method to ${methodName}`);

	// parameterType =>
	return ({constructor:{prototype}, index, name}) => {
		if (prototype) {
			if (prototype.hasOwnProperty(methodName)) {
				const method = prototype[methodName];
				if (method.hasOwnProperty(myMethod)) {
					secondaryMethods[name] = methods(index);
				}
			} else {
				const method = methods(index);
				Object.defineProperty(prototype, methodName, {
					get() {
						return Object.defineProperties(method(this), mapObj(secondaryMethods, method => ({
							get: () => method(this)
						}), {
							[myMethod]: {}
						}));
					}
				});
			}
		}
	}
}