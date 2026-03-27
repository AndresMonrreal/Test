import { __rest } from './external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.24.3_tslib@2.8.0_typescript@5.6.3/external/tslib/tslib.es6.js';
import { _mapValues, _isPlainObject, createId } from '@felte/common';

function deepSetKey(obj) {
    if (!obj)
        return {};
    return _mapValues(obj, (prop) => {
        if (_isPlainObject(prop))
            return deepSetKey(prop);
        if (Array.isArray(prop)) {
            if (prop.length === 0 || prop.every((p) => typeof p === 'string'))
                return prop;
            return prop.map((p) => {
                if (!_isPlainObject(p))
                    return p;
                const field = deepSetKey(p);
                if (!field.key)
                    field.key = createId();
                return field;
            });
        }
        return prop;
    });
}
function deepRemoveKey(obj) {
    if (!obj)
        return {};
    return _mapValues(obj, (prop) => {
        if (_isPlainObject(prop))
            return deepRemoveKey(prop);
        if (Array.isArray(prop)) {
            if (prop.length === 0 || prop.every((p) => typeof p === 'string'))
                return prop;
            return prop.map((p) => {
                if (!_isPlainObject(p))
                    return p;
                const _a = deepRemoveKey(p), field = __rest(_a, ["key"]);
                return field;
            });
        }
        return prop;
    });
}

export { deepRemoveKey, deepSetKey };
//# sourceMappingURL=deep-set-key.js.map
