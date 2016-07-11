import proxy from './proxy';

const {create, defineProperties, setPrototypeOf} = Object;

export default function (prototype, value) {
	// `valueOf` property descriptor
	const valueOf = {
		value() {
			return value;
		}
	};
	switch (typeof value) {
		case 'function': return defineProperties(setPrototypeOf(proxy(value), prototype), {
			valueOf,
			prototype: {
				value: value.prototype
			}
		});
		case 'undefined': return;
		default: return create(prototype, {valueOf});
	}
}
