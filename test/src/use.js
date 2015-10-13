import AutoClass from '../../';
import assert from 'assert';

const Subtract = AutoClass('Subtract', Number, Number, (minuend, subtrahend) => minuend - subtrahend);
const subtract = (7).Subtract;
const subtractSubtrahend = subtract.subtrahend;

assert.doesNotThrow(() => {
	Subtract(1, 1);
}, 'call as function');

assert.throws(() => {
	new Subtract(1, 1);
}, ({message}) => message === 'Subtract is not a constructor', 'call with new');

assert.throws(() => {
	new subtract(1);
}, ({message}) => message === 'Subtract is not a constructor', 'call primary method with new');

assert.throws(() => {
	new subtractSubtrahend(1);
}, ({message}) => message === 'Subtract is not a constructor', 'call secondary method with new');

// 7 - 3
assert.strictEqual(subtract(3).valueOf(), 4, 'auto bind');

// 4 - 7
assert.strictEqual(subtractSubtrahend(4).valueOf(), -3, 'secondary method');
