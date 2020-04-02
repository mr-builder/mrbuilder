/**
 * Yeah I know it has a few issues.   But I really need a fix, and don't want more deps.
 *
 * @param ob1
 * @param ob2
 */
export const deepMerge = (ob1: any, ob2: any) => {
    if (ob2 === null) {
        return ob2;
    }
    if (ob2 === void (0)) {
        return ob1;
    }
    if (ob1 == null) {
        return ob2;
    }
    switch (typeof ob2) {
        case 'number':
        case 'boolean':
        case 'string':
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'bigint':
            return ob2;
        case 'object':
            if (ob2 instanceof RegExp || ob2 instanceof Date) {
                return ob2;
            }
    }
    if (Array.isArray(ob1)) {
        return [...ob1, ...ob2];
    }
    return Object.entries(ob2).reduce((ret, [key, value]) => {
        ret[key] = deepMerge(ob1[key], value);
        return ret;
    }, {...ob1});
}
