const toDocs = v => JSON.parse(JSON.stringify(v, function (key, value) {
    if (key === 'value' && this.type === 'instanceOf') {
        return value != null && (value.displayName || value.name
                                 || `[${typeof value}]`)
    }
    if (value instanceof RegExp) {
        return '' + value;
    }
    return value;
}));
const has    = Function.call.bind(Object.prototype.hasOwnProperty);

const enumify     = v => ({
    value   : typeof v === 'number' ? '' + v : `'${v}'`,
    computed: false
});
const { assign }  = Object;
const noUndefined = (obj) => {
    if (!obj) {
        return obj;
    }
    return Object.keys(obj).reduce((ret, key) => {
        if (obj[key] === void(0)) {
            return ret;
        }
        ret[key] = obj[key];
        return ret;
    }, {});
};

const process  = (prop) => {
    if (prop == null) {
        return void(0);
    }
    if (typeof prop === 'string') {
        return prop;
    }
    const { type: name, value, required, description = void(0) } = prop;

    switch (name) {
        case 'shape':
            return {
                name,
                value: Object.keys(value).reduce((ret, key) => {
                    ret[key] =
                        process(assign({}, { required: false }, value[key]));
                    return ret;
                }, {}),
            };
        case 'oneOf': {
            return {
                name : 'enum',
                value: value.map(enumify)
            }
        }
        case 'instanceOf':
            return noUndefined({ name, value, required, description });
        case 'oneOfType':
            return {
                name : 'union',
                value: value.map(process)
            };
        case 'objectOf':
        case 'arrayOf':
        default:
            return noUndefined(
                { name, value: process(value), required, description });
    }
};
module.exports = function (propTypes = {}, defaultProps = {}) {
    propTypes = toDocs(propTypes);

    return Object.keys(propTypes).reduce((ret, key) => {
        const {
                  required          = false, value,
                  type, description = ''
              } = propTypes[key];

        ret[key] = noUndefined({
            description,
            required,
            defaultValue: defaultProps[key] != null ? enumify(defaultProps[key]) : void(0),
            type        : process({ type, value }),
            tags        : {}
        });

        return ret;

    }, {});
};
