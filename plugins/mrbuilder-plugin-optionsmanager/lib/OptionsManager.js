'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_ALL = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _mrbuilderDevUtils = require('mrbuilder-dev-utils');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var split = function split() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return (Array.isArray(value) ? value : value.split(/,\s*/)).filter(Boolean);
};

var DEFAULT_ALL = exports.DEFAULT_ALL = ['DEBUG', 'ENABLE', 'DISABLE', 'PLUGINS', 'PRESETS', 'MODULE_DIR'];

var OptionsManager = function () {
    function OptionsManager() {
        var _this = this;

        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            prefix = _ref.prefix,
            envPrefix = _ref.envPrefix,
            confPrefix = _ref.confPrefix,
            rcFile = _ref.rcFile,
            _ref$all = _ref.all,
            all = _ref$all === undefined ? DEFAULT_ALL : _ref$all,
            _ref$env = _ref.env,
            env = _ref$env === undefined ? process.env : _ref$env,
            _ref$argv = _ref.argv,
            argv = _ref$argv === undefined ? process.argv : _ref$argv,
            _ref$cwd = _ref.cwd,
            cwd = _ref$cwd === undefined ? process.cwd : _ref$cwd,
            webpackFilePath = _ref.webpackFilePath,
            _ref$info = _ref.info,
            info = _ref$info === undefined ? console.info || console.warn : _ref$info,
            _ref$warn = _ref.warn,
            warn = _ref$warn === undefined ? console.warn : _ref$warn,
            _ref$_require = _ref._require,
            _require = _ref$_require === undefined ? require : _ref$_require;

        (0, _classCallCheck3.default)(this, OptionsManager);
        this.plugins = new _map2.default();

        prefix = prefix.toUpperCase();
        envPrefix = envPrefix || prefix.toUpperCase();
        confPrefix = confPrefix || prefix.toLowerCase();
        rcFile = '.' + confPrefix + 'rc';

        var webpackFile = webpackFilePath || envPrefix.toLowerCase() + '-webpack.config.js';

        this.env = function (key, def) {
            var ret = env[key.toUpperCase()];
            if (ret === null || ret === void 0) {
                return def;
            }
            return ret;
        };

        this.cwd = function () {
            for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
                paths[_key] = arguments[_key];
            }

            return _path.resolve.apply(undefined, [_this.env('MODULE_DIR', cwd())].concat(paths));
        };
        this.topPackage = _require(this.cwd('package.json'));

        this.warn = function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            warn.apply(undefined, ['WARN [' + prefix.toLowerCase() + ']'].concat(args));
        };

        this.info = function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            if (_this.env(envPrefix + '_DEBUG')) {
                info.apply(undefined, ['INFO [' + prefix.toLowerCase() + ']'].concat(args));
            }
        };

        this.info('NODE_ENV is', env.NODE_ENV);

        var resolveFromPkgDir = function resolveFromPkgDir(pkg, file) {
            for (var _len4 = arguments.length, relto = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                relto[_key4 - 2] = arguments[_key4];
            }

            if (!pkg || _this.topPackage.name === pkg) {
                if (file === 'package.json') {
                    return _this.topPackage;
                }
                return _this.cwd.apply(_this, [file].concat(relto));
            }
            if (file === 'package.json') {
                return _require.resolve((0, _path.join)(pkg, file));
            }
            return _path.resolve.apply(undefined, [_require.resolve((0, _path.join)(pkg, 'package.json')), '..', file].concat(relto));
        };

        var resolveConfig = function resolveConfig(pkg) {
            if (typeof pkg === 'string') {
                pkg = _require(pkg + '/package.json');
            }
            var pluginConfig = pkg[confPrefix] || (0, _mrbuilderDevUtils.parseJSON)(resolveFromPkgDir(pkg.name, rcFile)) || {};

            var envOverride = pluginConfig.env && pluginConfig.env[env.NODE_ENV] || {};
            return {
                presets: (0, _util.select)(envOverride.presets, pluginConfig.presets),
                options: (0, _util.select)(envOverride.options, pluginConfig.options),
                plugins: (0, _util.select)(envOverride.plugins, pluginConfig.plugins),
                webpack: (0, _util.select)(envOverride.webpack, pluginConfig.webpack),
                ignoreRc: (0, _util.select)(envOverride.ignoreRc, pluginConfig.ignoreRc)
            };
        };

        var newOption = function newOption(name, plugin, config, parent) {
            if (config === false) {
                return false;
            }
            var opt = new Option(name, plugin, config, parent);
            opt.optionsManager = _this;
            return opt;
        };

        var processOpts = function processOpts(name) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                presets = _ref2.presets,
                plugins = _ref2.plugins,
                ignoreRc = _ref2.ignoreRc,
                webpack = _ref2.webpack;

            var options = arguments[2];
            var pkg = arguments[3];
            var parent = arguments[4];
            var override = arguments[5];

            if (_this.plugins.has(name)) {
                return;
            }

            if (options === false) {
                _this.plugins.set(name, false);
                return;
            } else {
                var plugin = void 0;
                if (webpack) {
                    plugin = require(resolveFromPkgDir(name, webpack === true ? webpackFile : webpack));
                }
                _this.plugins.set(name, newOption(name, plugin, options, pkg));
            }

            if (plugins) {
                plugins.map(function (plugin) {
                    var _nameConfig = (0, _util.nameConfig)(plugin),
                        _nameConfig2 = (0, _slicedToArray3.default)(_nameConfig, 2),
                        pluginName = _nameConfig2[0],
                        pluginOpts = _nameConfig2[1];

                    if (pluginOpts === false) {
                        _this.plugins.set(pluginName, false);
                        return;
                    }
                    var isLocal = pluginName.startsWith('.');
                    if (isLocal) {
                        var localName = (0, _path.join)(name, pluginName);
                        _this.plugins.set(localName, newOption(localName, require(localName), pluginOpts, pkg));
                        return;
                    }
                    return [pluginName, override || pluginOpts];
                }).filter(Boolean).forEach(function (_ref3) {
                    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
                        pluginName = _ref4[0],
                        pluginOpts = _ref4[1];

                    scan(ignoreRc, pkg, pluginName, pluginOpts);
                });
            }

            if (presets) {
                //presets all get the same configuration.
                presets.forEach(function (preset) {
                    var _nameConfig3 = (0, _util.nameConfig)(preset),
                        _nameConfig4 = (0, _slicedToArray3.default)(_nameConfig3, 2),
                        presetName = _nameConfig4[0],
                        config = _nameConfig4[1];

                    scan(ignoreRc, pkg, presetName, void 0, config);
                });
            }
        };
        var processEnv = function processEnv() {
            var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            var pluginsName = envPrefix + '_' + prefix + 'PLUGINS';
            var presetsName = envPrefix + '_' + prefix + 'PRESETS';
            var plugins = split(_this.env(pluginsName, ''));
            var presets = split(_this.env(presetsName, ''));
            if (plugins.length || presets.length) {
                _this.info('process from env', pluginsName, plugins, presetsName, presets);
                processOpts(envPrefix + '_' + prefix + 'ENV', { plugins: plugins, presets: presets }, void 0, _this.topPackage);
            }
        };
        var scan = function scan(ignoreRc, parent, name, options, override) {
            _this.info('scanning', name);

            var pkg = name === _this.topPackage.name ? _this.topPackage : _require(name + '/package.json');
            if (Array.isArray(name)) {
                throw new Error(name + ' can not be an array import from ' + (parent && parent.name));
            }

            var pluginConf = resolveConfig(pkg);

            options = (0, _util.merge)(name, options || pluginConf.options, { env: env, argv: argv });

            processOpts(name, pluginConf, options, pkg, parent, override);
        };

        processEnv();
        scan(false, this.topPackage, this.topPackage.name);
        //ALLOW for fallbacks when tooling wants to signal things.
        processEnv('INTERNAL_');
    }

    (0, _createClass3.default)(OptionsManager, [{
        key: 'config',
        value: function config(name, def) {
            var parts = name.split('.', 2);
            var key = parts.shift();
            if (!this.enabled(key)) {
                return false;
            }
            var config = this.plugins.get(key).config;
            return (0, _mrbuilderDevUtils.get)(config, parts.shift(), def);
        }
    }, {
        key: 'enabled',
        value: function enabled(name) {
            return !!this.plugins.get(name);
        }

        //make nice stringify

    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                name: this.topPackage.name,
                plugins: this.plugins
            };
        }
    }]);
    return OptionsManager;
}();

exports.default = OptionsManager;

var Option = function () {
    function Option(name, plugin, config, parent) {
        (0, _classCallCheck3.default)(this, Option);

        this.name = name;
        this.plugin = plugin;
        this.config = config;
        this.parent = parent;
    }

    (0, _createClass3.default)(Option, [{
        key: 'info',
        value: function info() {
            var _ref5;

            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            (_ref5 = this.optionsManager || console).info.apply(_ref5, ['- ' + this.name].concat(args));
        }
    }, {
        key: 'warn',
        value: function warn() {
            var _ref6;

            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            (_ref6 = this.optionsManager || console).warn.apply(_ref6, ['- ' + this.name].concat(args));
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                name: this.name,
                plugin: typeof this.plugin === 'function' ? this.plugin.name || '[function]' : this.plugin,
                config: this.config,
                parent: '[' + (this.parent && this.parent.name) + ']'
            };
        }
    }]);
    return Option;
}();
//# sourceMappingURL=OptionsManager.js.map
