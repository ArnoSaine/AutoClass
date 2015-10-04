import {
	createSubject,
	text,
	type
} from './';

function autoClass(name, paramTypes, func) {
	const variadicIndex = paramTypes.reduce(function (variadicIndex, paramType, i) {
		if (paramType.isVariadic) {
			if (variadicIndex !== -1) {
				throw new Error('Only one variadic type is allowed.');
			}
			return i;
		}
		return variadicIndex;
	}, -1);

	const isVariadicSubject = variadicIndex !== -1;

	const subject = createSubject(paramTypes, func, isVariadicSubject, variadicIndex);

	if (name) {
		// add methods
		paramTypes.forEach(function ({isArray, isVariadic, constructor}, i) {
			// don't create methods for array or variadic type
			if (isArray || isVariadic) {
				return;
			}
			const proto = constructor.prototype;
			if (proto && !proto[name]) {
				proto[name] = function method(...args) {
					if (i < variadicIndex || !isVariadicSubject) {
						args.splice(i, 0, this);
					} else {
						if (i > variadicIndex) {
							args.splice(args.length - paramTypes.length + i + 1, 0, this);
						}/* else {
							// i === variadicIndex
							throw new Error(´There should be no methods created of parameter ${i}.´);
						}*/
					}
					return subject(...args);
				};
			}
		});
	}

	return subject;
}

const AutoClass = autoClass('', [text, [[type]], Function].map(type), autoClass);

const Text = AutoClass('', String, text);
const Type = AutoClass('', Object, type);

export default AutoClass(
	'AutoClass',
	Text,
	[[Type]],
	Function,
	autoClass
);
