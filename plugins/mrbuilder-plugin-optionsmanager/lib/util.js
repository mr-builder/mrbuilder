'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.merge = exports.mergeArgs = exports.mergeEnv = exports.parse = exports.camel = exports.nameConfig = exports.select = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _mrbuilderDevUtils = require('mrbuilder-dev-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var select = exports.select = function select() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    for (var i = 0, l = args.length; i < l; i++) {
        if (args[i] !== void 0) {
            return args[i];
        }
    }
};

var nameConfig = exports.nameConfig = function nameConfig(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
};

var camel = exports.camel = function camel() {
    var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var idx = arguments[1];
    return !v ? v : '' + (idx > 0 ? v[0].toUpperCase() : v[0].toLowerCase()) + v.substring(1).toLowerCase();
};

var parse = exports.parse = function parse(value, name) {
    try {
        return (0, _mrbuilderDevUtils.parseValue)(value);
    } catch (e) {
        console.warn('error parsing "%s" in [%s]', value, name);
        return;
    }
};

var mergeEnv = exports.mergeEnv = function mergeEnv(plugin) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process,
        env = _ref.env;

    if (options === false) {
        options = {};
    }

    var upperPlugin = plugin.toUpperCase();
    var keys = (0, _keys2.default)(env);
    var ret = (0, _assign2.default)({}, options);
    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        if (key === upperPlugin) {
            var value = (0, _mrbuilderDevUtils.configOrBool)(env[key]);
            if (value === false) {
                return false;
            } else {
                ret = parse(value, plugin);
            }
        }
        if (key.startsWith(upperPlugin)) {
            var keyPart = key.substring(upperPlugin.length + 1);
            var camelName = keyPart.split('_').map(camel).join('');
            (0, _mrbuilderDevUtils.set)(ret, camelName, parse(env[key], plugin));
        }
    }
    return ret;
};

var mergeArgs = exports.mergeArgs = function mergeArgs(plugin, options) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process,
        argv = _ref2.argv;

    if (options === false) {
        options = {};
    }

    var copy = [];
    var ret = (0, _assign2.default)({}, options);

    for (var i = 2, l = argv.length; i < l; i++) {
        var arg = argv[i];
        if (arg.startsWith('--')) {
            arg = arg.substring(2);
            if (arg === plugin) {
                return false;
            }
            if (arg.startsWith(plugin)) {
                var parts = arg.substring(plugin.length + 1).split('=', 2);
                var key = parts.shift().split('-').map(camel).join('');
                (0, _mrbuilderDevUtils.set)(ret, key, parts[0] ? parse(parts[0], arg) : false);
                continue;
            }
        }
        copy.push(arg);
    }
    argv.splice.apply(argv, [2, argv.length].concat(copy));
    return ret;
};
/**
 * Merge the env and args into the options.
 * Either a command line or an env variable can override a turned off component.
 *
 * resolution order
 * ENV,
 * ARG,
 * Plugin Options,
 * Options
 *
 *
 * @param plugin
 * @param options
 * @param process
 */

var merge = exports.merge = function merge(plugin, options, process) {
    if (options === false) {
        return false;
    }
    var ret = mergeArgs(plugin, options, process);
    if (ret === false) {
        return false;
    }
    return mergeEnv(plugin, ret, process);
};
//# sourceMappingURL=util.js.map
