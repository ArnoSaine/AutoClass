import {compose, juxt} from 'ramda';
import map from './map';
import isVectorType from './isVectorType';

const toObject = ({constructor}) => value => value instanceof constructor ? value : constructor(value);

const mapper = ([construct, isVectorType]) =>
	isVectorType
		? arg => {
			if (!Array.isArray(arg)) {
				throw new TypeError('Expected array.');
			}
			return arg.map(construct);
		}
		: construct;

// argumentsToInstances :: [parameterType] => [arg] => [instance]
export default map(compose(mapper, juxt([toObject, isVectorType])));
