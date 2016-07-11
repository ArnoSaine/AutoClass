import autoClass from './autoClass';
import type from './type';

const text = text => typeof text === 'string' ? text : '';

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

module.exports = exports.default;
