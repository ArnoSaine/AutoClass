import 'array.prototype.findindex';
import Subject from './Subject';
import type from './type';

function AutoClass(/*name[, args], f*/) {
	var args = Array.prototype.slice.call(arguments);
	var f = args.pop();
	var name = args.shift();

	return autoClass(name, args.map(type), f);
}

function autoClass(name, paramTypes, f) {
	var variableLengthArgumentIndex = paramTypes.findIndex(function (paramType) {
		return paramType.isVariableLength;
	});

	var hasVariableLengthArgument = variableLengthArgumentIndex !== -1;

	var subject = Subject(paramTypes, f, hasVariableLengthArgument, variableLengthArgumentIndex);
	
	paramTypes.forEach(function (paramType, i) {
		if (i === variableLengthArgumentIndex) {
			return;
		}
		var proto = paramType.constructor.prototype;
		if (!proto[name]) {
			proto[name] = function method() {
				var args = Array.prototype.slice.call(arguments);
				if (i < variableLengthArgumentIndex || !hasVariableLengthArgument) {
					args.splice(i, 0, this);
				} else {
					if (i > variableLengthArgumentIndex) {
						var iRight = paramTypes.length - i;
						args.splice(args.length - iRight, 0, this);
					}
				}
				return subject.apply(undefined, args);
			};
		}
	});

	return subject;
}

export default AutoClass;

var Name = require('./Name');
var Type = AutoClass('Type', Object, type);

export default AutoClass(
	'AutoClass',
	Name,
	[Type],
	Function, 
	autoClass
);
