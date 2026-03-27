import { __rest } from './../external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.24.3_tslib@2.8.0_typescript@5.6.3/external/tslib/tslib.es6.js';
import { _mapValues } from './mapValues.js';
import { _isPlainObject } from './isPlainObject.js';

function handleArray(value) {
    return function (propVal) {
        if (_isPlainObject(propVal)) {
            const _a = deepSet(propVal, value), field = __rest(_a, ["key"]);
            return field;
        }
        return value;
    };
}
/**
 * @category Helper
 */
function deepSet(obj, value) {
    return _mapValues(obj, (prop) => _isPlainObject(prop)
        ? deepSet(prop, value)
        : Array.isArray(prop)
            ? prop.map(handleArray(value))
            : value);
}

export { deepSet };
//# sourceMappingURL=deepSet.js.map
