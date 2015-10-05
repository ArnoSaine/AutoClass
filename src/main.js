import {
	autoClass,
	text,
	type
} from './';

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
