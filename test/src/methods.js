import AutoClass from '../../';
import assert from 'assert';

const ref = {};
let assertCount = 0;

const TestClass = AutoClass('', function () {
	return ref;
});

const testInstance = TestClass();

const Only = AutoClass('Only', TestClass, function (x) {
	assertCount++;
	assert.strictEqual(x, ref, 'only');
});

const First = AutoClass('First', TestClass, Number, function (x, a) {
	assertCount++;
	assert.strictEqual(x, ref, 'first');
});

const Middle = AutoClass('Middle', Number, TestClass, Number, function (a, x, b) {
	assertCount++;
	assert.strictEqual(x, ref, 'middle');
});

const Last = AutoClass('Last', Number, TestClass, function (a, x) {
	assertCount++;
	assert.strictEqual(x, ref, 'last');
});

const VariadicBefore = AutoClass('VariadicBefore', [[Number]], TestClass, function (a, x) {
	assertCount++;
	assert.strictEqual(x, ref, 'variadic before');
});

const VariadicAfter = AutoClass('VariadicAfter', TestClass, [[Number]], function (x, a) {
	assertCount++;
	assert.strictEqual(x, ref, 'variadic after');
});

testInstance.Only();
testInstance.First(0);
testInstance.Middle(0, 0);
testInstance.Last(0);
testInstance.VariadicBefore();
testInstance.VariadicBefore(0);
testInstance.VariadicBefore(0, 0);
testInstance.VariadicAfter();
testInstance.VariadicAfter(0);
testInstance.VariadicAfter(0, 0);

assert.strictEqual(assertCount, 10, 'assert count');
