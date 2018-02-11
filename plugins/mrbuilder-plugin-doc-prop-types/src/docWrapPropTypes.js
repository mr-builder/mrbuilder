let PropTypes = {};
try {
    PropTypes = require('prop-types-internal');
} catch (e) {
    PropTypes = require('prop-types');
}
const wrapType             = require('./wrapType').default;
const NOWRAP               = ['checkPropTypes', 'PropTypes'];
const WrappedPropTypes     = Object.keys(PropTypes).reduce(function (ret, key) {
    if (NOWRAP.includes(key)) {
        ret[key] = PropTypes[key];
    } else {
        ret[key] = wrapType(PropTypes[key], key);
    }
    return ret;
}, {});
WrappedPropTypes.PropTypes = WrappedPropTypes;

module.exports = WrappedPropTypes;
