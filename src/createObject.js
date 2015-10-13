import {apply} from './';

export function createObject(prototype, value) {
	// `valueOf` property descriptor
	const valueOf = {
		value() {
			return value;
		}
	};
	switch (typeof value) {
		case 'function': return Object.defineProperties(Object.setPrototypeOf(apply(value), prototype), {
			valueOf,
			prototype: {
				value: value.prototype
			}
		});
		case 'undefined': return;
		default: return Object.create(prototype, {valueOf});
	}
}