const { assign, defineProperty } = Object;
const isRequired                 = {
    required: true
};

const defineToJSON = (f, value) => defineDoc(
    defineProperty((...a) => f(...a), 'toJSON', {
        enumerable: false,
        writable  : false,
        value() {
            return value;
        }
    }), value);


const defineDoc = (f, value = {}) => defineProperty(f, '_doc', {
    enumerable: false,
    writable  : false,
    value(description) {
        return defineToJSON(f, assign({}, value, { description }));
    }
});

const defineRequired = (f, v, conf) => {
    const value = defineToJSON(v.isRequired, assign({}, conf, isRequired));

    return defineProperty(f, 'isRequired', {
        enumerable: false,
        value,
    });
};


const wrapType               = (validator, type) => {
    if (type == null) {
        type = validator.displayName || validator.name;
    }
    if (validator.length > 1) {
        const conf = { type };
        return defineRequired(defineToJSON(validator, conf), validator, conf);
    }
    return (value) => {
        const conf = {
            type, value
        };
        const v    = validator(value);
        return defineRequired(defineToJSON(v, conf), v,
            conf);
    }
};
/**
 *
 * @param propTypes the propTypes to wrap.
 * @param into - Default object, the object to wrap into, if not given it will create
 * a new Object otherwise it will modify what is passed into.
 * @returns {{}}
 */

export const wrapProps = (propTypes, into = {}) => {
    return Object.keys(propTypes)
                 .reduce((ret, key) => {
                     ret[key] =
                         wrapType(propTypes[key], key);
                     return ret;
                 }, into);
};
export default wrapType;
