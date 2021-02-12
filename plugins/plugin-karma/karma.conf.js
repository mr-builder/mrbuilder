// Karma configuration
const path                   = require('path');
const {cwd, logObject}       = require('@mrbuilder/utils');
process.env.NODE_ENV         = process.env.NODE_ENV || 'test';
//we allow for running this script directly so can be run in IDE's.
const {Info, optionsManager} = require('@mrbuilder/cli');
const logger                 = optionsManager.logger('@mrbuilder/plugin-karma');
const fs                     = require('fs');
const mrb                    = (key, def) => optionsManager.config(`@mrbuilder/plugin-karma.${key}`, def);

module.exports = function (config) {
    //karma doesn't handle async webpack configuration.
    const webpack         = global._MRBUILDER_WEBPACK_;
    const chromeDataDir   = mrb('chromeDataDir', path.resolve(process.env.HOME, '.@mrbuilder/chrome'));
    const useCoverage     = mrb('coverage');
    const frameworks      = mrb('frameworks', ['mocha']);
    const basePath        = mrb('basePath', cwd());
    const _preprocessors   = mrb('preprocessors', ['webpack', 'sourcemap']);
    const _browsers       = mrb('browsers', ['Chrome']);
    const browsers        = Array.isArray(_browsers) ? _browsers : _browsers == null ? ['Chrome'] : _browsers.split(',');
    const port            = mrb('port', 9876);
    const reporters       = mrb('reports', ['spec']);
    const colors          = mrb('colors', true);
    const plugins         = mrb('plugins',   [
        'karma-mocha',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-spec-reporter',
        'karma-sourcemap-loader',
        'karma-webpack',
    ]);
    

    const customLaunchers = mrb('customLaunchers', {
        Chrome_with_debugging: {
            base: 'Chrome',
            chromeDataDir,
        },
        Chrome_travis_ci     : {
            base : 'ChromeHeadless',
            flags: ['--no-sandbox'],
        },
        ChromeHeadlessCI     : {
            base : 'ChromeHeadless',
            flags: ['--no-sandbox', '--disable-extensions']
        },
        SimpleHeadlessChrome : {
            base : 'ChromeHeadless',
            flags: ['--disable-translate', '--disable-extensions', '--remote-debugging-port=9223'],
        },
    });
    //otherwise bad things happen, some kind file not found exception.

    webpack.devtool = mrb('devtool', 'inline-source-map');
    const testIndex = mrb('testIndex', path.resolve(__dirname, 'test-index.js'));
    const files     = mrb('files', [testIndex]);
    webpack.entry   = testIndex;
    const preprocessors =  Array.isArray(_preprocessors) ? files.reduce(function (ret, file) {
        if (typeof file === 'string') {
            ret[file] = _preprocessors;
        }
        return ret;
    }, {}) : (files || []).reduce(function (ret, file) {
        if (typeof file === 'string') {
            ret[file] = ['webpack', 'sourcemap'];
        }
        return ret;
    }, _preprocessors || {});
    logger.info('files:' + files + ' browsers:' + browsers);

    const karmaConf = {

        // base path, that will be used to resolve files and exclude
        basePath,


        // frameworks to use
        frameworks,


        // list of files / patterns to load in the browser
        files,

        customLaunchers,

        // list of preprocessors
        preprocessors,


        webpack,

        webpackMiddleware: {
            stats: {
                colors,
            },
        },


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters,


        // web server port
        port,


        // enable / disable colors in the output (reporters and logs)
        colors,


        /**
         * level of logging
         *
         * possible values:
         * config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
         * config.LOG_INFO    || config.LOG_DEBUG
         */
        logLevel: mrb('logLevel', config.LOG_INFO),


        // enable / disable watching file and executing tests whenever any file
        // changes
        autoWatch: mrb('autoWatch', true),


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install
        // karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install
        // karma-safari-launcher`) - PhantomJS - IE (only Windows; has to be
        // installed with `npm install karma-ie-launcher`)
        browsers,


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: mrb('captureTimeout', 60000),

        // List plugins explicitly, since autoloading karma-webpack
        // won't work here
        plugins: plugins.map(v=>{
            try {
                return require(v.replace(/^(?:karma-)?/, 'karma-'));
            }catch(e){
                try {
                    require(v);
                }catch(e){
                    return v;
                }
            }
        }),
    };
    if (useCoverage) {
        karmaConf.reporters.push('coverage-istanbul');

        karmaConf.coverageIstanbulReporter = {
            reports                : ['lcovonly', 'text-summary'],
            fixWebpackSourcePaths  : true,
            skipFilesWithNoCoverage: true,
            dir                    : optionsManager,
        };
        karmaConf.plugins.push('karma-coverage-istanbul-reporter');
    }

    const localKarmaConfig = mrb('karmaConf', cwd('karma.conf.js'));
    if (fs.existsSync(localKarmaConfig)) {
        logger.info('loading ', localKarmaConfig);
        config.set(require(localKarmaConfig)(karmaConf));
    }
    logObject('karma configuration', Info.isDebug, karmaConf);
    config.set(karmaConf);
    return karmaConf;
};
