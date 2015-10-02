import AutoClass from '../../';
import assert from 'assert';

assert.doesNotThrow(() => {
	AutoClass('', function () {});
}, 'no parameters');

assert.doesNotThrow(() => {
	AutoClass('', Number, function (x) {});
}, 'one parameter');

assert.throws(() => {
	AutoClass('', function (x) {});
}, Error, 'missing type');

assert.throws(() => {
	AutoClass('', Number, function () {});
}, Error, 'missing parameter name');

function MyFunc() {}
class MyClass {}
const MyAutoClass = AutoClass('', function () {});

let legalTypesCount = 0;
let legalTypes = [Number, String, Function, Object, RegExp, Array, Error, TypeError, MyFunc, MyClass, MyAutoClass];
legalTypes = legalTypes.concat(legalTypes.map(type => [type]));
legalTypes = legalTypes.concat(legalTypes.map(type => [type]));
legalTypes.forEach(type => {
	assert.doesNotThrow(() => {
		legalTypesCount++;
		AutoClass('', Number, function (x) {});
	}, 'legal type');
});
assert.strictEqual(legalTypesCount, 44, 'tested legal types count');

let illegalTypesCount = 0;
let illegalTypes = [null, void 0, undefined, '', 'x', /x/, 0, 1, 4, true, false, {}, Object.create(null), []];
illegalTypes = illegalTypes.concat(illegalTypes.map(type => [type]));
illegalTypes = illegalTypes.concat(illegalTypes.map(type => [type]));
illegalTypes.forEach(type => {
	assert.throws(() => {
		illegalTypesCount++;
		AutoClass('', type, function (x) {});
	}, Error, 'illegal type');
});
assert.strictEqual(illegalTypesCount, 56, 'tested illegal types count');

assert.throws(() => {
	AutoClass('', [[Number]], [[Number]], function (a, b) {});
}, Error, 'only one variadic is allowed');
