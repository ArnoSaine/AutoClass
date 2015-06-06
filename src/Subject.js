import getParameterNames from 'get-parameter-names';

var toObject = ({constructor}) => value => value instanceof constructor ? value : constructor(value);
var valueOf = any => any === null || typeof any === 'undefined' ? any : any.valueOf();

export default function (paramTypes, f, hasVariableLengthArgument, variableLengthArgumentIndex) {
	return function subject() {
		if (hasVariableLengthArgument ? arguments.length < paramTypes.length - 1 : arguments.length !== paramTypes.length) {
			throw new Error('Expected ' + paramTypes.length + ' arguments, got ' + arguments.length);
		}

		var args = Array.prototype.slice.call(arguments);
		if (hasVariableLengthArgument) {
			args.splice(variableLengthArgumentIndex, 0, args.splice(variableLengthArgumentIndex, args.length - (paramTypes.length - 1)));
		}

		args = args.map(function (arg, i) {
			var paramType = paramTypes[i];
			return paramType.isVariableLength ? arg.map(toObject(paramType)) : toObject(paramType)(arg);
		});

		var context = {};
		getParameterNames(f).forEach(function (paramName, i) {
			context[paramName] = args[i];
		});

		var value = f.apply(context, args.map(function (arg, i) {
			var paramType = paramTypes[i];
			return paramType.isVariableLength ? arg.map(valueOf) : valueOf(arg);
		}));

		return Object.create(subject.prototype, {
			valueOf: {
				value() {
					return value;
				}
			}
		});
	};
};
