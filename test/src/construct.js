import AutoClass from './../../../AutoClass';
import assert from 'assert';

const ref = {};

let TestClass = AutoClass('', function () {
	return ref;
});

let TestClassConstructor = TestClass.valueOf();

assert(TestClass instanceof AutoClass, 'instance of AutoClass');

let testInstance = TestClassConstructor();

assert(testInstance instanceof TestClassConstructor, 'instance of class');

assert.strictEqual(testInstance.valueOf(), ref, 'instance value');

assert.strictEqual(Object.getPrototypeOf(testInstance), TestClassConstructor.prototype, 'prototype of instance');
