import assert from 'assert';
import {transform} from 'babel-core';
import {readFileSync} from 'fs';

const expectLoggings = [
	'Dovi, #4',
	'The Maniac, #29',
	'MyClass',
	'number',
	'Petrux, #9',
	123,
	true,
	true,
	'Error: Bike number must be positive integer, got -36.',
	'Error: Bike number must be positive integer, got NaN.',
	'Stoner, #27',
	'Stoner, #1',
	'Hello world!',
	' world!Hello'
];

const console = {
	log(x) {
		if (!expectLoggings.length) {
			throw new Error('Unexpected console.log call.');
		}
		assert.strictEqual(typeof x === 'object' && x !== null ? x.toString() : x, expectLoggings.shift());
	}
};

const options = JSON.parse(readFileSync('src/.babelrc'));

const examples = readFileSync('README.md')
	.toString()
	// find examples
	.match(/```(js|javascript)[\s\S]*?```/gi)
	// get code
	.map(example => example.replace(/^```(js|javascript)/, '').replace(/```$/, ''))
	// es6 --> es5
	.map(code => transform(code, options))
	.map(result => result.code)
	.join('\n');

const requireAutoClass = "require('autoclass');";

assert(examples.indexOf(requireAutoClass) > -1, 'requires AutoClass');

eval(examples.replace(requireAutoClass, "require('../../');var AutoClass = require('../../');"));

assert.strictEqual(expectLoggings.length, 0, 'got all example loggings');
