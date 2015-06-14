import createSubject from './createSubject';
import type from './type';

function AutoClass(/*name[, args], f*/) {
	const args = Array.prototype.slice.call(arguments);
	const f = args.pop();
	const name = args.shift();

	return autoClass(name, args.map(type), f);
}

function autoClass(name, paramTypes, f) {
	const variadicIndex = paramTypes.reduce(function (variadicIndex, paramType, i) {
		if (paramType.isVariadic) {
			if (variadicIndex !== -1) {
				throw new Error('Only one variadic type is allowed.');
			}
			return i;
		}
		return variadicIndex;
	}, -1);

	const isVariadic = variadicIndex !== -1;

	const subject = createSubject(paramTypes, f, isVariadic, variadicIndex);
	
	if (name) {
		// add methods
		paramTypes.forEach(function (paramType, i) {
			// don't create methods for array or variadic type
			if (paramType.isArray || paramType.isVariadic) {
				return;
			}
			const proto = paramType.constructor.prototype;
			if (proto && !proto[name]) {
				proto[name] = function method() {
					let args = Array.prototype.slice.call(arguments);
					if (i < variadicIndex || !isVariadic) {
						args.splice(i, 0, this);
					} else {
						if (i > variadicIndex) {
							args.splice(args.length - paramTypes.length + i, 0, this);
						}
					}
					return subject.apply(undefined, args);
				};
			}
		});
	}

	return subject;
}

const Text = AutoClass('', String, function (text) {
	return typeof text === 'string' ? text : '';
});

const Type = AutoClass('Type', Object, type);

export default AutoClass(
	'AutoClass',
	Text,
	[[Type]],
	Function, 
	autoClass
);
