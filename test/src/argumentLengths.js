import AutoClass from '../../';
import assert from 'assert';

let Zero = AutoClass('', function () {}).valueOf();

assert.doesNotThrow(() => {
	Zero();
}, '0, expecting 0');

assert.throws(() => {
	Zero(1);
}, Error, '1, expecting 0');

let One = AutoClass('', Number, function (a) {}).valueOf();

assert.throws(() => {
	One();
}, Error, '0, expecting 1');

assert.doesNotThrow(() => {
	One(1);
}, '1, expecting 1');

assert.throws(() => {
	One(1, 1);
}, Error, '2, expecting 1');

let Two = AutoClass('', Number, Number, function (a, b) {}).valueOf();

assert.throws(() => {
	Two();
}, Error, '0, expecting 2');

assert.throws(() => {
	Two(1);
}, Error, '1, expecting 2');

assert.doesNotThrow(() => {
	Two(1, 1);
}, '2, expecting 2');

assert.throws(() => {
	Two(1, 1, 1);
}, Error, '3, expecting 2');

let OneVariadic = AutoClass('', [[Number]], function (a) {}).valueOf();

assert.doesNotThrow(() => {
	OneVariadic();
}, '0, expecting 0...N');

assert.doesNotThrow(() => {
	OneVariadic(1);
}, '1, expecting 0...N');

assert.doesNotThrow(() => {
	OneVariadic(1, 1);
}, '2, expecting 0...N');

assert.doesNotThrow(() => {
	OneVariadic(1, 1, 1);
}, '3, expecting 0...N');

let TwoVariadic = AutoClass('', Number, [[Number]], function (a, b) {}).valueOf();

assert.throws(() => {
	TwoVariadic();
}, Error, '0, expecting 1...N');

assert.doesNotThrow(() => {
	TwoVariadic(1);
}, '1, expecting 1...N');

assert.doesNotThrow(() => {
	TwoVariadic(1, 1);
}, '2, expecting 1...N');

assert.doesNotThrow(() => {
	TwoVariadic(1, 1, 1);
}, '3, expecting 1...N');

