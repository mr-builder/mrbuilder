'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_ALL = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _mrbuilderUtils = require('mrbuilder-utils');

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            _ref$info = _ref.info,
            info = _ref$info === undefined ? console.info || console.warn : _ref$info,
            _ref$warn = _ref.warn,
            warn = _ref$warn === undefined ? console.warn : _ref$warn,
            _ref$_require = _ref._require,
            _require = _ref$_require === undefined ? require : _ref$_require;

        _classCallCheck(this, OptionsManager);

        this.plugins = new Map();

        if (!prefix) {
            prefix = (0, _path.basename)(argv[1]).split('-').shift();
        }
        prefix = prefix.toUpperCase();
        envPrefix = envPrefix || prefix.toUpperCase();
        confPrefix = confPrefix || prefix.toLowerCase();
        rcFile = '.' + confPrefix + 'rc';
        this.require = _require;

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

        this.info('NODE_ENV is', env.NODE_ENV || 'not set');
        this.info('topPackage is ', this.topPackage.name);

        var resolveFromPkgDir = function resolveFromPkgDir(pkg, file) {
            for (var _len4 = arguments.length, relto = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                relto[_key4 - 2] = arguments[_key4];
            }

            if (!pkg || _this.topPackage.name === pkg) {
                if (file === 'package.json') {
                    pkg = _this.cwd(file);
                }
                return _this.cwd.apply(_this, [file].concat(relto));
            }
            if (file === 'package.json') {
                return (0, _path.resolve)((0, _path.join)(pkg, file));
            }
            return _path.resolve.apply(undefined, [_require.resolve((0, _path.join)(pkg, 'package.json')), '..', file].concat(relto));
        };

        var resolveConfig = function resolveConfig(pkg) {
            if (typeof pkg === 'string') {
                if (pkg === _this.topPackage.name) {
                    pkg = _this.topPackage;
                } else {
                    try {
                        pkg = _require((0, _path.join)(pkg, 'package.json'));
                    } catch (e) {
                        console.warn('could not require "%s/package.json" from "%s"', pkg, process.cwd());
                        throw e;
                    }
                }
            }
            var pluginConfig = pkg[confPrefix] || (0, _mrbuilderUtils.parseJSON)(resolveFromPkgDir(pkg.name, rcFile)) || {};

            var envOverride = pluginConfig.env && pluginConfig.env[env.NODE_ENV] || {};
            return {
                presets: (0, _util.select)(envOverride.presets, pluginConfig.presets),
                options: (0, _util.select)(envOverride.options, pluginConfig.options),
                plugins: (0, _util.select)(envOverride.plugins, pluginConfig.plugins),
                ignoreRc: (0, _util.select)(envOverride.ignoreRc, pluginConfig.ignoreRc),
                plugin: (0, _util.select)(envOverride.plugin, pluginConfig.plugin)
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

        var processPlugin = function processPlugin(includedFrom, plugin, override, parent) {
            var _nameConfig = (0, _util.nameConfig)(plugin),
                _nameConfig2 = _slicedToArray(_nameConfig, 2),
                pluginName = _nameConfig2[0],
                _nameConfig2$ = _nameConfig2[1],
                pluginOpts = _nameConfig2$ === undefined ? override : _nameConfig2$;

            var pluginSrc = pluginName;
            var ret = pluginName;
            if (pluginName.startsWith('.')) {
                pluginSrc = (0, _path.join)(includedFrom, pluginName);
                ret = false;
            } else {
                var pConfig = resolveConfig(plugin);
                if (pConfig) {
                    var _nameConfig3 = (0, _util.nameConfig)(pConfig.plugin),
                        _nameConfig4 = _slicedToArray(_nameConfig3, 2),
                        rPluginName = _nameConfig4[0],
                        _nameConfig4$ = _nameConfig4[1],
                        rPluginOpts = _nameConfig4$ === undefined ? pluginOpts : _nameConfig4$;

                    if (rPluginName) {
                        pluginSrc = (0, _path.join)(plugin, rPluginName);
                        pluginOpts = rPluginOpts;
                    }
                }
            }

            if (_this.plugins.has(pluginName)) {
                return;
            }
            //nothing enables a disabled plugin.
            if (pluginOpts === false) {
                _this.plugins.set(pluginName, false);
                return;
            }

            pluginOpts = (0, _util.merge)(pluginName, pluginOpts, { env: env, argv: argv });

            _this.plugins.set(pluginName, newOption(pluginName, pluginSrc, pluginOpts, parent));
            return ret;
        };

        var processOpts = function processOpts(name) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                presets = _ref2.presets,
                plugins = _ref2.plugins,
                ignoreRc = _ref2.ignoreRc;

            var options = arguments[2];
            var pkg = arguments[3];
            var parent = arguments[4];
            var override = arguments[5];

            if (plugins) {
                plugins.map(function (plugin) {
                    return processPlugin(pkg.name, plugin, override, pkg);
                }).filter(Boolean).forEach(function (pluginName) {
                    scan(ignoreRc, pkg, pluginName, void 0, override);
                });
            }

            if (presets) {
                //presets all get the same configuration.
                presets.forEach(function (preset) {
                    var _nameConfig5 = (0, _util.nameConfig)(preset),
                        _nameConfig6 = _slicedToArray(_nameConfig5, 2),
                        presetName = _nameConfig6[0],
                        config = _nameConfig6[1];

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
                processOpts(envPrefix + '_' + prefix + 'ENV', { plugins: plugins, presets: presets, plugin: false }, void 0, _this.topPackage);
            }
        };
        var scan = function scan(ignoreRc, parent, name, options, override) {
            _this.info('scanning', name);

            var pkg = name === _this.topPackage.name ? _this.topPackage : _require(name + '/package.json');
            if (Array.isArray(name)) {
                throw new Error(name + ' can not be an array import from ' + (parent && parent.name));
            }

            var pluginConf = resolveConfig(pkg);

            processOpts(name, pluginConf, options, pkg, parent, override);
        };

        processEnv();
        scan(false, this.topPackage, this.topPackage.name);
        //ALLOW for fallbacks when tooling wants to signal things.
        processEnv('INTERNAL_');
    }

    _createClass(OptionsManager, [{
        key: 'config',
        value: function config(name, def) {
            var parts = name.split('.', 2);
            var key = parts.shift();
            if (!this.enabled(key)) {
                //if not enabled no default.
                return;
            }
            var config = this.plugins.get(key).config;
            return (0, _mrbuilderUtils.get)(config, parts.shift(), def);
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
        _classCallCheck(this, Option);

        this.name = name;
        this.plugin = plugin;
        this.config = config;
        this.parent = parent;
    }

    _createClass(Option, [{
        key: 'info',
        value: function info() {
            var _ref3;

            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            (_ref3 = this.optionsManager || console).info.apply(_ref3, ['- ' + this.name].concat(args));
        }
    }, {
        key: 'warn',
        value: function warn() {
            var _ref4;

            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            (_ref4 = this.optionsManager || console).warn.apply(_ref4, ['- ' + this.name].concat(args));
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