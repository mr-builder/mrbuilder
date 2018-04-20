const { cwd, parseEntry } = require('mrbuilder-utils');
const DEV_SERVER          = {
    filename          : 'index.js',
    historyApiFallback: true,
    inline            : true,
    contentBase       : cwd('public'),
    port              : 8082
};

module.exports = function (opts, webpack) {
    const { socketTimeout, entry, rewrite } = opts;
    delete opts.socketTimeout;
    delete opts.noHot;
    delete opts.useExternals;
    delete opts.loader;
    delete opts.entry;
    delete opts.rewrite;

    const devServer = Object.assign({}, webpack.devServer, DEV_SERVER, opts);
    if (entry) {
        webpack.entry = parseEntry(entry);
    }
    if (devServer.devtool == null) {
        webpack.devtool = 'eval-source-map'
    } else {
        webpack.devtool = devServer.devtool;
        delete devServer.devtool;
    }
    webpack.devServer = devServer;

    //webpack dev server started, not being able to find loglevel.
    // google didn't show much, so... this is the thing now.
    webpack.resolve.alias.loglevel = require.resolve('loglevel');

    webpack.mode = 'development';

    //yeah, prolly should do this, but more is better?
    if (socketTimeout) {
        const { before }         = webpack.devServer;
        webpack.devServer.before = (app) => {
            before && before(app);
            app.use((req, res, next) => {
                req.socket.setTimeout(socketTimeout);
                next();
            })
        }
    }
    //rewrite urls a little different than proxy.

    if (rewrite) {
        const { before }         = webpack.devServer;
        const debug              = this.debug || console.log;
        webpack.devServer.before = (app) => {
            before && before.call(this, app);
            const addPath = ([key, val]) => {
                app.get(key, function (req, res, next) {
                    if (typeof val === 'string') {
                        const redirect = val.replace(/(?:\{(.+?)\})/g,
                            (a, v) => req.params[v]);
                        debug('redirecting to ', redirect);
                        res.redirect(302, redirect);
                    } else if (val === true) {
                        debug('sending empty string');
                        res.send('');
                    } else {
                        debug('calling next');
                        next();
                    }
                });
            };

            if (Array.isArray(rewrite)) {
                rewrite.forEach(
                    v => Array.isArray(v) ? addPath(v) : addPath([v.path,
                        v.value]));
            } else {
                Object.entries(rewrite).forEach(addPath);
            }
        }
    }

    return webpack;
};
