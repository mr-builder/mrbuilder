// Karma configuration
const path = require('path');
const {cwd, stringify} = require('@mrbuilder/utils');
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
//we allow for running this script directly so can be run in IDE's.
const optionsManager = require('@mrbuilder/cli').default;
const logger = optionsManager.logger('@mrbuilder/plugin-karma');
const fs = require('fs');


module.exports = function (config) {
    //karma doesn't handle async webpack configuration.
    const webpack = global._MRBUILDER_WEBPACK_;

    const mrb = (key, def) => optionsManager.config(`@mrbuilder/plugin-karma.${key}`, def);


    const chromeDataDir = mrb('chromeDataDir', path.resolve(process.env.HOME, '.@mrbuilder/chrome'));
    const useCoverage = mrb('coverage');
    const frameworks = mrb('frameworks', ['mocha']);
    const basePath = mrb('basePath', cwd());
    const preprocessors = mrb('preprocessors', ['webpack', 'sourcemap']);
    const browsers = mrb('browsers', ['Chrome']);
    const port = mrb('port', 9876);
    const reporters = mrb('reports', ['spec']);
    const colors = mrb('colors', true);
    const customLaunchers = mrb('customLaunchers', {
        Chrome_with_debugging: {
            base: 'Chrome',
            chromeDataDir,
        },
        Chrome_travis_ci: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox'],
        },
        SimpleHeadlessChrome: {
            base: 'ChromeHeadless',
            flags: ['--disable-translate', '--disable-extensions', '--remote-debugging-port=9223'],
        },
    });
    //otherwise bad things happen, some kind file not found exception.
    webpack.entry = null;

    webpack.devtool = mrb('devtool', 'inline-source-map');
    const testIndex = mrb('testIndex', path.resolve(__dirname, 'test-index.js'));
    const files = mrb('files', [testIndex]);

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
        preprocessors: files.reduce(function (ret, file) {
            if (typeof file === 'string') {
                ret[file] = preprocessors;
            }
            return ret;
        }, {}),


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
        plugins: [
            require('karma-mocha'),
            require('karma-chrome-launcher'),
            require('karma-firefox-launcher'),
            require('karma-spec-reporter'),
            require('karma-sourcemap-loader'),
            require('karma-webpack'),
        ],
    };
    if (useCoverage) {
        karmaConf.reporters.push('coverage-istanbul');

        karmaConf.coverageIstanbulReporter = {
            reports: ['lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true,
            skipFilesWithNoCoverage: true,
            dir: optionsManager,
        };
        karmaConf.plugins.push('karma-coverage-istanbul-reporter');
    }

    config.set(karmaConf);
    if (fs.existsSync(mrb('karmaConf', cwd('karma.conf.js')))) {
        require(cwd('karma.conf.js')(config));
    }
    logger.debug('karma configuration', stringify(config));
};
