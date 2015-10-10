import AutoClass from '../../';
import assert from 'assert';

AutoClass('Subtract', Number, Number, (minuend, subtrahend) => minuend - subtrahend);

var subtractFrom7 = (7).Subtract;

assert.strictEqual(subtractFrom7(3).valueOf(), 4, 'auto bind');
