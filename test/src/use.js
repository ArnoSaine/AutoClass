import AutoClass from '../../';
import assert from 'assert';

AutoClass('Subtract', Number, Number, (minuend, subtrahend) => minuend - subtrahend);

const subtract = (7).Subtract;

// 7 - 3
assert.strictEqual(subtract(3).valueOf(), 4, 'auto bind');

const subtractSubtrahend = subtract.subtrahend;

// 4 - 7
assert.strictEqual(subtractSubtrahend(4).valueOf(), -3, 'secondary method');
