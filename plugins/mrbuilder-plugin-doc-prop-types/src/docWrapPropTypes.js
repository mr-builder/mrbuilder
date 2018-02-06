let PropTypes;
try {
    PropTypes = require('prop-types-internal');
} catch (e) {
    PropTypes = require('prop-types');
}
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


const defineDoc = (f, value = {}) => defineProperty(f,
    '_doc', {
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

const wrapType = module.exports.wrapType = (type, validator) => {

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
const NOWRAP               = ['checkPropTypes'];
const WrappedPropTypes     = Object.keys(PropTypes).reduce(function (ret, key) {
    if (NOWRAP.includes(key)) {
        ret[key] = PropTypes[key];
    } else {
        ret[key] = wrapType(key, PropTypes[key]);
    }
    return ret;
}, {});
WrappedPropTypes.PropTypes = WrappedPropTypes;

module.exports = WrappedPropTypes;
