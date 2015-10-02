import {apply} from './';

export function createObject(subject, value) {
	// `valueOf` property descriptor
	const valueOf = {
		value() {
			return value;
		}
	};
	return typeof value === 'function'
		? Object.defineProperties(Object.setPrototypeOf(apply(value), subject.prototype), {
			valueOf,
			prototype: {
				value: value.prototype
			}
		})
		: Object.create(subject.prototype, {valueOf});
}