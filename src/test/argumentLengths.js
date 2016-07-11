import AutoClass from '../../';
import assert from 'assert';

const Zero = AutoClass('', function () {});

assert.doesNotThrow(() => {
	Zero();
}, '0, expecting 0');

assert.throws(() => {
	Zero(1);
}, Error, '1, expecting 0');

const One = AutoClass('', Number, function (a) {});

assert.throws(() => {
	One();
}, Error, '0, expecting 1');

assert.doesNotThrow(() => {
	One(1);
}, '1, expecting 1');

assert.throws(() => {
	One(1, 1);
}, Error, '2, expecting 1');

const Two = AutoClass('', Number, Number, function (a, b) {});

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

const OneVariadic = AutoClass('', [[Number]], function (a) {});

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

const TwoVariadic = AutoClass('', Number, [[Number]], function (a, b) {});

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

