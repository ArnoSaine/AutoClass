import AutoClass from 'autoclass';

export default AutoClass('Name', String, function (name) {
	if (!name) {
		throw new Error('Function must have a name.');
	}
	return name;
});