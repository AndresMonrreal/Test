import { __rest } from './external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.24.3_tslib@2.8.0_typescript@5.6.3/external/tslib/tslib.es6.js';
import { _mapValues, _isPlainObject } from '@felte/common';

function deepSetTouched(obj, value) {
    return _mapValues(obj, (prop) => {
        if (_isPlainObject(prop))
            return deepSetTouched(prop, value);
        if (Array.isArray(prop)) {
            if (prop.length === 0 || prop.every((p) => typeof p === 'string'))
                return value;
            return prop.map((p) => {
                const _a = deepSetTouched(p, value), field = __rest(_a, ["key"]);
                return field;
            });
        }
        return value;
    });
}

export { deepSetTouched };
//# sourceMappingURL=deep-set-touched.js.map
