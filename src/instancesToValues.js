import map from './map';
import isVectorType from './isVectorType';

const valueOf = any => any === null || typeof any === 'undefined' ? any : any.valueOf();

// instancesToValues :: [parameterType] => [instance] => [value]
export default map(parameterType =>
    isVectorType(parameterType)
        ? arg => arg.map(valueOf)
        : valueOf);
