export const arrayToObject = keys => array => keys.reduce((object, key, i) => {
	object[key] = array[i];
	return object;
}, {});

export const map = fn => list => {
	const mappers = list.map(fn);
	return list => list.map((item, i) => mappers[i](item));
};

export const mutateArray = fn => array => {
	array.forEach(function (currentValue, index, array) {
		array[index] = fn.apply(this, arguments);
	}, this);
	return array;
};