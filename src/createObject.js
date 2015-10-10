import {apply} from './';

export function createObject(subject, value) {
	// `valueOf` property descriptor
	const valueOf = {
		value() {
			return value;
		}
	};
	switch (typeof value) {
		case 'function': return Object.defineProperties(Object.setPrototypeOf(apply(value), subject.prototype), {
			valueOf,
			prototype: {
				value: value.prototype
			}
		});
		case 'undefined': return;
		default: return Object.create(subject.prototype, {valueOf});
	}
}