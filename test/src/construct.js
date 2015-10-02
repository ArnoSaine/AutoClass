import AutoClass from '../../';
import assert from 'assert';

const ref = {};

const TestClass = AutoClass('', function () {
	return ref;
});

assert(TestClass instanceof AutoClass, 'instance of AutoClass');

const testInstance = TestClass();

assert(testInstance instanceof TestClass, 'instance of class');

assert.strictEqual(testInstance.valueOf(), ref, 'instance value');

assert.strictEqual(Object.getPrototypeOf(testInstance), TestClass.prototype, 'prototype of instance');
