export default (name, instance, func) => {
	if (instance && instance.constructor === func) {
		throw new TypeError(`${name} is not a constructor`);
	}
};
